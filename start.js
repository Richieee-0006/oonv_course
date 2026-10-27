#!/usr/bin/env node
/**
 * Cross-Platform Universal Installer & Launcher (Windows / Linux / macOS)
 * Usage:
 *   node start.js             -> Installs dependencies if needed, warms up .NET, starts servers, opens browser
 *   node start.js --setup     -> Only installs dependencies & prepares .NET sandbox (does not start servers)
 *   node start.js --no-open   -> Starts servers without opening a browser window
 *   node start.js --app       -> Opens in chromeless Web App mode (--app) if supported
 */
const fs = require('fs');
const path = require('path');
const http = require('http');
const { spawn, execFileSync } = require('child_process');

const ROOT_DIR = __dirname;
const SERVER_DIR = path.join(ROOT_DIR, 'server');
const CLIENT_DIR = path.join(ROOT_DIR, 'client');
const SANDBOX_DIR = path.join(SERVER_DIR, 'dotnet-sandbox');
const CSPROJ_PATH = path.join(SANDBOX_DIR, 'Sandbox.csproj');

const IS_WIN = process.platform === 'win32';
const IS_MAC = process.platform === 'darwin';
const NPM_CMD = IS_WIN ? 'npm.cmd' : 'npm';

const args = process.argv.slice(2);
const SETUP_ONLY = args.includes('--setup') || args.includes('--install-only');
const NO_OPEN = args.includes('--no-open');
const APP_MODE = args.includes('--app');

function log(msg) {
  console.log(`\x1b[36m[kurz]\x1b[0m ${msg}`);
}

function logOk(msg) {
  console.log(`\x1b[32m[OK]\x1b[0m ${msg}`);
}

function logWarn(msg) {
  console.log(`\x1b[33m[!]\x1b[0m ${msg}`);
}

function findDotnetBin() {
  if (process.env.DOTNET_PATH && fs.existsSync(process.env.DOTNET_PATH)) {
    return process.env.DOTNET_PATH;
  }
  const candidates = IS_WIN
    ? [
        'dotnet',
        'C:\\Program Files\\dotnet\\dotnet.exe',
        path.join(process.env.USERPROFILE || '', '.dotnet', 'dotnet.exe')
      ]
    : [
        'dotnet',
        '/usr/bin/dotnet',
        '/usr/local/share/dotnet/dotnet',
        '/usr/share/dotnet/dotnet',
        path.join(process.env.HOME || '', '.dotnet', 'dotnet')
      ];

  for (const bin of candidates) {
    try {
      const ver = execFileSync(bin, ['--version'], { stdio: ['ignore', 'pipe', 'ignore'] })
        .toString()
        .trim();
      if (ver) return { bin, version: ver };
    } catch {}
  }
  return null;
}

function runSyncCommand(cmd, cmdArgs, cwd) {
  execFileSync(cmd, cmdArgs, {
    cwd,
    stdio: 'inherit',
    shell: IS_WIN
  });
}

function ensureDependencies(forceInstall = false) {
  // 1. Check .NET SDK & align TargetFramework
  const dotnetInfo = findDotnetBin();
  if (dotnetInfo) {
    logOk(`Detekován .NET SDK ${dotnetInfo.version}`);
    const major = parseInt(dotnetInfo.version.split('.')[0], 10);
    if (major >= 6 && fs.existsSync(CSPROJ_PATH)) {
      const currentCsproj = fs.readFileSync(CSPROJ_PATH, 'utf8');
      const targetTfm = `<TargetFramework>net${major}.0</TargetFramework>`;
      if (!currentCsproj.includes(targetTfm)) {
        const updated = currentCsproj.replace(
          /<TargetFramework>net\d+\.\d+<\/TargetFramework>/,
          targetTfm
        );
        fs.writeFileSync(CSPROJ_PATH, updated, 'utf8');
        log(`Sandbox.csproj automaticky přepnut na net${major}.0`);
      }
    }
  } else {
    logWarn('.NET SDK nebyl nalezen v PATH. Aplikace poběží s vestavěným offline simulátorem.');
    logWarn('Pro skutečnou kompilaci C# si nainstaluj .NET SDK (https://dot.net/download).');
  }

  // 2. Install server/node_modules if needed
  if (forceInstall || !fs.existsSync(path.join(SERVER_DIR, 'node_modules'))) {
    log('Instaluji závislosti backendu (server/)...');
    runSyncCommand(NPM_CMD, ['install', '--no-audit', '--no-fund'], SERVER_DIR);
  }

  // 3. Install client/node_modules if needed
  if (forceInstall || !fs.existsSync(path.join(CLIENT_DIR, 'node_modules'))) {
    log('Instaluji závislosti frontendu (client/)...');
    runSyncCommand(NPM_CMD, ['install', '--no-audit', '--no-fund'], CLIENT_DIR);
  }

  // 4. Warm up .NET Sandbox
  if (dotnetInfo && (forceInstall || !fs.existsSync(path.join(SANDBOX_DIR, 'obj', 'project.assets.json')))) {
    try {
      log('Připravuji .NET Roslyn sandbox (dotnet restore & build)...');
      execFileSync(dotnetInfo.bin, ['restore', '-v', 'quiet', '--nologo'], { cwd: SANDBOX_DIR, stdio: 'inherit' });
      execFileSync(dotnetInfo.bin, ['build', '-v', 'quiet', '--nologo'], { cwd: SANDBOX_DIR, stdio: 'inherit' });
    } catch (e) {
      logWarn(`Příprava .NET sandboxu skončila varováním: ${e.message}`);
    }
  }
}

function checkUrl(url) {
  return new Promise((resolve) => {
    const req = http.get(url, { timeout: 1500 }, (res) => {
      res.resume();
      resolve(res.statusCode >= 200 && res.statusCode < 500);
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
  });
}

function openBrowser(url) {
  if (NO_OPEN) return;

  try {
    if (IS_WIN) {
      spawn('cmd', ['/c', 'start', '', url], { detached: true, stdio: 'ignore' }).unref();
    } else if (IS_MAC) {
      spawn('open', [url], { detached: true, stdio: 'ignore' }).unref();
    } else {
      if (APP_MODE) {
        const launchSh = path.join(ROOT_DIR, 'bin', 'launch-app.sh');
        if (fs.existsSync(launchSh)) {
          spawn('bash', [launchSh], { detached: true, stdio: 'ignore' }).unref();
          return;
        }
      }
      spawn('xdg-open', [url], { detached: true, stdio: 'ignore' }).unref();
    }
  } catch {}
}

async function main() {
  ensureDependencies(SETUP_ONLY);

  if (SETUP_ONLY) {
    logOk('Instalace a příprava prostředí je hotová! Spusť aplikaci příkazem: npm start');
    return;
  }

  const children = [];

  const backendUp = await checkUrl('http://localhost:3001/api/health');
  if (backendUp) {
    logOk('Backend již běží na http://localhost:3001');
  } else {
    log('Spouštím .NET Runner Backend (http://localhost:3001)...');
    const srv = spawn(NPM_CMD, ['start'], {
      cwd: SERVER_DIR,
      stdio: 'inherit',
      shell: IS_WIN
    });
    children.push(srv);
  }

  const frontendUp = await checkUrl('http://localhost:5173');
  if (frontendUp) {
    logOk('Frontend již běží na http://localhost:5173');
  } else {
    log('Spouštím Vite Frontend (http://localhost:5173)...');
    const cli = spawn(NPM_CMD, ['run', 'dev'], {
      cwd: CLIENT_DIR,
      stdio: 'inherit',
      shell: IS_WIN
    });
    children.push(cli);
  }

  // Wait up to 20s for frontend to listen, then open browser
  for (let i = 0; i < 40; i++) {
    const ok = await checkUrl('http://localhost:5173');
    if (ok) {
      logOk('Aplikace je připravena na: http://localhost:5173');
      openBrowser('http://localhost:5173');
      break;
    }
    await new Promise((r) => setTimeout(r, 500));
  }

  if (children.length > 0) {
    const cleanup = () => {
      for (const ch of children) {
        try {
          ch.kill('SIGTERM');
        } catch {}
      }
      process.exit(0);
    };
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

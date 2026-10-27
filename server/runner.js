const fs = require('fs');
const path = require('path');
const { spawn, execFile } = require('child_process');

const DOTNET_BIN = process.env.DOTNET_PATH || (fs.existsSync('/usr/bin/dotnet') ? '/usr/bin/dotnet' : 'dotnet');
const SANDBOX_DIR = path.resolve(__dirname, 'dotnet-sandbox');
const PROGRAM_PATH = path.join(SANDBOX_DIR, 'Program.cs');

// Async FIFO queue to ensure only one build/run operates in the sandbox directory at a time
class AsyncQueue {
  constructor() {
    this.chain = Promise.resolve();
  }

  enqueue(fn) {
    const result = this.chain.then(fn, fn);
    this.chain = result.catch(() => {});
    return result;
  }
}

const sandboxQueue = new AsyncQueue();

/**
 * Get installed .NET SDK version
 */
function getDotnetVersion() {
  return new Promise((resolve, reject) => {
    execFile(DOTNET_BIN, ['--version'], (error, stdout) => {
      if (error) {
        return reject(new Error(`Failed to query dotnet version: ${error.message}`));
      }
      resolve(stdout.trim());
    });
  });
}

/**
 * Parse Roslyn compiler error/warning diagnostics
 */
function parseRoslynDiagnostics(rawText) {
  if (!rawText) return [];
  const lines = rawText.split('\n');
  const diagnostics = [];
  const seen = new Set();

  const regex = /(?:.*[\\/])?([^\\/]+)\((\d+),(\d+)\):\s*(error|warning|info)\s+([A-Za-z0-9]+):\s*(.+?)(?:\s*\[.*\])?$/;

  for (const line of lines) {
    const match = line.trim().match(regex);
    if (match) {
      const file = match[1];
      const lineNum = parseInt(match[2], 10);
      const column = parseInt(match[3], 10);
      const severity = match[4].toLowerCase();
      const code = match[5];
      const message = match[6].trim();

      const key = `${lineNum}:${column}:${code}:${message}`;
      if (!seen.has(key)) {
        seen.add(key);
        diagnostics.push({
          file,
          line: lineNum,
          column,
          severity,
          code,
          message
        });
      }
    }
  }

  return diagnostics;
}

/**
 * Find the built Sandbox.dll file path
 */
function getSandboxDllPath() {
  // Check net10.0 first
  const primaryPath = path.join(SANDBOX_DIR, 'bin', 'Debug', 'net10.0', 'Sandbox.dll');
  if (fs.existsSync(primaryPath)) {
    return primaryPath;
  }

  // Fallback search in bin/Debug/*
  const debugDir = path.join(SANDBOX_DIR, 'bin', 'Debug');
  if (fs.existsSync(debugDir)) {
    const tfms = fs.readdirSync(debugDir);
    for (const tfm of tfms) {
      const candidate = path.join(debugDir, tfm, 'Sandbox.dll');
      if (fs.existsSync(candidate)) {
        return candidate;
      }
    }
  }

  return primaryPath;
}

/**
 * Kill process group safely
 */
function killProcessGroup(pid) {
  if (!pid) return;
  try {
    process.kill(-pid, 'SIGKILL');
  } catch (err) {
    try {
      process.kill(pid, 'SIGKILL');
    } catch (e) {}
  }
}

/**
 * Compile C# code using dotnet build --no-restore
 */
function compileCodeInternal(code) {
  return new Promise((resolve) => {
    try {
      fs.writeFileSync(PROGRAM_PATH, code, 'utf8');
    } catch (err) {
      return resolve({
        success: false,
        diagnostics: [],
        output: '',
        error: `Failed to write code to sandbox: ${err.message}`
      });
    }

    const start = Date.now();
    execFile(
      DOTNET_BIN,
      ['build', '--no-restore', '-v', 'quiet', '--nologo'],
      { cwd: SANDBOX_DIR, maxBuffer: 10 * 1024 * 1024 },
      (error, stdout, stderr) => {
        const buildDuration = Date.now() - start;
        const combinedOutput = `${stdout || ''}\n${stderr || ''}`.trim();
        const diagnostics = parseRoslynDiagnostics(combinedOutput);

        if (error) {
          resolve({
            success: false,
            diagnostics,
            output: stdout || '',
            error: combinedOutput,
            buildTimeMs: buildDuration
          });
        } else {
          resolve({
            success: true,
            diagnostics,
            output: stdout || 'Build succeeded.',
            error: '',
            buildTimeMs: buildDuration
          });
        }
      }
    );
  });
}

/**
 * Build endpoint entry point with queue
 */
function buildCSharp(code) {
  return sandboxQueue.enqueue(() => compileCodeInternal(code));
}

/**
 * Execute compiled binary directly using dotnet Sandbox.dll
 */
function executeBinary({ dllPath, timeoutMs = 8000, stdin = '' }) {
  return new Promise((resolve) => {
    const start = Date.now();
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    let finished = false;

    const child = spawn(DOTNET_BIN, [dllPath], {
      cwd: SANDBOX_DIR,
      detached: true,
      stdio: ['pipe', 'pipe', 'pipe']
    });

    const timer = setTimeout(() => {
      timedOut = true;
      killProcessGroup(child.pid);
    }, timeoutMs);

    child.stdout.on('data', (chunk) => {
      stdout += chunk.toString();
      // Safeguard against runaway output spam
      if (stdout.length > 2 * 1024 * 1024) {
        killProcessGroup(child.pid);
      }
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
      if (stderr.length > 2 * 1024 * 1024) {
        killProcessGroup(child.pid);
      }
    });

    child.on('error', (err) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      resolve({
        success: false,
        output: stdout,
        error: `Failed to spawn process: ${err.message}`,
        executionTimeMs: Date.now() - start,
        exitCode: 1
      });
    });

    child.on('close', (code, signal) => {
      if (finished) return;
      finished = true;
      clearTimeout(timer);
      const executionTimeMs = Date.now() - start;

      if (timedOut) {
        return resolve({
          success: false,
          output: stdout,
          error: `Execution timed out (limit: ${timeoutMs}ms)`,
          executionTimeMs,
          timedOut: true,
          exitCode: 124
        });
      }

      const success = code === 0;
      resolve({
        success,
        output: stdout,
        error: stderr || (code !== 0 ? `Process exited with code ${code}` : ''),
        executionTimeMs,
        exitCode: code
      });
    });

    if (stdin && typeof stdin === 'string') {
      child.stdin.write(stdin);
    }
    child.stdin.end();
  });
}

/**
 * Run endpoint entry point with queue: compile then execute
 */
function runCSharp(code, options = {}) {
  const timeoutMs = Math.min(Math.max(Number(options.timeoutMs) || 8000, 500), 20000);
  const stdin = typeof options.stdin === 'string' ? options.stdin : '';

  return sandboxQueue.enqueue(async () => {
    const buildResult = await compileCodeInternal(code);

    if (!buildResult.success) {
      return {
        success: false,
        output: '',
        error: buildResult.error || 'Compilation failed',
        diagnostics: buildResult.diagnostics,
        executionTimeMs: buildResult.buildTimeMs,
        exitCode: 1
      };
    }

    const dllPath = getSandboxDllPath();
    const execResult = await executeBinary({ dllPath, timeoutMs, stdin });

    return {
      success: execResult.success,
      output: execResult.output,
      error: execResult.error,
      executionTimeMs: execResult.executionTimeMs,
      diagnostics: buildResult.diagnostics,
      exitCode: execResult.exitCode,
      timedOut: execResult.timedOut || false
    };
  });
}

module.exports = {
  DOTNET_BIN,
  SANDBOX_DIR,
  PROGRAM_PATH,
  getDotnetVersion,
  parseRoslynDiagnostics,
  buildCSharp,
  runCSharp
};

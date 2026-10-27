# ==============================================================================
# C# & OONV Interactive Learning Platform - Windows Setup & Launcher (PowerShell)
# Usage:
#   .\setup-windows.ps1           -> Installs dependencies, warms up .NET, & launches app
#   .\setup-windows.ps1 -InstallOnly -> Only installs dependencies without launching
# ==============================================================================
param(
    [switch]$InstallOnly
)

$ErrorActionPreference = "Stop"
$ProjectDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  C# & OONV Kurz - Setup a spuštění (Windows)" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan

# 1. Check Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[!] Chyba: Node.js není nainstalován!" -ForegroundColor Red
    Write-Host "    Nainstaluj ho příkazem: winget install OpenJS.NodeJS.LTS" -ForegroundColor Yellow
    exit 1
}
$nodeVer = & node -v
Write-Host "[OK] Node.js $nodeVer" -ForegroundColor Green

# 2. Check .NET SDK & adjust TargetFramework
if (Get-Command dotnet -ErrorAction SilentlyContinue) {
    $dotnetVer = (& dotnet --version).Trim()
    $dotnetMajor = ($dotnetVer -split '\.')[0]
    Write-Host "[OK] .NET SDK $dotnetVer" -ForegroundColor Green

    $csprojPath = Join-Path $ProjectDir "server\dotnet-sandbox\Sandbox.csproj"
    if (Test-Path $csprojPath) {
        $content = Get-Content $csprojPath -Raw
        $updated = $content -replace '<TargetFramework>net\d+\.0</TargetFramework>', "<TargetFramework>net$dotnetMajor.0</TargetFramework>"
        Set-Content -Path $csprojPath -Value $updated -Encoding UTF8
    }
} else {
    Write-Host "[!] Varování: .NET SDK nebyl nalezen. Poběží offline simulátor." -ForegroundColor Yellow
    Write-Host "    Pro plný Roslyn kompilátor nainstaluj: winget install Microsoft.DotNet.SDK.9" -ForegroundColor Yellow
}

# 3. Install Server dependencies if missing
$serverDir = Join-Path $ProjectDir "server"
if (-not (Test-Path (Join-Path $serverDir "node_modules"))) {
    Write-Host "[*] Instaluji závislosti backendu (server)..." -ForegroundColor Cyan
    Push-Location $serverDir
    & npm install --no-audit --no-fund
    Pop-Location
}

# 4. Warm up .NET Sandbox
$sandboxDir = Join-Path $ProjectDir "server\dotnet-sandbox"
if ((Get-Command dotnet -ErrorAction SilentlyContinue) -and (Test-Path $sandboxDir)) {
    Write-Host "[*] Připravuji .NET sandbox (dotnet restore & build)..." -ForegroundColor Cyan
    Push-Location $sandboxDir
    & dotnet restore -v quiet --nologo
    & dotnet build -v quiet --nologo
    Pop-Location
}

# 5. Install Client dependencies if missing
$clientDir = Join-Path $ProjectDir "client"
if (-not (Test-Path (Join-Path $clientDir "node_modules"))) {
    Write-Host "[*] Instaluji závislosti frontendu (client)..." -ForegroundColor Cyan
    Push-Location $clientDir
    & npm install --no-audit --no-fund
    Pop-Location
}

if ($InstallOnly) {
    Write-Host "[OK] Instalace dokončena! Pro spuštění použij start-windows.bat nebo .\setup-windows.ps1" -ForegroundColor Green
    exit 0
}

# 6. Start Backend (port 3001) & Frontend (port 5173) if not already listening
$backendListening = $false
try {
    $res = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -TimeoutSec 2 -UseBasicParsing
    if ($res.StatusCode -eq 200) { $backendListening = $true }
} catch {}

if (-not $backendListening) {
    Write-Host "[*] Spouštím .NET Runner Backend (port 3001)..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoProfile", "-WindowStyle", "Hidden", "-Command", "Set-Location '$serverDir'; npm start"
}

$frontendListening = $false
try {
    $res = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 2 -UseBasicParsing
    if ($res.StatusCode -eq 200) { $frontendListening = $true }
} catch {}

if (-not $frontendListening) {
    Write-Host "[*] Spouštím Vite Frontend (port 5173)..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "-NoProfile", "-WindowStyle", "Hidden", "-Command", "Set-Location '$clientDir'; npm run dev"
}

# Wait until frontend responds
Write-Host "[*] Čekám na start serverů..." -ForegroundColor Cyan
for ($i = 0; $i -lt 30; $i++) {
    try {
        $r = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 1 -UseBasicParsing
        if ($r.StatusCode -eq 200) { break }
    } catch {}
    Start-Sleep -Milliseconds 500
}

# 7. Open in Chromeless App Mode (Edge / Chrome) or default browser
$appUrl = "http://localhost:5173"
if (Get-Command msedge -ErrorAction SilentlyContinue) {
    Start-Process "msedge" -ArgumentList "--app=$appUrl"
} elseif (Get-Command chrome -ErrorAction SilentlyContinue) {
    Start-Process "chrome" -ArgumentList "--app=$appUrl"
} else {
    Start-Process $appUrl
}

Write-Host "[OK] Aplikace běží na $appUrl" -ForegroundColor Green

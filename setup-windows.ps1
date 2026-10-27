param(
    [switch]$InstallOnly
)
$ProjectDir = Split-Path -Parent $MyInvocation.MyCommand.Path
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[!] Chyba: Node.js neni nainstalovan! Stahni jej z https://nodejs.org/ nebo pres: winget install OpenJS.NodeJS.LTS" -ForegroundColor Red
    exit 1
}
if ($InstallOnly) {
    & node (Join-Path $ProjectDir "start.js") --setup
} else {
    & node (Join-Path $ProjectDir "start.js")
}

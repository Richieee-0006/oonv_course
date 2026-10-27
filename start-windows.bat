@echo off
title C# ^& OONV Interaktivni Kurz
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Chyba: Node.js neni nainstalovan! Stahni jej z https://nodejs.org/ nebo pres: winget install OpenJS.NodeJS.LTS
    pause
    exit /b 1
)
node "%~dp0start.js" %*

# C# & OONV Interaktivní Kurz (2026)

Kompletní interaktivní výuková platforma a zkouškový trenažér pro **C#, objektově orientované programování (OOP) a 16 návrhových vzorů GoF** s reálnou kompilací přes lokální **.NET SDK (Roslyn)**.

---

## Rychlý start – Linux (Arch / Omarchy / Ubuntu / Fedora)

### 1. Prerekvizity
```bash
# Arch Linux / Omarchy:
sudo pacman -S nodejs npm dotnet-sdk

# Ubuntu / Debian:
sudo apt update && sudo apt install -y nodejs npm dotnet-sdk-8.0
```

### 2. Naklonování a instalace (1 příkaz)
```bash
git clone git@github.com:Richieee-0006/oonv_course.git
cd oonv_course
chmod +x setup-linux.sh bin/launch-app.sh
./setup-linux.sh
```
*(Skript `setup-linux.sh` nainstaluje npm balíčky pro `server/` i `client/`, automaticky přizpůsobí verzi `.NET` v `Sandbox.csproj`, provede `dotnet restore` a zaregistruje spouštěč do `~/.local/share/applications/csharp-oonv-kurz.desktop` pro Vicinae / Rofi / Wofi).*

### 3. Spuštění aplikace (Linux)
```bash
./bin/launch-app.sh
```
Nebo přímo z **Vicinae** vyhledáním `csharp` nebo `oonv`.

---

## Rychlý start – Windows 10 / 11

### 1. Prerekvizity (PowerShell / Winget)
```powershell
winget install OpenJS.NodeJS.LTS
winget install Microsoft.DotNet.SDK.9
```

### 2. Naklonování a spuštění (1 kliknutí nebo příkaz)
```powershell
git clone https://github.com/Richieee-0006/oonv_course.git
cd oonv_course
.\start-windows.bat
```
*(Nebo v Průzkumníku dvakrát klikni na **`start-windows.bat`**, případně v PowerShellu spusť `.\setup-windows.ps1`).*

Skript na Windows automaticky:
1. Zkontroluje `node` a `dotnet` a přizpůsobí `<TargetFramework>` podle nainstalovaného `.NET SDK` (.NET 8 / 9 / 10).
2. Nainstaluje `node_modules` v `server/` a `client/` (pokud ještě nejsou).
3. Spustí na pozadí `.NET Runner API` (`http://localhost:3001`) a `Vite Frontend` (`http://localhost:5173`).
4. Otevře aplikaci v bezrámečkovém **Web App** okně (Edge / Chrome `--app=http://localhost:5173`).

---

## Ruční spuštění (Linux / Windows / macOS)

Pokud chceš spouštět backend a frontend odděleně ve dvou terminálech:

```bash
# Terminál 1 – .NET Runner Backend (port 3001)
cd server
npm install
npm start

# Terminál 2 – React + Vite Frontend (port 5173)
cd client
npm install
npm run dev
```
Poté otevři `http://localhost:5173`.

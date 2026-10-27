# C# & OONV Interaktivní Kurz (2026)

Interaktivní výuková platforma a zkouškový trenažér pro **C#, objektově orientované programování (OOP) a 16 návrhových vzorů GoF** s reálnou kompilací přes lokální **.NET SDK (Roslyn)**.

---

## Univerzální spuštění (Windows / Linux / macOS)

Projekt má univerzální multiplatformní instalátor a spouštěč `start.js` (čistý Node.js bez závislostí na konkrétní distribuci či desktopovém prostředí).

### 1. Požadavky
- **Node.js** (v18+): [nodejs.org](https://nodejs.org/)
- **.NET SDK** (v6.0 / 8.0 / 9.0 / 10.0 – skript si verzi autodetekuje): [dot.net/download](https://dot.net/download)
  *(Pokud `.NET SDK` není nainstalovaný, aplikace funguje dál s vestavěným offline simulátorem).*

### 2. Instalace a spuštění na jakémkoliv OS
```bash
git clone https://github.com/Richieee-0006/oonv_course.git
cd oonv_course

# Automaticky nainstaluje npm balíčky, připraví .NET sandbox, spustí servery a otevře prohlížeč:
npm start
```
*(Alternativně pouze instalace bez spuštění: `npm run setup`).*

---

## Zkratky podle operačního systému

### Windows (10 / 11)
- Dvakrát klikni na **`start-windows.bat`** (nebo v PowerShellu spusť `.\setup-windows.ps1`).

### Linux / macOS
- Spusť `./setup-linux.sh` pro přípravu prostředí a poté `npm start`.
- Pokud chceš na Linuxu vytvořit i systémového `.desktop` zástupce do menu aplikací (`~/.local/share/applications/`):
  ```bash
  ./setup-linux.sh --desktop
  ```
- Pro otevření v bezrámečkovém Web App okně (Chromium / Chrome / Brave / LibreWolf / Firefox):
  ```bash
  ./bin/launch-app.sh
  ```

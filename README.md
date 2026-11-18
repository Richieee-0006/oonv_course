# C# & OONV Interaktivní Kurz (2026)

Výuková platforma a zkouškový trenažér pro **C#, OOP a 16 návrhových vzorů GoF** s kompilací přes lokální **.NET SDK (Roslyn)**.

## Spuštění (Windows / Linux / macOS)

Spouštěč `start.js` běží v Node.js bez distribučních závislostí.

### 1. Požadavky
- **Node.js** (v18+): [nodejs.org](https://nodejs.org/)
- **.NET SDK** (v6.0 / 8.0 / 9.0 / 10.0 – verzi detekuje skript automaticky): [dot.net/download](https://dot.net/download)
  *(Bez `.NET SDK` aplikace běží v offline simulátoru.)*

### 2. Instalace a spuštění
```bash
git clone https://github.com/Richieee-0006/oonv_course.git
cd oonv_course

# Nainstaluje npm balíčky, připraví .NET sandbox, spustí servery a otevře prohlížeč:
npm start
```
*(Pouze instalace bez spuštění: `npm run setup`.)*

## Zkratky podle operačního systému

### Windows (10 / 11)
- Spusť `start-windows.bat` (nebo v PowerShellu `.\setup-windows.ps1`).

### Linux / macOS
- Spusť `./setup-linux.sh` a pak `npm start`.
- Vytvoření `.desktop` zástupce do menu aplikací (`~/.local/share/applications/`):
  ```bash
  ./setup-linux.sh --desktop
  ```
- Otevření v samostatném okně prohlížeče (Chromium / Chrome / Brave / LibreWolf / Firefox):
  ```bash
  ./bin/launch-app.sh
  ```

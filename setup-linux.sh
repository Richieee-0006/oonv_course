#!/usr/bin/env bash
# ==============================================================================
# Universal Linux / macOS Installer & Launcher
# Usage:
#   ./setup-linux.sh              -> Installs dependencies + prepares .NET sandbox
#   ./setup-linux.sh --desktop    -> Also creates ~/.local/share/applications shortcut
# ==============================================================================
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if ! command -v node >/dev/null 2>&1; then
    echo "[!] Chyba: Node.js není nainstalován (https://nodejs.org/)."
    echo "    Ubuntu/Debian: sudo apt install nodejs npm"
    echo "    Fedora:        sudo dnf install nodejs npm"
    echo "    Arch:          sudo pacman -S nodejs npm"
    exit 1
fi

node "$PROJECT_DIR/start.js" --setup

# Optional desktop shortcut registration
if [[ "${1:-}" == "--desktop" ]]; then
    chmod +x "$PROJECT_DIR/bin/launch-app.sh"
    APPS_DIR="${XDG_DATA_HOME:-$HOME/.local/share}/applications"
    mkdir -p "$APPS_DIR"
    cat << EOF > "$APPS_DIR/csharp-oonv-kurz.desktop"
[Desktop Entry]
Version=1.0
Type=Application
Name=C# & OONV Interaktivní Kurz
GenericName=C# OOP & Design Patterns Course
Comment=Interaktivní výuková platforma pro C#, OOP a GoF návrhové vzory s reálným .NET runnerem
Exec=$PROJECT_DIR/bin/launch-app.sh %U
Icon=$PROJECT_DIR/assets/icon.svg
Terminal=false
Categories=Development;Education;IDE;ComputerScience;
Keywords=csharp;dotnet;oop;gof;patterns;vzor;kurz;tutorial;c#;oonv;
StartupWMClass=csharp-oonv-kurz
StartupNotify=true
EOF
    echo "[OK] Desktop zástupce vytvořen v: $APPS_DIR/csharp-oonv-kurz.desktop"
fi

#!/usr/bin/env bash
# ==============================================================================
# C# & OONV Interactive Learning Platform - Linux Setup Script
# ==============================================================================
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "=========================================================="
echo "  C# & OONV Kurz - Instalace a příprava prostředí (Linux)"
echo "=========================================================="

# 1. Check Node.js & npm
if ! command -v node >/dev/null 2>&1 || ! command -v npm >/dev/null 2>&1; then
    echo "[!] Chyba: Node.js nebo npm není nainstalován."
    echo "    Arch/Omarchy: sudo pacman -S nodejs npm"
    echo "    Ubuntu/Debian: sudo apt install nodejs npm"
    exit 1
fi
echo "[✓] Node.js $(node -v) & npm $(npm -v)"

# 2. Check .NET SDK
if command -v dotnet >/dev/null 2>&1; then
    DOTNET_VER=$(dotnet --version)
    DOTNET_MAJOR=$(echo "$DOTNET_VER" | cut -d. -f1)
    echo "[✓] .NET SDK $DOTNET_VER"

    # Align Sandbox.csproj TargetFramework with installed .NET SDK version
    CSPROJ="$PROJECT_DIR/server/dotnet-sandbox/Sandbox.csproj"
    if [ -f "$CSPROJ" ] && [ "$DOTNET_MAJOR" -ge 6 ] 2>/dev/null; then
        sed -i "s|<TargetFramework>net[0-9]*\.0</TargetFramework>|<TargetFramework>net${DOTNET_MAJOR}.0</TargetFramework>|g" "$CSPROJ"
    fi
else
    echo "[!] Varování: .NET SDK (dotnet) nebyl nalezen. Aplikace poběží v offline simulátoru."
    echo "    Pro reálnou kompilaci C# nainstaluj .NET SDK:"
    echo "    Arch/Omarchy: sudo pacman -S dotnet-sdk"
    echo "    Ubuntu/Debian: sudo apt install dotnet-sdk-8.0"
fi

# 3. Install Backend dependencies
echo "[*] Instaluji závislosti backendu (server/)..."
(cd "$PROJECT_DIR/server" && npm install --no-audit --no-fund)

# 4. Warm up .NET Sandbox (restore + initial build)
if command -v dotnet >/dev/null 2>&1; then
    echo "[*] Připravuji .NET Roslyn sandbox (dotnet restore & build)..."
    (cd "$PROJECT_DIR/server/dotnet-sandbox" && dotnet restore -v quiet --nologo && dotnet build -v quiet --nologo)
fi

# 5. Install Frontend dependencies
echo "[*] Instaluji závislosti frontendu (client/)..."
(cd "$PROJECT_DIR/client" && npm install --no-audit --no-fund)

# 6. Install Desktop / Vicinae shortcut
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
Keywords=csharp;dotnet;oop;gof;patterns;vzor;kurz;tutorial;c#;oonv;vicinae;
StartupWMClass=csharp-oonv-kurz
StartupNotify=true
EOF

echo "[✓] Desktop spouštěč vytvořen: $APPS_DIR/csharp-oonv-kurz.desktop"
echo ""
echo "=========================================================="
echo "  Hotovo! Aplikaci spustíš příkazem:"
echo "  ./bin/launch-app.sh"
echo "=========================================================="

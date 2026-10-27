#!/usr/bin/env bash
# ==============================================================================
# C# & OONV Interactive Learning Platform Launcher
# Starts backend and frontend services if not running, then opens chromeless UI.
# ==============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"

BACKEND_URL="http://localhost:3001/api/health"
FRONTEND_URL="http://localhost:5173"
PROFILE_DIR="${XDG_DATA_HOME:-$HOME/.local/share}/csharp-oonv-kurz/browser-profile"

# Parse CLI options
FORCED_BROWSER=""
DRY_RUN=0
for arg in "$@"; do
    case "$arg" in
        --browser=*)
            FORCED_BROWSER="${arg#*=}"
            ;;
        --dry-run|--check-only)
            DRY_RUN=1
            ;;
        --help|-h)
            echo "Usage: $0 [--browser=chromium|librewolf|google-chrome|firefox] [--dry-run]"
            exit 0
            ;;
    esac
done

if [ -n "${APP_BROWSER:-}" ] && [ -z "$FORCED_BROWSER" ]; then
    FORCED_BROWSER="$APP_BROWSER"
fi

# 1. Health check helpers
is_backend_listening() {
    curl -s -f --connect-timeout 1 "$BACKEND_URL" >/dev/null 2>&1
}

is_frontend_listening() {
    curl -s -f --connect-timeout 1 "$FRONTEND_URL" >/dev/null 2>&1
}

# 2. Start services in background if necessary (detached via setsid)
if ! is_backend_listening; then
    echo "[launcher] Starting backend server on port 3001..."
    setsid bash -c "cd '$PROJECT_DIR/server' && exec npm start >> '$PROJECT_DIR/.server.log' 2>&1" </dev/null >/dev/null 2>&1 &
fi

if ! is_frontend_listening; then
    echo "[launcher] Starting frontend client on port 5173..."
    setsid bash -c "cd '$PROJECT_DIR/client' && exec npm run dev -- --host 0.0.0.0 >> '$PROJECT_DIR/.client.log' 2>&1" </dev/null >/dev/null 2>&1 &
fi

# 3. Poll until both services respond
MAX_WAIT_SECONDS=30
START_TIME=$(date +%s)
echo "[launcher] Waiting for servers to be ready..."

while true; do
    BACKEND_OK=0
    FRONTEND_OK=0

    if is_backend_listening; then
        BACKEND_OK=1
    fi

    if is_frontend_listening; then
        FRONTEND_OK=1
    fi

    if [ "$BACKEND_OK" -eq 1 ] && [ "$FRONTEND_OK" -eq 1 ]; then
        echo "[launcher] Both backend (3001) and frontend (5173) are ready!"
        break
    fi

    NOW=$(date +%s)
    ELAPSED=$((NOW - START_TIME))
    if [ "$ELAPSED" -ge "$MAX_WAIT_SECONDS" ]; then
        echo "[launcher] Error: Timed out waiting for servers after ${MAX_WAIT_SECONDS}s." >&2
        echo "Backend healthy: $BACKEND_OK, Frontend healthy: $FRONTEND_OK" >&2
        exit 1
    fi

    sleep 0.4
done

# 4. Configure dedicated profile for LibreWolf / Firefox chromeless mode
setup_firefox_profile() {
    mkdir -p "$PROFILE_DIR/chrome"

    cat << 'EOF' > "$PROFILE_DIR/user.js"
user_pref("toolkit.legacyUserProfileCustomizations.stylesheets", true);
user_pref("browser.tabs.warnOnClose", false);
user_pref("browser.shell.checkDefaultBrowser", false);
user_pref("browser.sessionstore.resume_from_crash", false);
user_pref("browser.warnOnQuitShortcut", false);
user_pref("datareporting.policy.dataSubmissionEnabled", false);
user_pref("app.normandy.enabled", false);
user_pref("app.shield.optoutstudies.enabled", false);
user_pref("browser.startup.page", 1);
user_pref("browser.startup.homepage", "http://localhost:5173");
EOF

    cat << 'EOF' > "$PROFILE_DIR/chrome/userChrome.css"
@namespace url("http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul");

#nav-bar,
#TabsToolbar,
#PersonalToolbar,
#sidebar-header {
    visibility: collapse !important;
    min-height: 0 !important;
    height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
}
EOF
}

# 5. Determine browser and launch in chromeless mode
setup_firefox_profile

CHOSEN_BROWSER=""
BROWSER_TYPE=""

if [ -n "$FORCED_BROWSER" ]; then
    if command -v "$FORCED_BROWSER" >/dev/null 2>&1; then
        CHOSEN_BROWSER=$(command -v "$FORCED_BROWSER")
        case "$FORCED_BROWSER" in
            chromium*|google-chrome*|brave*)
                BROWSER_TYPE="chromium"
                ;;
            librewolf*|firefox*)
                BROWSER_TYPE="firefox"
                ;;
            *)
                BROWSER_TYPE="generic"
                ;;
        esac
    else
        echo "[launcher] Warning: Specified browser '$FORCED_BROWSER' not found in PATH." >&2
    fi
fi

if [ -z "$CHOSEN_BROWSER" ]; then
    # Chromium-based browsers preferred for native --app mode
    if command -v chromium >/dev/null 2>&1; then
        CHOSEN_BROWSER=$(command -v chromium)
        BROWSER_TYPE="chromium"
    elif command -v google-chrome >/dev/null 2>&1; then
        CHOSEN_BROWSER=$(command -v google-chrome)
        BROWSER_TYPE="chromium"
    elif command -v brave >/dev/null 2>&1; then
        CHOSEN_BROWSER=$(command -v brave)
        BROWSER_TYPE="chromium"
    elif command -v librewolf >/dev/null 2>&1; then
        CHOSEN_BROWSER=$(command -v librewolf)
        BROWSER_TYPE="firefox"
    elif command -v firefox >/dev/null 2>&1; then
        CHOSEN_BROWSER=$(command -v firefox)
        BROWSER_TYPE="firefox"
    elif command -v xdg-open >/dev/null 2>&1; then
        CHOSEN_BROWSER=$(command -v xdg-open)
        BROWSER_TYPE="generic"
    fi
fi

if [ -z "$CHOSEN_BROWSER" ]; then
    echo "[launcher] Error: No supported browser found." >&2
    exit 1
fi

echo "[launcher] Launching application using $CHOSEN_BROWSER ($BROWSER_TYPE chromeless mode)..."

if [ "$DRY_RUN" -eq 1 ]; then
    echo "[launcher] Dry-run verification successful."
    echo "[launcher] Target: $FRONTEND_URL"
    echo "[launcher] Browser executable: $CHOSEN_BROWSER ($BROWSER_TYPE)"
    echo "[launcher] Profile directory: $PROFILE_DIR"
    exit 0
fi

case "$BROWSER_TYPE" in
    chromium)
        exec "$CHOSEN_BROWSER" --app="$FRONTEND_URL" --class="csharp-oonv-kurz" --name="csharp-oonv-kurz" "$@"
        ;;
    firefox)
        exec "$CHOSEN_BROWSER" --profile "$PROFILE_DIR" --new-window "$FRONTEND_URL" "$@"
        ;;
    *)
        exec "$CHOSEN_BROWSER" "$FRONTEND_URL" "$@"
        ;;
esac

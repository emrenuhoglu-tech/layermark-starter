#!/usr/bin/env bash
# record_demo.sh — record a 60-sec asciinema cast of layermark-starter setup.
#
# Why asciinema, not GIF:
# - Terminal-only (no video editing pipeline needed)
# - Embeddable in README via <script> tag — actual selectable text
# - Smaller file size (~10-50KB vs 2-5MB GIF)
# - User can pause, copy text, replay — better UX than GIF
#
# Usage:
#   bash scripts/record_demo.sh
#
# Prerequisites:
#   - asciinema installed (brew install asciinema OR pipx install asciinema)
#   - Terminal width 80 columns, height 30 rows recommended
#   - Clean ~/Desktop (output project will land there)
#
# After recording:
#   - File saved to scripts/demo.cast (or path you specify)
#   - Upload to asciinema.org: asciinema upload scripts/demo.cast
#   - Or self-host: copy demo.cast into site/public/, embed via <script>
#
# What to demo (target ~60 seconds):
#   1. python setup_starter.py
#   2. Pick "Türkçe" (option 2)
#   3. Show welcome banner
#   4. Project name: "musteri-asistani"
#   5. Category: 1 (Otomasyon) — or 6 (Finans) for HIGH-RISK demo
#   6. Stack: 1 (Python)
#   7. Skip intel + KB (default)
#   8. Skip git init (faster)
#   9. Confirm
#  10. Show output: "✓ X dosya yazıldı, Y skill kuruldu"
#  11. cd ~/Desktop/musteri-asistani
#  12. ls .claude/agents/ .claude/skills/
#  13. cat llms.txt | head -20
#
# That's 60 seconds of "from zero to a configured Claude Code project".

set -euo pipefail

DEMO_PATH="${1:-scripts/demo.cast}"
PROJECT_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$PROJECT_ROOT"

if ! command -v asciinema >/dev/null 2>&1; then
  echo "ERROR: asciinema not installed."
  echo "  macOS:   brew install asciinema"
  echo "  Linux:   pipx install asciinema  (or apt/dnf install asciinema)"
  echo "  Windows: pipx install asciinema  (WSL recommended)"
  exit 1
fi

echo "Recording to: $DEMO_PATH"
echo "Press Ctrl+D when done."
echo
echo "Suggested flow (~60s):"
echo "  1. python setup_starter.py"
echo "  2. Pick Türkçe (2), name a project, category 1 or 6, stack 1"
echo "  3. Confirm, watch output"
echo "  4. cd ~/Desktop/<project>"
echo "  5. ls .claude/agents/ .claude/skills/"
echo "  6. head -20 llms.txt"
echo "  7. Ctrl+D"
echo
echo "Starting in 3 seconds..."
sleep 3

asciinema rec --title "layermark-starter — 60-second new project" \
  --idle-time-limit 2 \
  "$DEMO_PATH"

echo
echo "Cast saved: $DEMO_PATH"
echo
echo "Next steps:"
echo "  1. Preview: asciinema play $DEMO_PATH"
echo "  2. Upload (optional): asciinema upload $DEMO_PATH"
echo "  3. Or self-host: cp $DEMO_PATH site/public/demo.cast"
echo "  4. Embed in README:"
echo "     <a href=\"https://asciinema.org/a/<id>\"><img src=\"https://asciinema.org/a/<id>.svg\" /></a>"
echo
echo "Or for self-hosted:"
echo "  <script async id=\"asciicast-demo\" src=\"https://asciinema.org/a/<id>.js\" data-cols=\"80\" data-rows=\"30\"></script>"

"""
Stop hook — auto-snapshots session at end of turn. Writes a 1-paragraph "what
changed this turn" entry to 02-memory/decisions-log.md if any Edit/Write
happened (counts active-context.md entries since the last snapshot marker).

Operationalizes Pocock Memento doctrine D3 + Doctrine #9 (rules emerge from
friction): every session leaves a trace, no manual /suspend needed for the
basic case. /suspend skill remains for explicit checkpoints with handoff prompt.

Why this exists pre-shipped:
- claude-bootstrap ships Stop hooks for TDD loops (test-runner)
- Layermark ships Stop hooks for memory continuity (1 markdown file)
- Same hook layer pattern, different doctrine
"""
import json
import sys
from datetime import datetime
from pathlib import Path

try:
    sys.stdin.read()  # drain payload (Stop hooks receive minimal JSON)
except Exception:
    pass

project_root = Path.cwd()
ctx_file = project_root / "02-memory" / "active-context.md"
log_file = project_root / "02-memory" / "decisions-log.md"

if not ctx_file.exists():
    sys.exit(0)  # nothing to snapshot

ctx_text = ctx_file.read_text(encoding="utf-8")

# Find the marker for "since last snapshot" — line "<!-- snapshot:<timestamp> -->"
marker_lines = [ln for ln in ctx_text.split("\n") if ln.startswith("<!-- snapshot:")]
if marker_lines:
    last_marker = marker_lines[-1]
    after_marker = ctx_text.rsplit(last_marker, 1)[1]
else:
    # First run — snapshot everything in "## Recent edits"
    header_marker = "## Recent edits\n"
    after_marker = ctx_text.split(header_marker, 1)[1] if header_marker in ctx_text else ""

# Count edits in this session
edit_lines = [ln for ln in after_marker.split("\n") if ln.startswith("- ")]
if not edit_lines:
    sys.exit(0)  # silent — no edits this turn, nothing to snapshot

# Append snapshot summary to decisions-log
if not log_file.exists():
    log_file.parent.mkdir(parents=True, exist_ok=True)
    log_file.write_text(
        "# Decisions log\n\n"
        "Auto-snapshot at session end (Stop hook) + manual entries from /suspend.\n"
        "Pocock Memento doctrine: external memory > prompt sediment.\n\n",
        encoding="utf-8",
    )

ts = datetime.now().strftime("%Y-%m-%d %H:%M")
n = len(edit_lines)
files_touched = sorted({ln.split("→ `")[1].rstrip("`") for ln in edit_lines if "→ `" in ln})
top_files = ", ".join(f"`{f}`" for f in files_touched[:5])
extra = f" (+{len(files_touched) - 5} more)" if len(files_touched) > 5 else ""

snapshot = (
    f"\n## {ts} — auto-snapshot\n"
    f"- **Edits:** {n} across {len(files_touched)} file(s)\n"
    f"- **Touched:** {top_files}{extra}\n"
)

with log_file.open("a", encoding="utf-8") as f:
    f.write(snapshot)

# Plant a marker in active-context.md so next snapshot only counts new edits
with ctx_file.open("a", encoding="utf-8") as f:
    f.write(f"<!-- snapshot:{ts} -->\n")

# Tell Claude Code (via stdout JSON) that a snapshot was taken — visible to user
print(json.dumps({"systemMessage": f"Layermark: session snapshotted ({n} edits → 02-memory/decisions-log.md)"}))
sys.exit(0)

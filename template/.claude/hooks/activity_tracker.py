"""
PostToolUse hook — appends a 1-line activity entry to 02-memory/active-context.md
on every Edit/Write. Operationalizes Pocock Memento doctrine D3 (durable session
memory outside the harness) + Doctrine #11 (hooks > prompt negatives).

Cross-platform: pure Python stdlib, no shell pipes. Reads tool payload from stdin
(JSON), appends to active-context.md, exits 0 on success (silent — no stdout
unless logging).

Why this exists pre-shipped (vs claude-bootstrap's Mnemos):
- Mnemos: full task-scoped memory store (heavy, opinionated DB)
- Layermark: 1 markdown file, append-only, human-readable, git-diffable
- Same wedge ("non-tech sees what changed") different mechanism
"""
import json
import sys
from datetime import datetime
from pathlib import Path

# Read hook payload (Claude Code feeds JSON via stdin)
try:
    payload = json.loads(sys.stdin.read())
except Exception:
    sys.exit(0)  # malformed input → silent pass; never block the user

tool_name = payload.get("tool_name", "?")
tool_input = payload.get("tool_input", {}) or {}
tool_response = payload.get("tool_response", {}) or {}

# Resolve file path — Edit/Write differ in shape
file_path = (
    tool_input.get("file_path")
    or tool_response.get("filePath")
    or tool_response.get("file_path")
)
if not file_path:
    sys.exit(0)  # not file-edit; ignore

# Project root = cwd (Claude Code runs hooks from project root)
project_root = Path.cwd()
ctx_file = project_root / "02-memory" / "active-context.md"

# Initialize on first call
if not ctx_file.exists():
    ctx_file.parent.mkdir(parents=True, exist_ok=True)
    ctx_file.write_text(
        "# Active session context\n\n"
        "Auto-updated on every Edit/Write. **Append-only** — Claude reads this\n"
        "at session start (or `/resume`) to recall recent file activity without\n"
        "context-window cost. Pocock Memento doctrine D3 operationalized.\n\n"
        "## Recent edits\n",
        encoding="utf-8",
    )

# Make the path relative so log entries don't leak absolute paths
try:
    rel = Path(file_path).resolve().relative_to(project_root)
    rel_str = str(rel).replace("\\", "/")
except (ValueError, OSError):
    rel_str = str(file_path).replace("\\", "/")

# Skip our own log file (would loop)
if rel_str.endswith("active-context.md"):
    sys.exit(0)

ts = datetime.now().strftime("%Y-%m-%d %H:%M")
entry = f"- {ts} · {tool_name} → `{rel_str}`\n"

# Append (atomic on POSIX; on Windows it's still atomic-enough at this scale)
with ctx_file.open("a", encoding="utf-8") as f:
    f.write(entry)

# Cap file size — keep last ~200 entries (smart-zone discipline)
text = ctx_file.read_text(encoding="utf-8")
header_marker = "## Recent edits\n"
if header_marker in text:
    head, body = text.split(header_marker, 1)
    lines = [ln for ln in body.split("\n") if ln.startswith("- ")]
    if len(lines) > 200:
        kept = lines[-200:]
        ctx_file.write_text(
            head + header_marker + "\n".join(kept) + "\n",
            encoding="utf-8",
        )

sys.exit(0)

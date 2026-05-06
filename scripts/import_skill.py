"""
import_skill.py — fetch a single skill from a public GitHub source and drop it into .claude/skills/.

Wedge note: layermark-starter ships **15 curated** skills (each passes Pocock's
inner-loop test). 200+ skill marketplaces (alirezarezvani, rohitg00) are catalogs,
not opinionated stacks. This script is the **escape hatch** — if you genuinely need
something from a marketplace, you can pull it without forcing layermark to become
an aggregator.

Usage:
    python scripts/import_skill.py <github-raw-url-or-blob-url>
    python scripts/import_skill.py https://github.com/alirezarezvani/claude-skills/blob/main/skills/some-skill.md
    python scripts/import_skill.py https://raw.githubusercontent.com/.../some-skill.md

Shorthand for sickn33/antigravity-awesome-skills (1,445 skills, 36K★):
    python scripts/import_skill.py antigravity://<skill-name>
    python scripts/import_skill.py antigravity://3d-web-experience

Behavior:
    1. Resolve URI scheme: antigravity:// → GitHub raw URL; blob URL → raw URL.
    2. Fetch the file content (HTTP GET).
    3. Validate it's a SKILL.md-shape: YAML frontmatter with `name:` + `description:`.
    4. Reject if name collides with existing layermark skill.
    5. Write to .claude/skills/<name>.md (use frontmatter name, NOT URL filename).
    6. Append imported entry to .claude/skills/IMPORTED.md (audit trail).

The script is read-only on imported content — no transform, no "improvement". You
inspect the file after import and decide if it belongs.
"""
from __future__ import annotations

import re
import sys
import urllib.error
import urllib.request
from datetime import date
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[1]
SKILLS_DIR = PROJECT_ROOT / ".claude" / "skills"
IMPORTED_LOG = SKILLS_DIR / "IMPORTED.md"

FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n", re.DOTALL)
NAME_RE = re.compile(r"^name:\s*(\S+)\s*$", re.MULTILINE)
DESC_RE = re.compile(r"^description:\s*(.+)$", re.MULTILINE)


def github_blob_to_raw(url: str) -> str:
    """https://github.com/owner/repo/blob/branch/path → https://raw.githubusercontent.com/owner/repo/branch/path"""
    m = re.match(r"https://github\.com/([^/]+)/([^/]+)/blob/([^/]+)/(.+)", url)
    if m:
        owner, repo, branch, path = m.groups()
        return f"https://raw.githubusercontent.com/{owner}/{repo}/{branch}/{path}"
    return url  # already raw, or unknown shape — let urllib decide


def resolve_uri(uri: str) -> str:
    """Resolve custom URI schemes to a raw GitHub URL.

    antigravity://<skill-name> →
        sickn33/antigravity-awesome-skills/main/skills/<skill-name>/SKILL.md
    """
    if uri.startswith("antigravity://"):
        skill = uri[len("antigravity://"):].strip("/")
        if not skill:
            sys.exit("ERROR: antigravity:// URI requires a skill name (e.g. antigravity://3d-web-experience)")
        return f"https://raw.githubusercontent.com/sickn33/antigravity-awesome-skills/main/skills/{skill}/SKILL.md"
    return uri


def fetch(url: str) -> str:
    url = resolve_uri(url)
    raw_url = github_blob_to_raw(url)
    try:
        with urllib.request.urlopen(raw_url, timeout=15) as resp:
            return resp.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        sys.exit(f"HTTP {e.code} fetching {raw_url}")
    except urllib.error.URLError as e:
        sys.exit(f"Network error fetching {raw_url}: {e.reason}")


def parse_skill(content: str) -> tuple[str, str]:
    fm = FRONTMATTER_RE.match(content)
    if not fm:
        sys.exit("ERROR: file has no YAML frontmatter (--- ... --- block at top). Not a SKILL.md-shape file.")
    fm_text = fm.group(1)
    name_m = NAME_RE.search(fm_text)
    desc_m = DESC_RE.search(fm_text)
    if not name_m:
        sys.exit("ERROR: frontmatter has no `name:` field.")
    if not desc_m:
        sys.exit("ERROR: frontmatter has no `description:` field.")
    return name_m.group(1).strip(), desc_m.group(1).strip()


def check_collision(name: str) -> None:
    target = SKILLS_DIR / f"{name}.md"
    if target.exists():
        sys.exit(
            f"ERROR: .claude/skills/{name}.md already exists. "
            f"Layermark ship'lemiş veya daha önce import edilmiş. "
            f"İçeriği farklıysa elle merge et — bu script overwrite etmiyor."
        )


def append_log(name: str, source_url: str, description: str) -> None:
    SKILLS_DIR.mkdir(parents=True, exist_ok=True)
    today = date.today().isoformat()
    entry = f"\n## {name} ({today})\n- **Source:** {source_url}\n- **Description:** {description}\n"
    if IMPORTED_LOG.exists():
        IMPORTED_LOG.write_text(IMPORTED_LOG.read_text(encoding="utf-8") + entry, encoding="utf-8")
    else:
        header = (
            "# Imported skills — audit trail\n\n"
            "External skills pulled via `scripts/import_skill.py`. Each entry: skill name, "
            "import date, source URL, frontmatter description. Inner-loop test (Pocock) is on "
            "the user — these were NOT pre-curated by layermark.\n"
        )
        IMPORTED_LOG.write_text(header + entry, encoding="utf-8")


def main() -> None:
    if len(sys.argv) != 2 or sys.argv[1] in ("-h", "--help"):
        sys.exit(__doc__)

    source_url = sys.argv[1]
    print(f"→ Fetching: {source_url}")
    content = fetch(source_url)

    name, description = parse_skill(content)
    print(f"→ Skill name: {name}")
    print(f"→ Description: {description[:80]}{'...' if len(description) > 80 else ''}")

    check_collision(name)

    target = SKILLS_DIR / f"{name}.md"
    SKILLS_DIR.mkdir(parents=True, exist_ok=True)
    target.write_text(content, encoding="utf-8")
    print(f"✓ Wrote {target.relative_to(PROJECT_ROOT)}")

    append_log(name, source_url, description)
    print(f"✓ Audit entry appended to {IMPORTED_LOG.relative_to(PROJECT_ROOT)}")

    print()
    print("Next: open the file and read it. layermark didn't curate this — you do.")
    print("If it doesn't pass Pocock's inner-loop test (2-3x/day repeated pattern,")
    print("preloaded context helps, friction-driven), delete it. Don't sediment.")


if __name__ == "__main__":
    main()

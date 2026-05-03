"""
STARTER-PROMPT.md'yi template/ dosyalarindan yeniden uretir.

template/ degistiginde STARTER-PROMPT'un duplicate icerigi senkron kalsin diye
manuel kopyala-yapistir yerine bu script'i calistir.

Kullanim:
    python scripts/regen_starter_prompt.py
"""
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parents[1]
TEMPLATE = ROOT / "template"
OUT = ROOT / "STARTER-PROMPT.md"

# Embed sirasi — STARTER-PROMPT'taki sirasi
EMBED_FILES = [
    "CLAUDE.md.tmpl",
    "README.md.tmpl",
    ".gitignore",
    ".env.example",
    ".claude/agents/README.md",
    ".claude/agents/prompt-engineer.md",
    ".claude/skills/README.md",
    ".claude/skills/grill-me.md",
    ".claude/skills/skill-creator.md",
    ".claude/skills/agent-creator.md",
    ".claude/skills/project-advisor.md",
    ".claude/skills/yardim.md",
    ".claude/skills/suspend.md",
    ".claude/skills/resume.md",
    ".claude/skills/sync-drift.md",
    ".claude/skills/ne-yapayim.md",
    ".claude/skills/spagetti-check.md",
    "knowledge/README.md",
]

HEADER = """# layermark-starter — Software 3.0 bootstrap prompt

**How to use:** Open this file, copy everything below the line, paste into your Claude Code session. Answer the questions. Done.

---

You are a Claude Code project scaffolder. Bootstrap a new project for the user using the spec below. Use the file content embedded at the bottom verbatim. **Do not improvise structure** — paste templates as-is, only render placeholders.

## Step 0 — Language

**First question:**

> "Hangi dilde devam edelim? / Which language?
> 1) Türkçe
> 2) English"

Use selected language for ALL subsequent questions and outputs. Default = Türkçe if unclear.

## Step 1 — Kit selection (ask first, simplifies later questions)

Ask: **"Hangi kit / Which kit?"**

1. **🤖 AI Asistan / AI Assistant Kit** — Customer message replies, calendar, mail automation, chatbot. *Defaults: stack=python, intel=no, kb=no.*
2. **📊 İçerik Takip / Content Tracker Kit** — YouTube/X channel scanning, transcript fetch, auto-summarize. *Defaults: stack=python, intel=yes, watchlist=ai, kb=yes.*
3. **📝 Boş Sayfa / Blank** — Custom; ask all questions individually.

If kit 1 or 2: skip stack/intel/kb questions, use the defaults. Confirm them visibly.
If kit 3: ask each individually.

## Step 2 — Q&A (ask ONE question at a time, wait for answer)

Always ask:

1. **Project name?** Used as folder + in templates. Example: `myproj`.
2. **Target folder?** Default: `./<name>`.

If kit = blank, also ask:

3. **Stack?**
   1. Python (automation, bots, data)
   2. Node.js (modern JS)
   3. Web (TS + React, interactive site)
   4. None (docs / research only)
4. **Intel pipeline (YouTube + X scan)?** Default `n`.
5. **Knowledge base (Karpathy 3-layer raw/wiki/schema)?** Default `n`.

Always ask:

6. **git init?** Default `y`.
7. **GitHub repo via `gh`?** Default `n`. If `y`, also ask visibility (private default).

If user types "skip" / "ne önerirsin?" / "I don't know", apply defaults.

## Step 3 — Show plan, get explicit go/no-go

Print a tree of files about to be created. Example:

```text
./myproj/
├── CLAUDE.md
├── README.md
├── .gitignore
├── .env.example
├── .claude/
│   ├── agents/
│   │   ├── README.md
│   │   └── prompt-engineer.md
│   └── skills/
│       ├── README.md
│       ├── grill-me.md
│       ├── skill-creator.md
│       ├── agent-creator.md
│       ├── project-advisor.md
│       └── yardim.md
├── knowledge/README.md
├── requirements.txt    (stack=python only)
└── pyproject.toml      (stack=python only)
```

Ask: **"Devam? [Y/n] / Continue? [Y/n]"**. Do not write files until "y" / "evet" / "go".

## Step 4 — Create files

For each file, render placeholders (`{{PROJECT_NAME}}`, `{{DESCRIPTION}}`, etc.) before writing. Use the **Write** tool. Treat the embedded `=== BEGIN FILE: <path> ===` blocks below as authoritative — copy verbatim except for placeholder substitution.

### File rendering rules

- `{{PROJECT_NAME}}` → project name
- `{{DESCRIPTION}}` → leave as `(proje açıklaması — sen doldur)` unless user already gave a one-liner
- `{{SETUP_COMMANDS}}` → stack-dependent (Python: venv+pip, Node: npm install, Web: npm install && npm run dev, None: no build)

### Conditional files

- `requirements.txt` + `pyproject.toml` → only if stack=python
- `package.json` → only if stack=node or stack=web
- `tsconfig.json` → only if stack=web
- `knowledge/raw/.gitkeep` + `knowledge/wiki/.gitkeep` + `knowledge/schema.md` → only if kb=yes
- Intel scripts (`scripts/intel_scan.py`, etc.) — Layermark-specific; only if user has `~/.layermark/pylib/` (else: skip with note "intel pipeline atlandı, Layermark-specific")

### Stack-specific stubs

If stack=python:
- `requirements.txt` — `# pip install -r requirements.txt`
- `pyproject.toml` — `[project]\\nname = "{{PROJECT_NAME}}"\\nversion = "0.1.0"\\nrequires-python = ">=3.10"`

If stack=node or web:
- `package.json` — `{"name": "{{PROJECT_NAME}}", "version": "0.1.0", "private": true, "type": "module"}`

If stack=web:
- `tsconfig.json` — strict ES2022 + react-jsx

## Step 5 — Run git/gh if requested

If git=yes: `git init -q`. If gh=yes: `gh repo create <name> --<visibility> --source=. --remote=origin && git add -A && git commit -q -m "Initial from layermark-starter" && git push`.

If `gh` not available, print warning, don't fail.

## Step 6 — Final summary

```text
✓ Project ready: <abs-path>

Next:
  cd <abs-path>
  <stack-specific setup command if not None>
  claude    # start Claude Code session — first-run wizard fires automatically
```

## Hard rules — do not improvise

- **One question at a time.** Don't dump the whole questionnaire.
- **Wait for go/no-go before writing files.** Show the plan tree first.
- **Render placeholders, don't add content.** Templates are authoritative.
- **Don't add skills.** 5 foundational ship pre-loaded; rest emerge organically (inner-loop test).
- **Don't fill `knowledge/` with hallucinated content.** Empty `raw/` + `wiki/` only.
- **Don't write business logic.** Stack stubs are minimum.
- **Don't run `npm install` or `pip install` automatically.**
- **No Dockerfile, no CI, no pytest.ini, no test scaffold.** Surgical.

If user asks during wizard "can you also add X?": "After setup. The wizard is for the iskelet — add X later in a normal session."

---

# Embedded files (verbatim — render placeholders only)

The following sections are the file contents to write. Use the `=== BEGIN FILE: <path> === ... === END FILE: <path> ===` sentinels as boundaries — anything between is the file's exact content (after placeholder substitution).
"""


def main() -> None:
    parts = [HEADER]
    for rel in EMBED_FILES:
        src = TEMPLATE / rel
        if not src.exists():
            print(f"  ! kaynak yok: {rel}")
            continue
        content = src.read_text(encoding="utf-8")
        # .tmpl uzantili dosyalar embed sirasinda gercek isimleriyle gozuksun
        embed_path = rel.replace(".tmpl", "")
        parts.append(f"\n=== BEGIN FILE: {embed_path} ===\n")
        parts.append(content.rstrip() + "\n")
        parts.append(f"=== END FILE: {embed_path} ===\n")

    OUT.write_text("\n".join(parts), encoding="utf-8")
    print(f"  ✓ {OUT.name} regenerated ({len(EMBED_FILES)} embedded files)")


if __name__ == "__main__":
    main()

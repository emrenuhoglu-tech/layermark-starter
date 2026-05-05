"""
layermark-starter — interactive bootstrap for new Claude Code projects.

3 hazir kit + 10 domain kategori + 10-soruluk first-run wizard. Kit'le baslar,
kategoriyle risk profili belirler, soru sayisi azaltirsin:
  1) AI Asistan          — bot/automation odakli (python, no intel, no kb)
  2) Icerik Takip        — YouTube/X transcript + ozet (python, intel=ai, kb=yes)
  3) Bos Sayfa / Custom  — tum sorulara cevap (full wizard)

Domain kategori (kit'ten orthogonal):
  automation / content / product / game / data /
  finance (HIGH RISK) / legal (HIGH RISK) /
  marketing / education / personal / general

HIGH-RISK kategoriler (finance, legal) production doctrine docs (auto-mode
classifier, red-team primitive, multi-grader eval, eval-awareness,
brain/hands decoupling) otomatik dahil eder, kit'e bakmaksizin.

Bootstrap kapsami:
- Minimal CLAUDE.md (TR/EN dil secim wizard'i icinde, Phase 0.3 kategori dahil)
- prompt-engineer agent (vendored)
- 14 foundational skill: grill-me, skill-creator, agent-creator,
  project-advisor, yardim, suspend, resume, sync-drift, ne-yapayim,
  spagetti-check, ubiquitous-language, failing-test-as-prompt,
  agent-approval, verify-agent-output
- Optional intel pipeline + watchlist preset
- Optional 3-layer knowledge base (raw / wiki / schema)
- Stack: Python / Node / Web (TS+React) / None

Usage:
    python setup_starter.py
    python setup_starter.py --yes --name=demo --kit=intel --category=finance
    python setup_starter.py --yes --name=demo --target=./out --stack=python  # CI mode
"""
import argparse
import re
import shutil
import subprocess
import sys
import unicodedata
from pathlib import Path


# ASCII-safe slug: TR/non-ASCII → translit → kebab-case, Subject orig dilde kalir
_TR_MAP = str.maketrans({
    "ç": "c", "Ç": "C", "ğ": "g", "Ğ": "G", "ı": "i", "İ": "I",
    "ö": "o", "Ö": "O", "ş": "s", "Ş": "S", "ü": "u", "Ü": "U",
})


def to_ascii_slug(s: str) -> str:
    """Türkçe + non-ASCII → ASCII slug. macOS HFS+/Dropbox NFD/NFC sync sorunu icin."""
    s = s.translate(_TR_MAP)
    s = unicodedata.normalize("NFKD", s).encode("ascii", "ignore").decode("ascii")
    s = re.sub(r"[^\w\s-]", "", s.lower())
    s = re.sub(r"\s+", "-", s.strip())
    return s or "project"

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

PYLIB = Path.home() / ".layermark" / "pylib"
STARTER = Path(__file__).resolve().parent
TEMPLATE = STARTER / "template"

# Pre-built kits — pre-fill answers for non-coders
KITS: dict[str, dict] = {
    "assistant": {
        "label": "🤖 AI Asistan Kit",
        "desc_tr": "Müşteri mesajlarına cevap, takvim, mail otomasyonu, chatbot",
        "desc_en": "Customer message replies, calendar, mail automation, chatbot",
        "stack": "python",
        "intel": False,
        "watchlist": "none",
        "kb": False,
    },
    "intel": {
        "label": "📊 İçerik Takip Kit",
        "desc_tr": "YouTube/X kanalları tarar, transcript çeker, otomatik özet çıkarır",
        "desc_en": "Scans YouTube/X channels, fetches transcripts, auto-summarizes",
        "stack": "python",
        "intel": True,
        "watchlist": "ai",
        "kb": True,
    },
    "blank": {
        "label": "📝 Boş Sayfa / Custom",
        "desc_tr": "Sıfırdan başla, ben tüm soruları soruyorum",
        "desc_en": "Start from scratch, full wizard",
        "stack": None,  # ask
        "intel": None,
        "watchlist": None,
        "kb": None,
    },
}

# Watchlist presets — small curated lists per domain
PRESETS: dict[str, dict] = {
    "ai": {
        "youtube_channels": [
            {"id": "UCrDwWp7EBBv4NwvScIpBDOA", "name": "Anthropic", "why": "Claude + research"},
            {"id": "UCXUPKJO5MZQN11PqgIvyuvQ", "name": "Andrej Karpathy", "why": "LLM fundamentals"},
            {"id": "UCXZCJLdBC09xxGZ6gcdrc6A", "name": "OpenAI", "why": "Competitor model"},
            {"id": "UCHlNU7kIZhRgSbhHvFoy72w", "name": "Hugging Face", "why": "Model releases"},
            {"id": "UCNJ1Ymd5yFuUPtn21xtRbbw", "name": "AI Explained", "why": "Frontier model analysis"},
            {"id": "UCsBjURrPoezykLs9EqgamOA", "name": "Fireship", "why": "Dev news, AI angle"},
        ],
        "x_accounts": [
            {"handle": "AnthropicAI", "why": "Claude updates"},
            {"handle": "OpenAI", "why": "Competitor"},
            {"handle": "karpathy", "why": "Agent insight"},
            {"handle": "alexalbert__", "why": "Anthropic AR"},
            {"handle": "simonw", "why": "LLM tooling experiments"},
            {"handle": "swyx", "why": "AI Engineer ecosystem"},
            {"handle": "_philschmid", "why": "HF + production"},
        ],
    },
    "marketing": {
        "youtube_channels": [
            {"id": "UCl-Zrl0QhF66lu1aGXaTbfw", "name": "Neil Patel", "why": "Growth + SEO"},
            {"id": "UCh1KZNVLeTQ6yhcgn5pgkUw", "name": "Ahrefs", "why": "SEO tool + tutorials"},
            {"id": "UC8j8USTGzNeb_qKp-OkfRyA", "name": "Semrush", "why": "SEO + content marketing"},
            {"id": "UCcQX1_hxKLwgI5fuqbixyOg", "name": "Matt Diggity", "why": "SEO playbook"},
        ],
        "x_accounts": [
            {"handle": "neilpatel", "why": "Growth"},
            {"handle": "semrush", "why": "SEO"},
            {"handle": "ahrefs", "why": "SEO"},
            {"handle": "randfish", "why": "SparkToro, SEO thought"},
            {"handle": "mattdiggity", "why": "SEO playbook"},
        ],
    },
    "indie": {
        "youtube_channels": [
            {"id": "UCsBjURrPoezykLs9EqgamOA", "name": "Fireship", "why": "Dev news rapid"},
        ],
        "x_accounts": [
            {"handle": "levelsio", "why": "Indie SaaS, building in public"},
            {"handle": "dhh", "why": "Rails/infra philosophy"},
            {"handle": "marc_louvion", "why": "Growth experiments"},
        ],
    },
}

INTEL_README_BLOCK = """
- `scripts/intel_scan.py` — günlük YouTube tarama (RSS + transcript)
- `scripts/x_intel_scan.py` — günlük X tarama (API + opsiyonel video transcribe)
- `02-memory/youtube-intel/YYYY-MM-DD.md` — YouTube günlük rapor
- `02-memory/x-intel/YYYY-MM-DD.md` — X günlük rapor
"""

STACK_README_BLOCK = {
    "python": "- `requirements.txt` — Python bağımlılıkları\n- `pyproject.toml` — paket meta\n",
    "node": "- `package.json` — Node bağımlılıkları\n",
    "web": "- `package.json` — Node + React bağımlılıkları\n- `tsconfig.json` — TS config\n",
    "none": "",
}


def ask(prompt: str, default: str = "") -> str:
    suffix = f" [{default}]" if default else ""
    return input(f"{prompt}{suffix} > ").strip() or default


def yes_no(prompt: str, default_yes: bool = True) -> bool:
    suffix = "[Y/n]" if default_yes else "[y/N]"
    while True:
        ans = input(f"{prompt} {suffix} > ").strip().lower()
        if not ans:
            return default_yes
        if ans in ("y", "yes", "evet", "e"):
            return True
        if ans in ("n", "no", "hayir", "h"):
            return False


def choose(prompt: str, options: list[str]) -> int:
    print(f"\n{prompt}")
    for i, o in enumerate(options, 1):
        print(f"  {i}) {o}")
    while True:
        ans = input(f"  > ").strip()
        if ans.isdigit() and 1 <= int(ans) <= len(options):
            return int(ans) - 1
        print(f"  1-{len(options)} arası bir sayı gir.")


def render_tmpl(text: str, vars: dict[str, str]) -> str:
    for k, v in vars.items():
        text = text.replace("{{" + k + "}}", v)
    return text


PRODUCTION_DOCTRINE_PATHS = (
    "02-memory/doctrine/",
    "02-memory/orchestrator-safety.md",
)

# Category-triggered agents — copied only when category matches.
# Wedge: rakipler 135 agent ship eder, kullanıcı hangisini açacağını bilmez.
# Layermark kategori-tetikli açar — finance project'inde sadece finance-auditor.
CATEGORY_AGENTS: dict[str, list[str]] = {
    "finance": [".claude/agents/finance-auditor.md"],
    "legal": [".claude/agents/legal-disclaimer-checker.md"],
}

# All category-agent paths (used to skip agents for non-matching categories)
ALL_CATEGORY_AGENT_PATHS: set[str] = {
    p for paths in CATEGORY_AGENTS.values() for p in paths
}

# Category-aware deny rules injected into .claude/settings.json template.
# Each value is the suffix block (with leading comma + newline) appended to the
# `permissions.deny` array. Empty for categories without extras.
CATEGORY_DENIES: dict[str, str] = {
    "finance": (
        ',\n      "Bash(*pickle.load*)",'         # untrusted deserialization
        '\n      "Bash(*float(amount*)",'         # IEEE-754 on money math
        '\n      "Write(transactions.csv)",'       # forbid raw ledger overwrite
        '\n      "Write(ledger.json)"'
    ),
    "legal": (
        ',\n      "Bash(curl http://*)",'          # plaintext HTTP forbidden
        '\n      "Bash(*ssn*)",'                   # PII keyword guards
        '\n      "Bash(*tckn*)",'
        '\n      "Write(*pii*.json)"'
    ),
    # Other categories: no extra denies (use defaults)
}

# Categories — wizard'da Phase 0.3'te seçilir, copy_template'e geçer
CATEGORIES: dict[str, dict] = {
    "automation":  {"file": "01-automation.md",  "label": "🔁 Otomasyon & workflow",       "high_risk": False},
    "content":     {"file": "02-content.md",     "label": "📝 İçerik & medya",             "high_risk": False},
    "product":     {"file": "03-product.md",     "label": "💻 Yazılım & ürün",             "high_risk": False},
    "game":        {"file": "04-game.md",        "label": "🎮 Oyun geliştirme",            "high_risk": False},
    "data":        {"file": "05-data.md",        "label": "📊 Veri & analiz",              "high_risk": False},
    "finance":     {"file": "06-finance.md",     "label": "🧮 Finans & muhasebe & audit",  "high_risk": True},
    "legal":       {"file": "07-legal.md",       "label": "🏛 Hukuk & uyumluluk",          "high_risk": True},
    "marketing":   {"file": "08-marketing.md",   "label": "📈 Pazarlama & satış",          "high_risk": False},
    "education":   {"file": "09-education.md",   "label": "🎓 Eğitim & araştırma",         "high_risk": False},
    "personal":    {"file": "10-personal.md",    "label": "🧘 Kişisel & verimlilik",       "high_risk": False},
    "general":     {"file": None,                "label": "Hiçbiri / genel",                "high_risk": False},
}

# Kit -> default category mapping (wizard runtime'ında override edilir)
KIT_DEFAULT_CATEGORY = {
    "assistant": "automation",
    "intel":     "content",
    "blank":     "general",
}


def _is_production_doctrine(rel: Path) -> bool:
    """Files that are opt-in for production agents only."""
    rel_str = str(rel).replace("\\", "/")
    return any(rel_str.startswith(p.rstrip("/")) for p in PRODUCTION_DOCTRINE_PATHS)


def _is_other_category_file(rel: Path, keep_category: str | None) -> bool:
    """Return True if this file is a category boilerplate that's NOT the chosen one.

    Category files live under 02-memory/category/. We keep only the chosen one
    (or none if 'general' / not selected).
    """
    rel_str = str(rel).replace("\\", "/")
    if not rel_str.startswith("02-memory/category/"):
        return False
    if not keep_category or keep_category == "general":
        return True   # general / no choice → drop all category files
    keep = CATEGORIES.get(keep_category, {}).get("file")
    if not keep:
        return True
    return not rel_str.endswith(keep)


def _is_other_category_agent(rel: Path, keep_category: str | None) -> bool:
    """Return True if this agent is category-triggered but NOT for the chosen category.

    Wedge: layermark sadece kategori-uyan agent'ı kopyalar. Finance project'inde
    legal-disclaimer-checker yok, legal'da finance-auditor yok. prompt-engineer
    her durumda kalır (universal).
    """
    rel_str = rel.as_posix()
    if rel_str not in ALL_CATEGORY_AGENT_PATHS:
        return False  # not a category-triggered agent — leave it alone
    keep_paths = CATEGORY_AGENTS.get(keep_category or "", [])
    return rel_str not in keep_paths


def copy_template(
    target: Path,
    vars: dict[str, str],
    *,
    include_production: bool = False,
    category: str | None = None,
    include_agent: bool = True,
) -> None:
    """Copy template/ files, render .tmpl -> final names.

    `include_production=False` (default for assistant/intel kits): skip files
    under 02-memory/doctrine/ and 02-memory/orchestrator-safety.md.
    `category=<key>` (e.g., "finance"): keep only the matching 02-memory/category/
    boilerplate. Other categories' files are dropped. HIGH-RISK categories
    (finance, legal) auto-include production doctrine docs regardless of kit.
    `include_agent=False` (Phase 0.6 mode=off): skip `.claude/agents/prompt-engineer.md`.
    Note: copy_agent() runs after this and would normally rewrite the file with
    a mode-specific description; with mode=off both this skip and copy_agent's
    early-return must agree.
    """
    cat = CATEGORIES.get(category or "general", {})
    if cat.get("high_risk"):
        include_production = True   # HIGH risk = production doctrine zorunlu

    skipped_prod = 0
    skipped_cat = 0
    skipped_agent = 0
    skipped_cat_agent = 0
    for src in TEMPLATE.rglob("*"):
        if src.is_dir():
            continue
        rel = src.relative_to(TEMPLATE)
        if not include_production and _is_production_doctrine(rel):
            skipped_prod += 1
            continue
        if _is_other_category_file(rel, category):
            skipped_cat += 1
            continue
        if _is_other_category_agent(rel, category):
            skipped_cat_agent += 1
            continue
        if not include_agent and rel.as_posix() == ".claude/agents/prompt-engineer.md":
            skipped_agent += 1
            continue
        dst = target / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        if src.suffix == ".tmpl":
            content = src.read_text(encoding="utf-8")
            content = render_tmpl(content, vars)
            dst_final = dst.with_suffix("")
            dst_final.write_text(content, encoding="utf-8")
            print(f"  ✓ {rel.with_suffix('')}")
        else:
            shutil.copy2(src, dst)
            print(f"  ✓ {rel}")
    if skipped_prod > 0:
        print(f"  i {skipped_prod} production-only doctrine file skipped (kit-aware).")
    if skipped_cat > 0:
        print(f"  i {skipped_cat} other-category boilerplate skipped (category={category}).")
    if skipped_cat_agent > 0:
        print(f"  i {skipped_cat_agent} other-category agent(s) skipped (category={category}).")
    if skipped_agent > 0:
        print(f"  i {skipped_agent} prompt-engineer agent skipped (Phase 0.6 mode=off).")


# Phase 0.6 prompt-engineer mode descriptions (frontmatter `description:` value).
# 'match' is the default — preserves the agent's existing trigger pattern.
# Source-of-truth for these strings is also CLAUDE.md.tmpl `## Prompt-engineer mode`
# section (4 templates inline). If you edit one, edit both.
PROMPT_ENGINEER_DESCRIPTIONS = {
    "aggressive": (
        "Always-on prompt structurizer. Trigger on EVERY user message that contains "
        "a verb in imperative mood (yap, ekle, çevir, kur, build, add, fix, create). "
        "BUILD mode by default; AUDIT/SECURITY on explicit request. Do not stay silent "
        "— prompt quality > friction cost."
    ),
    "match": (
        "Two-mode doctrine agent. (1) BUILD mode — convert casual user requests "
        "(\"X yap\", \"Y ekle\", \"Z'yi otomatize et\") into structured paste-ready prompts. "
        "(2) AUDIT mode — analyze the current project against all trainings, CLAUDE.md "
        "rules, and skills; surface violations and propose surgical fixes. Use proactively "
        "whenever the user describes work casually OR asks to review/audit/check the project."
    ),
    "manual": (
        "Manual-only invocation. Trigger ONLY when user explicitly says "
        "\"prompt-engineer\", \"BUILD modu\", or \"AUDIT modu\". Do not trigger proactively "
        "even on casual requests. Default behavior: stay silent. /project-advisor skill "
        "handles weekly audits separately."
    ),
}


def _swap_agent_description(content: str, new_desc: str) -> str:
    """Replace the `description:` line in the YAML frontmatter."""
    import re
    # Match `description: ...` up to the next line that doesn't continue (top-level YAML key).
    # Frontmatter keys are simple here — single-line description after `name:` line.
    pattern = re.compile(r"^description:.*$", re.MULTILINE)
    if pattern.search(content):
        return pattern.sub(f"description: {new_desc}", content, count=1)
    return content  # no match — leave content unchanged


def copy_agent(target: Path, mode: str = "match") -> bool:
    """Copy prompt-engineer.md and rewrite description per Phase 0.6 mode.

    mode: 'aggressive' | 'match' (default) | 'manual' | 'off'.
    'off' skips the copy entirely.
    """
    if mode == "off":
        print("  i prompt-engineer agent skipped (Phase 0.6 mode=off)")
        return False
    if mode not in PROMPT_ENGINEER_DESCRIPTIONS:
        print(f"  ! unknown prompt-engineer mode '{mode}' — defaulting to 'match'")
        mode = "match"

    pylib_src = PYLIB / "agents" / "prompt-engineer.md"
    template_src = TEMPLATE / ".claude" / "agents" / "prompt-engineer.md"
    src = pylib_src if pylib_src.exists() else template_src
    if not src.exists():
        print("  ! prompt-engineer agent kaynak yok (ne pylib ne vendored)")
        return False
    dst = target / ".claude" / "agents" / "prompt-engineer.md"
    dst.parent.mkdir(parents=True, exist_ok=True)

    content = src.read_text(encoding="utf-8")
    if mode != "match":
        # Match is the default in the source file; only rewrite for non-default modes
        # so we don't churn description text when the user didn't ask for a change.
        content = _swap_agent_description(content, PROMPT_ENGINEER_DESCRIPTIONS[mode])
    dst.write_text(content, encoding="utf-8")

    origin = "pylib" if src == pylib_src else "vendored"
    print(f"  ✓ .claude/agents/prompt-engineer.md ({origin}, mode={mode})")
    return True


def copy_intel_scripts(target: Path) -> int:
    """Intel scripts are Layermark-internal; only available if pylib is set up locally.
    External users (no ~/.layermark/pylib/) get a fallback scripts/README.md with
    alternative paths so they're not stuck with an empty scripts/ folder."""
    pylib_yt = PYLIB / "youtube"
    if not pylib_yt.exists():
        # External user fallback — write README + DIY hints
        dst_dir = target / "scripts"
        dst_dir.mkdir(exist_ok=True)
        fallback_readme = dst_dir / "README.md"
        fallback_readme.write_text(
            "# Scripts — Layermark-internal pipeline yok\n\n"
            "**Bu klasör boş çünkü intel scan script'leri Layermark-internal infrastructure**\n"
            "(`~/.layermark/pylib/youtube/`) gerektirir. Ama watchlist + knowledge base hazır;\n"
            "kendi pipeline'ını ekleyebilirsin.\n\n"
            "## Alternatifler\n\n"
            "**1. DIY YouTube tarayıcı (~50 satır Python)** — `requirements.txt`'de hazır:\n"
            "- `feedparser` → channel RSS\n"
            "- `youtube-transcript-api` → transcript\n"
            "- `lxml` + `beautifulsoup4` → fallback HTML parse\n\n"
            "**2. yt-dlp CLI** (her platform):\n"
            "```bash\n"
            "pip install yt-dlp\n"
            "yt-dlp --skip-download --write-auto-sub --sub-lang en <video-url>\n"
            "```\n\n"
            "**3. Anthropic-hosted MCP** — Claude Code session'ında MCP server bağla,\n"
            "watchlist'i feed olarak gönder, agent kendi scrape etsin.\n\n"
            "## config/watchlists.yaml\n\n"
            "Hazır kanal/handle listesi `config/watchlists.yaml`'da. Senin yazacağın script\n"
            "bu dosyayı okur, her item için son N gün'ü tarar, `02-memory/youtube-intel/<date>.md`'ye\n"
            "yazar.\n\n"
            "## Soru olursa\n"
            "`/grill-me` çağır, intel pipeline spec'ini birlikte çıkar. Sonra `/skill-creator`\n"
            "CREATE mode ile script'i yaratırsın.\n",
            encoding="utf-8",
        )
        print(f"  ! intel script'leri Layermark-specific — scripts/README.md ile DIY rehberi yazıldı")
        print(f"    External user için alternatifler (feedparser / yt-dlp / MCP) belgelendi.")
        return 0
    scripts = ["intel_scan.py", "x_intel_scan.py", "x_video_transcribe.py", "resolve_handles.py"]
    dst_dir = target / "scripts"
    dst_dir.mkdir(exist_ok=True)
    n = 0
    for s in scripts:
        src = pylib_yt / s
        if src.exists():
            shutil.copy2(src, dst_dir / s)
            n += 1
    (dst_dir / "__init__.py").touch()
    print(f"  ✓ scripts/ ({n} intel script)")
    return n


def write_watchlist(target: Path, preset_key: str) -> None:
    cfg = target / "config"
    cfg.mkdir(exist_ok=True)
    out = cfg / "watchlists.yaml"
    if out.exists():
        print(f"  [skip] config/watchlists.yaml zaten var")
        return
    if preset_key in PRESETS:
        try:
            import yaml
            data = {
                "youtube_channels": PRESETS[preset_key]["youtube_channels"],
                "x_accounts": PRESETS[preset_key]["x_accounts"],
                "all_subscriptions": [],
            }
            out.write_text(yaml.safe_dump(data, allow_unicode=True, sort_keys=False, width=200), encoding="utf-8")
            n_yt = len(PRESETS[preset_key]["youtube_channels"])
            n_x = len(PRESETS[preset_key]["x_accounts"])
            print(f"  ✓ config/watchlists.yaml ({preset_key}: {n_yt} YT + {n_x} X)")
            return
        except ImportError:
            print("  ! pyyaml kurulu degil — bos sablon yazildi")
    out.write_text("youtube_channels: []\nx_accounts: []\nall_subscriptions: []\n", encoding="utf-8")
    print("  ✓ config/watchlists.yaml (bos)")


def write_kb_skeleton(target: Path) -> None:
    kb = target / "knowledge"
    (kb / "raw").mkdir(parents=True, exist_ok=True)
    (kb / "wiki").mkdir(parents=True, exist_ok=True)
    (kb / "raw" / ".gitkeep").touch()
    (kb / "wiki" / ".gitkeep").touch()
    schema = kb / "schema.md"
    if not schema.exists():
        schema.write_text(
            "# Knowledge schema\n\n"
            "## Conventions\n\n"
            "- `raw/` — kaynak dump, Claude **degistirmez**. Dosya adi: `<source>-<YYYY-MM-DD>.md`.\n"
            "- `wiki/` — Claude'un sentezi. Bir konu = bir dosya. Cross-ref'ler `[[wiki-page]]` formatinda.\n"
            "- Profil dosyalari: `wiki/people/<name>.md`. Tool dosyalari: `wiki/tools/<name>.md`.\n\n"
            "## Health check (aylik)\n\n"
            "Claude'a: \"Bu schema'ya gore wiki'yi audit et — celiski, stale info, yetim raw kaynaklar. Rapor + fix onerisi, dokunma.\"\n",
            encoding="utf-8",
        )
    print("  ✓ knowledge/{raw,wiki}/ + schema.md")


def write_python_stack(target: Path, *, intel: bool = False, pylib_present: bool = False) -> None:
    # Default: empty requirements (user adds as needed). Intel kit without pylib
    # gets baseline DIY packages (so external users can build their own scraper).
    if intel and not pylib_present:
        req = (
            "# pip install -r requirements.txt\n"
            "# Intel kit DIY baseline (Layermark-internal pylib yok — kendi scraper'ını yaz):\n"
            "feedparser>=6.0\n"
            "youtube-transcript-api>=0.6\n"
            "beautifulsoup4>=4.12\n"
            "lxml>=5.0\n"
            "requests>=2.31\n"
        )
    else:
        req = "# pip install -r requirements.txt\n"
    (target / "requirements.txt").write_text(req, encoding="utf-8")
    pkg_name = to_ascii_slug(target.name)  # PEP 508 — only [a-z0-9-]
    (target / "pyproject.toml").write_text(
        f'[project]\nname = "{pkg_name}"\nversion = "0.1.0"\nrequires-python = ">=3.10"\n',
        encoding="utf-8",
    )
    print("  ✓ requirements.txt + pyproject.toml")


def write_node_stack(target: Path) -> None:
    pkg_name = to_ascii_slug(target.name)  # npm — only [a-z0-9-]
    (target / "package.json").write_text(
        f'{{\n  "name": "{pkg_name}",\n  "version": "0.1.0",\n  "private": true,\n  "type": "module"\n}}\n',
        encoding="utf-8",
    )
    print("  ✓ package.json")


def write_web_stack(target: Path) -> None:
    pkg_name = to_ascii_slug(target.name)  # npm — only [a-z0-9-]
    (target / "package.json").write_text(
        f'{{\n  "name": "{pkg_name}",\n  "version": "0.1.0",\n  "private": true,\n  "type": "module"\n}}\n',
        encoding="utf-8",
    )
    (target / "tsconfig.json").write_text(
        '{\n  "compilerOptions": {\n    "target": "ES2022",\n    "module": "ESNext",\n    "moduleResolution": "bundler",\n    "jsx": "react-jsx",\n    "strict": true\n  }\n}\n',
        encoding="utf-8",
    )
    print("  ✓ package.json + tsconfig.json")


def init_git(target: Path) -> bool:
    try:
        subprocess.run(["git", "init", "-q"], cwd=target, check=True)
        print("  ✓ git init")
        return True
    except Exception as e:
        print(f"  ! git init failed: {e}")
        return False


def gh_create(target: Path, name: str, visibility: str) -> bool:
    try:
        subprocess.run(
            ["gh", "repo", "create", name, f"--{visibility}", "--source=.", "--remote=origin"],
            cwd=target, check=True,
        )
        subprocess.run(["git", "add", "-A"], cwd=target, check=True)
        subprocess.run(["git", "commit", "-q", "-m", "Initial commit from layermark-starter"], cwd=target, check=True)
        subprocess.run(["git", "branch", "-M", "main"], cwd=target, check=True)
        subprocess.run(["git", "push", "-u", "origin", "main", "-q"], cwd=target, check=True)
        print(f"  ✓ GitHub repo created ({visibility}) + pushed")
        return True
    except Exception as e:
        print(f"  ! gh repo create failed: {e}")
        return False


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--yes", action="store_true")
    parser.add_argument("--name")
    parser.add_argument("--target")
    parser.add_argument("--kit", choices=["assistant", "intel", "blank"], help="Pre-built kit (CI mode)")
    parser.add_argument("--category", choices=list(CATEGORIES.keys()),
                        help="Domain category. Determines which 02-memory/category/<file>.md is loaded. "
                             "Default: auto from kit. HIGH-RISK (finance, legal) auto-include production doctrine docs.")
    parser.add_argument("--stack", choices=["python", "node", "web", "none"], default="none")
    parser.add_argument("--intel", action="store_true")
    parser.add_argument("--watchlist", choices=["ai", "marketing", "indie", "custom", "none"], default="none")
    parser.add_argument("--kb", action="store_true")
    parser.add_argument("--prompt-engineer-mode",
                        choices=["aggressive", "match", "manual", "off"],
                        default="match",
                        dest="prompt_engineer_mode",
                        help="Phase 0.6 — when does prompt-engineer agent trigger? "
                             "aggressive=every imperative msg | match=casual+audit (default) | "
                             "manual=explicit only | off=don't copy agent.")
    args = parser.parse_args()

    if args.yes:
        if not args.name:
            sys.exit("--yes ile --name zorunlu")
        name = args.name
        # Default target = ./<slug> (ASCII), NOT ./<name> — TR/Unicode chars
        # break macOS HFS+ NFD/NFC sync, Dropbox, and `pyproject.toml` PEP 508
        target = Path(args.target or f"./{to_ascii_slug(name)}").resolve()
        # Kit flag > individual flags
        if args.kit and args.kit in KITS:
            kit = KITS[args.kit]
            stack = kit["stack"] or args.stack
            intel = kit["intel"] if kit["intel"] is not None else args.intel
            wl = kit["watchlist"] or args.watchlist
            kb = kit["kb"] if kit["kb"] is not None else args.kb
        else:
            stack = args.stack
            intel = args.intel
            wl = args.watchlist
            kb = args.kb
        gitinit = False
        gh = False
        visibility = "private"
    else:
        # FIRST: language selection (everything else respects this).
        # 10 languages with full welcome banner translations. Subsequent wizard
        # questions still branch TR/EN (non-TR languages see EN questions).
        LANG_OPTIONS = [
            ("en", "English"),
            ("tr", "Türkçe"),
            ("es", "Español"),
            ("pt", "Português"),
            ("de", "Deutsch"),
            ("fr", "Français"),
            ("ru", "Русский"),
            ("ar", "العربية"),
            ("zh", "简体中文"),
            ("ja", "日本語"),
        ]
        print()
        print("  Language / Dil / Idioma / Sprache / Langue / Язык / اللغة / 语言 / 言語")
        for i, (_, name) in enumerate(LANG_OPTIONS, 1):
            print(f"    {i}) {name}")
        lang_idx = choose("Choose / Seç:", [name for _, name in LANG_OPTIONS])
        ui_lang = LANG_OPTIONS[lang_idx][0]

        # Plain welcome banner in chosen language — non-tech user sees what's installed.
        WELCOME_BANNERS: dict[str, list[str]] = {
            "en": [
                "  Welcome 👋",
                "  Layermark Starter — ready Claude Code project",
                "",
                "  This setup will install for you:",
                "",
                "  📂 CLAUDE.md          — guide Claude reads at every session",
                "                          ('how my project works')",
                "  🛠 15 ready-to-use     — /grill-me, /verify-agent-output,",
                "     skills               /agent-approval, /suspend, /resume...",
                "  🤖 prompt-engineer    — turns your casual requests into",
                "     agent                clean Claude prompts + audits the project",
                "  📚 20 doctrines       — distilled from Pocock + AI Engineer +",
                "                          Anthropic Engineering trainings",
                "  🎯 10 category packs   — finance/legal etc. HIGH-RISK areas",
                "                          get extra safety automatically",
                "  🪝 2 hooks + config    — remembers every edit, snapshots each",
                "                          session end (Memento doctrine)",
                "",
                "  💡 When does the Prompt Engineer Agent activate?",
                "     AFTER the wizard finishes → on every 'do/add/build' request",
                "     it refines your prompt; on 'check/review' it audits the project.",
                "     You'll pick its sensitivity in Phase 0.6 of the wizard.",
                "",
                "  In a moment I'll ask a few questions: project name + category.",
                "  Then when you open Claude Code, the wizard continues there —",
                "  9 more questions to understand your project.",
            ],
            "tr": [
                "  Hoş geldin 👋",
                "  Layermark Starter — Claude Code'a hazır proje",
                "",
                "  Bu kurulum sana şunları getirecek:",
                "",
                "  📂 CLAUDE.md          — Claude'un her session'da okuyacağı",
                "                          'projem nasıl çalışır' rehberi",
                "  🛠 15 hazır skill      — /grill-me, /verify-agent-output,",
                "                          /agent-approval, /suspend, /resume...",
                "  🤖 prompt-engineer    — günlük dilini Claude'a düzgün",
                "     asistanı            promptlara çevirir + projeyi denetler",
                "  📚 20 doctrine        — Pocock + AI Engineer + Anthropic",
                "                          eğitiminden damıtılmış kurallar",
                "  🎯 10 kategori şablonu — finans/hukuk gibi yüksek-riskli",
                "                          alanlarda otomatik ek korumalar",
                "  🪝 2 hook + ayar       — her edit'i hatırlar, her session",
                "                          sonu özet bırakır (Memento doctrine)",
                "",
                "  💡 Prompt Engineer Agent ne zaman aktive olur?",
                "     Wizard'ı tamamladıktan SONRA → 'yap/ekle/kur' tarzı her",
                "     isteğinde prompt'unu düzenler; 'kontrol et' dediğinde",
                "     projeyi denetler. Hassasiyetini Phase 0.6'da seçeceksin.",
                "",
                "  Az sonra birkaç soru soracağım: proje adı + alan kategorisi.",
                "  Sonra Claude Code session'ı açtığında wizard devam edecek —",
                "  sana 9 soru ile projeni anlamaya çalışacak.",
            ],
            "es": [
                "  Bienvenido 👋",
                "  Layermark Starter — proyecto listo para Claude Code",
                "",
                "  Esta instalación incluirá:",
                "",
                "  📂 CLAUDE.md          — guía que Claude lee en cada sesión",
                "                          ('cómo funciona mi proyecto')",
                "  🛠 15 skills listas    — /grill-me, /verify-agent-output,",
                "                          /agent-approval, /suspend, /resume...",
                "  🤖 agente              — convierte tus pedidos casuales en",
                "     prompt-engineer     prompts limpios + audita el proyecto",
                "  📚 20 doctrinas       — destiladas de Pocock + AI Engineer +",
                "                          formaciones de Anthropic Engineering",
                "  🎯 10 packs por        — áreas de ALTO RIESGO (finanzas/legal)",
                "     categoría           reciben seguridad extra automática",
                "  🪝 2 hooks + config    — recuerda cada edición, snapshot al",
                "                          final de cada sesión (doctrina Memento)",
                "",
                "  💡 ¿Cuándo se activa el Prompt Engineer Agent?",
                "     DESPUÉS de terminar el asistente → en cada solicitud de",
                "     'haz/añade/construye' refina tu prompt; en 'revisa' audita",
                "     el proyecto. Elegirás su sensibilidad en la Fase 0.6.",
                "",
                "  En un momento haré algunas preguntas: nombre del proyecto +",
                "  categoría. Luego al abrir Claude Code, el asistente continúa",
                "  allí — 9 preguntas más para entender tu proyecto.",
            ],
            "pt": [
                "  Bem-vindo 👋",
                "  Layermark Starter — projeto pronto para Claude Code",
                "",
                "  Esta instalação vai instalar:",
                "",
                "  📂 CLAUDE.md          — guia que Claude lê a cada sessão",
                "                          ('como meu projeto funciona')",
                "  🛠 15 skills prontas   — /grill-me, /verify-agent-output,",
                "                          /agent-approval, /suspend, /resume...",
                "  🤖 agente              — transforma pedidos casuais em prompts",
                "     prompt-engineer     limpos para Claude + audita o projeto",
                "  📚 20 doutrinas       — destiladas de Pocock + AI Engineer +",
                "                          treinamentos da Anthropic Engineering",
                "  🎯 10 packs por        — áreas de ALTO RISCO (finanças/legal)",
                "     categoria           recebem segurança extra automática",
                "  🪝 2 hooks + config    — lembra cada edição, snapshot ao",
                "                          fim de cada sessão (doutrina Memento)",
                "",
                "  💡 Quando o Prompt Engineer Agent é ativado?",
                "     DEPOIS que o assistente terminar → a cada pedido de",
                "     'faça/adicione/construa' refina seu prompt; em 'revise'",
                "     audita o projeto. Sensibilidade escolhida na Fase 0.6.",
                "",
                "  Em instantes farei algumas perguntas: nome do projeto +",
                "  categoria. Depois, ao abrir Claude Code, o assistente",
                "  continua lá — mais 9 perguntas para entender seu projeto.",
            ],
            "de": [
                "  Willkommen 👋",
                "  Layermark Starter — bereitstehendes Claude-Code-Projekt",
                "",
                "  Dieses Setup installiert für dich:",
                "",
                "  📂 CLAUDE.md          — Anleitung, die Claude in jeder",
                "                          Sitzung liest ('so läuft mein Projekt')",
                "  🛠 15 fertige Skills   — /grill-me, /verify-agent-output,",
                "                          /agent-approval, /suspend, /resume...",
                "  🤖 prompt-engineer    — wandelt Alltagsanfragen in saubere",
                "     Agent               Claude-Prompts um + auditiert Projekt",
                "  📚 20 Doktrinen       — destilliert aus Pocock + AI Engineer +",
                "                          Anthropic-Engineering-Trainings",
                "  🎯 10 Kategorie-Packs  — HIGH-RISK-Bereiche (Finanzen/Recht)",
                "                          erhalten automatisch Extra-Sicherheit",
                "  🪝 2 Hooks + Config    — merkt jede Bearbeitung, Snapshot am",
                "                          Sitzungsende (Memento-Doktrin)",
                "",
                "  💡 Wann wird der Prompt Engineer Agent aktiviert?",
                "     NACH dem Wizard → bei jeder 'mach/füge hinzu/baue'-Anfrage",
                "     verfeinert er deinen Prompt; bei 'prüfe' auditiert er das",
                "     Projekt. Empfindlichkeit wählst du in Phase 0.6.",
                "",
                "  Gleich stelle ich ein paar Fragen: Projektname + Kategorie.",
                "  Wenn du Claude Code öffnest, geht der Wizard dort weiter —",
                "  9 weitere Fragen, um dein Projekt zu verstehen.",
            ],
            "fr": [
                "  Bienvenue 👋",
                "  Layermark Starter — projet Claude Code prêt à l'emploi",
                "",
                "  Cette installation va installer pour toi :",
                "",
                "  📂 CLAUDE.md          — guide que Claude lit à chaque session",
                "                          ('comment mon projet fonctionne')",
                "  🛠 15 skills prêts     — /grill-me, /verify-agent-output,",
                "                          /agent-approval, /suspend, /resume...",
                "  🤖 agent               — transforme tes demandes du quotidien",
                "     prompt-engineer     en prompts propres + audite le projet",
                "  📚 20 doctrines       — distillées de Pocock + AI Engineer +",
                "                          formations Anthropic Engineering",
                "  🎯 10 packs par        — zones À HAUT RISQUE (finance/légal)",
                "     catégorie           reçoivent une sécurité extra auto",
                "  🪝 2 hooks + config    — garde chaque édition, snapshot à la",
                "                          fin de chaque session (doctrine Memento)",
                "",
                "  💡 Quand le Prompt Engineer Agent s'active-t-il ?",
                "     APRÈS la fin du wizard → à chaque demande 'fais/ajoute/",
                "     construis' il affine ton prompt ; sur 'vérifie' il audite",
                "     le projet. Sensibilité choisie en Phase 0.6.",
                "",
                "  Dans un instant je poserai quelques questions : nom du projet +",
                "  catégorie. Puis en ouvrant Claude Code, le wizard continue —",
                "  9 questions de plus pour comprendre ton projet.",
            ],
            "ru": [
                "  Добро пожаловать 👋",
                "  Layermark Starter — готовый проект Claude Code",
                "",
                "  Эта установка добавит:",
                "",
                "  📂 CLAUDE.md          — справочник, который Claude читает",
                "                          в каждой сессии ('как работает проект')",
                "  🛠 15 готовых skills   — /grill-me, /verify-agent-output,",
                "                          /agent-approval, /suspend, /resume...",
                "  🤖 агент               — превращает обычные запросы в чистые",
                "     prompt-engineer     prompts для Claude + аудитит проект",
                "  📚 20 доктрин          — выжимка из Pocock + AI Engineer +",
                "                          тренингов Anthropic Engineering",
                "  🎯 10 категорий         — зоны ВЫСОКОГО РИСКА (финансы/право)",
                "                          автоматически получают доп. защиту",
                "  🪝 2 hook + конфиг      — помнит каждое редактирование, снапшот",
                "                          в конце сессии (доктрина Memento)",
                "",
                "  💡 Когда активируется Prompt Engineer Agent?",
                "     ПОСЛЕ завершения мастера → на каждый запрос 'сделай/добавь/",
                "     собери' уточняет prompt; на 'проверь' аудитит проект.",
                "     Чувствительность выбираешь в Phase 0.6.",
                "",
                "  Сейчас задам несколько вопросов: имя проекта + категория.",
                "  Затем, открыв Claude Code, мастер продолжит работу там —",
                "  ещё 9 вопросов, чтобы понять твой проект.",
            ],
            "ar": [
                "  مرحبا 👋",
                "  Layermark Starter — مشروع Claude Code جاهز",
                "",
                "  ستثبت لك هذه العملية:",
                "",
                "  📂 CLAUDE.md          — دليل يقرأه Claude في كل جلسة",
                "                          ('كيف يعمل مشروعي')",
                "  🛠 15 skill جاهزة      — /grill-me, /verify-agent-output,",
                "                          /agent-approval, /suspend, /resume...",
                "  🤖 وكيل                — يحول طلباتك العادية إلى prompts",
                "     prompt-engineer    نظيفة + يدقق المشروع",
                "  📚 20 مذهب             — مقطرة من Pocock + AI Engineer +",
                "                          تدريبات Anthropic Engineering",
                "  🎯 10 حزم فئات         — مناطق عالية المخاطر (المالية/القانون)",
                "                          تحصل على حماية إضافية تلقائيا",
                "  🪝 2 hook + إعدادات    — يتذكر كل تعديل، snapshot في نهاية",
                "                          كل جلسة (مذهب Memento)",
                "",
                "  💡 متى يتم تنشيط Prompt Engineer Agent؟",
                "     بعد انتهاء المعالج ← في كل طلب 'افعل/أضف/ابني'",
                "     يحسن prompt الخاص بك؛ في 'راجع' يدقق المشروع.",
                "     ستختار حساسيته في المرحلة 0.6.",
                "",
                "  بعد قليل سأطرح بعض الأسئلة: اسم المشروع + الفئة.",
                "  ثم عند فتح Claude Code، يكمل المعالج هناك —",
                "  9 أسئلة أخرى لفهم مشروعك.",
            ],
            "zh": [
                "  欢迎 👋",
                "  Layermark Starter — Claude Code 就绪项目",
                "",
                "  此安装将为你添加：",
                "",
                "  📂 CLAUDE.md          — Claude 每个会话读取的指南",
                "                          （'我的项目如何运作'）",
                "  🛠 15 个现成 skill     — /grill-me, /verify-agent-output,",
                "                          /agent-approval, /suspend, /resume...",
                "  🤖 prompt-engineer    — 将日常请求转换为干净的 Claude",
                "     代理                 prompts + 审计项目",
                "  📚 20 条 doctrine     — 提炼自 Pocock + AI Engineer +",
                "                          Anthropic Engineering 培训",
                "  🎯 10 个类别包         — 高风险领域（金融/法律）自动",
                "                          获得额外安全保护",
                "  🪝 2 个 hook + 配置    — 记住每次编辑，每次会话结束做",
                "                          快照（Memento doctrine）",
                "",
                "  💡 Prompt Engineer Agent 何时激活？",
                "     向导完成后 → 每次 '做/添加/构建' 请求时优化你的 prompt；",
                "     '检查/审查' 时审计项目。在第 0.6 阶段选择其敏感度。",
                "",
                "  稍后我会问几个问题：项目名称 + 类别。",
                "  然后打开 Claude Code 时,向导会在那里继续 —",
                "  再问 9 个问题来理解你的项目。",
            ],
            "ja": [
                "  ようこそ 👋",
                "  Layermark Starter — Claude Code 用意済みプロジェクト",
                "",
                "  このセットアップでは以下をインストールします:",
                "",
                "  📂 CLAUDE.md          — Claude が毎セッション読むガイド",
                "                          ('プロジェクトの動き方')",
                "  🛠 15 個の skill       — /grill-me, /verify-agent-output,",
                "                          /agent-approval, /suspend, /resume...",
                "  🤖 prompt-engineer    — 普段の依頼を Claude 用の整った",
                "     エージェント         prompt に変換 + プロジェクトを監査",
                "  📚 20 の doctrine     — Pocock + AI Engineer +",
                "                          Anthropic Engineering からの抽出",
                "  🎯 10 のカテゴリパック  — 金融/法務などハイリスク分野は",
                "                          自動で追加の安全策を取得",
                "  🪝 2 つの hook + 設定   — 編集を全て記憶、セッション終了",
                "                          時に snapshot (Memento doctrine)",
                "",
                "  💡 Prompt Engineer Agent はいつ起動しますか?",
                "     ウィザード完了後 → '作って/追加して/構築して' の依頼ごと",
                "     に prompt を整え、'確認して' でプロジェクトを監査。",
                "     感度は Phase 0.6 で選択。",
                "",
                "  まもなく数問お尋ねします: プロジェクト名 + カテゴリ。",
                "  Claude Code を開くとウィザードが続行 —",
                "  さらに 9 問でプロジェクトを理解します。",
            ],
        }
        print()
        print("=" * 64)
        for line in WELCOME_BANNERS[ui_lang]:
            print(line)
        print("=" * 64)
        print()

        # Subsequent wizard questions only have TR/EN copy. Non-TR languages
        # see EN questions; banner already established expectation.
        if ui_lang not in ("en", "tr"):
            ui_lang = "en"

        # Kit selection kaldırıldı — herkese "Boş Sayfa / Blank" davranışı default.
        # Eski kit'ler (assistant / intel) hâlâ --kit CLI flag için CI'da kullanılıyor;
        # interactive wizard'da sorulmuyor.
        kit_key = "blank"
        kit = KITS[kit_key]

        if ui_lang == "tr":
            name = ask("Proje adı? (Türkçe olabilir, klasör ASCII'ye çevrilir)")
            if not name:
                sys.exit("Proje adı zorunlu.")
        else:
            name = ask("Project name? (any language; folder will be ASCII-slugged)")
            if not name:
                sys.exit("Project name is required.")
        slug = to_ascii_slug(name)
        if slug != name.lower():
            arrow = "→ ASCII klasör adı:" if ui_lang == "tr" else "→ ASCII folder name:"
            tail = f"(Subject olarak '{name}' README'de saklanır)" if ui_lang == "tr" else f"(original '{name}' kept in README)"
            print(f"  {arrow} {slug} {tail}")
        target_prompt = "Hedef klasör?" if ui_lang == "tr" else "Target folder?"
        target = Path(ask(target_prompt, default=f"./{slug}")).resolve()

        # Phase 0.3 — Domain kategori (10 + genel).
        cat_keys = [k for k in CATEGORIES.keys() if k != "general"] + ["general"]
        if ui_lang == "tr":
            print("\nProjende ne yapacaksın? (kategori — risk profilini ve özel kuralları belirler):")
            cat_q = "Hangi kategori?"
        else:
            print("\nWhat will your project do? (category — sets risk profile and special rules):")
            cat_q = "Which category?"
        cat_labels = []
        for k in cat_keys:
            c = CATEGORIES[k]
            mark = " ⚠ HIGH RISK" if c.get("high_risk") else ""
            cat_labels.append(f"{c['label']}{mark}")
        cat_idx = choose(cat_q, cat_labels)
        category = cat_keys[cat_idx]
        if CATEGORIES[category].get("high_risk"):
            if ui_lang == "tr":
                print(f"  ⚠ HIGH-RISK kategori ({CATEGORIES[category]['label']}) → güvenlik için ek kurallar otomatik açılacak (immutable ledger, agent-approval gate, red-team check).")
            else:
                print(f"  ⚠ HIGH-RISK category ({CATEGORIES[category]['label']}) → extra safety rules auto-enabled (immutable ledger, agent-approval gate, red-team check).")
        elif category == "general":
            print("  → " + ("Kategori boilerplate'i kopyalanmaz, vanilla kurulum." if ui_lang == "tr" else "No category boilerplate, vanilla setup."))
        else:
            tail_msg = "yüklenecek (kategoriye özel pattern'ler)" if ui_lang == "tr" else "will be loaded (category-specific patterns)"
            print(f"  → 02-memory/category/{CATEGORIES[category]['file']} {tail_msg}.")

        # Stack/intel/kb (kit defaults removed).
        stack_q = "\nHangi tip proje?" if ui_lang == "tr" else "\nWhat kind of project?"
        stack_options = ["Python (otomasyon, bot, veri)", "Node.js (modern JS)", "Web (TS+React, etkileşimli site)", "Sadece dokümantasyon"] if ui_lang == "tr" else ["Python (automation, bot, data)", "Node.js (modern JS)", "Web (TS+React, interactive site)", "Documentation only"]
        stack_idx = choose(stack_q, stack_options)
        stack = ["python", "node", "web", "none"][stack_idx]

        intel_q = "\nIntel pipeline (YouTube + X otomatik tarama) eklensin mi?" if ui_lang == "tr" else "\nAdd intel pipeline (YouTube + X auto-scan)?"
        intel = yes_no(intel_q, default_yes=False)

        wl = "none"
        if intel:
            wl_q = "Watchlist preset:" if ui_lang == "tr" else "Watchlist preset:"
            wl_opts = ["AI/agent (Anthropic, Karpathy, AI Engineer, ...)", "Marketing/SEO", "Indie hacker", "Custom (boş)", "None"] if ui_lang == "tr" else ["AI/agent (Anthropic, Karpathy, AI Engineer, ...)", "Marketing/SEO", "Indie hacker", "Custom (empty)", "None"]
            wl_idx = choose(wl_q, wl_opts)
            wl = ["ai", "marketing", "indie", "custom", "none"][wl_idx]

        kb_q = "\nKnowledge base (raw kaynak + Claude sentezi) hemen kurulsun mu?" if ui_lang == "tr" else "\nSet up knowledge base (raw sources + Claude synthesis) now?"
        kb = yes_no(kb_q, default_yes=False)

        git_q = "\nGit ile versionla? (önerilir)" if ui_lang == "tr" else "\nUse Git for versioning? (recommended)"
        gitinit = yes_no(git_q, default_yes=True)
        gh = False
        visibility = "private"
        if gitinit:
            gh_q = "GitHub repo da oluştur (gh CLI gerekli)?" if ui_lang == "tr" else "Also create a GitHub repo (gh CLI required)?"
            gh = yes_no(gh_q, default_yes=False)
            if gh:
                v_q = "Görünürlük:" if ui_lang == "tr" else "Visibility:"
                v_opts = ["private (sadece sen)", "public (herkes görür)"] if ui_lang == "tr" else ["private (only you)", "public (everyone sees it)"]
                v_idx = choose(v_q, v_opts)
                visibility = ["private", "public"][v_idx]

        print("\n" + "=" * 60)
        if ui_lang == "tr":
            print(f"  Proje:    {name}")
            print(f"  Yol:      {target}")
            cat_lbl = CATEGORIES[category]['label']
            cat_risk = " ⚠ HIGH RISK" if CATEGORIES[category].get("high_risk") else ""
            print(f"  Kategori: {cat_lbl}{cat_risk}")
            print(f"  Stack:    {stack}")
            print(f"  Intel:    {'evet' if intel else 'hayır'}{' (' + wl + ')' if intel else ''}")
            print(f"  KB:       {'evet' if kb else 'hayır'}")
            print(f"  Git:      {'init' if gitinit else 'yok'}{', GitHub: ' + visibility if gh else ''}")
        else:
            print(f"  Project:  {name}")
            print(f"  Path:     {target}")
            cat_lbl = CATEGORIES[category]['label']
            cat_risk = " ⚠ HIGH RISK" if CATEGORIES[category].get("high_risk") else ""
            print(f"  Category: {cat_lbl}{cat_risk}")
            print(f"  Stack:    {stack}")
            print(f"  Intel:    {'yes' if intel else 'no'}{' (' + wl + ')' if intel else ''}")
            print(f"  KB:       {'yes' if kb else 'no'}")
            print(f"  Git:      {'init' if gitinit else 'skip'}{', GitHub: ' + visibility if gh else ''}")
        print("=" * 60)
        confirm_q = "\nDevam?" if ui_lang == "tr" else "\nProceed?"
        if not yes_no(confirm_q, default_yes=True):
            sys.exit("İptal." if ui_lang == "tr" else "Cancelled.")

    if target.exists() and any(target.iterdir()):
        existing = sorted(p.name for p in target.iterdir())[:5]
        if args.yes:
            sys.exit(
                f"{target} dolu — --yes mode'da üstüne yazma yok.\n"
                f"  Mevcut dosyalar: {', '.join(existing)}{'...' if len(list(target.iterdir())) > 5 else ''}\n"
                f"\n"
                f"  Bu büyük olasılıkla `claude /init` kazası — Doctrine #10 'Never /init' diyor.\n"
                f"  Çözüm seçenekleri:\n"
                f"    1. Auto-generated CLAUDE.md'yi sil ve target'ı temizle:\n"
                f"         rm -rf {target}\n"
                f"    2. Başka bir target ver:\n"
                f"         python setup_starter.py --yes --name={args.name or '<isim>'} --target=./different-folder ...\n"
                f"    3. Interactive mode'da çalıştır (üstüne yaz onayı sorulur):\n"
                f"         python setup_starter.py    # --yes ve --target olmadan"
            )
        if not yes_no(f"\n{target} dolu (mevcut: {', '.join(existing)}). Üstüne yazılsın mı?", default_yes=False):
            sys.exit("İptal.")
    target.mkdir(parents=True, exist_ok=True)

    print(f"\n→ Kuruluyor: {target}\n")

    intel_block = INTEL_README_BLOCK if intel else ""
    stack_block = STACK_README_BLOCK.get(stack, "")
    setup_cmd = {
        "python": "python -m venv .venv && source .venv/bin/activate  # Windows: .venv\\Scripts\\activate\npip install -r requirements.txt",
        "node": "npm install",
        "web": "npm install && npm run dev",
        "none": "(no build step)",
    }[stack]

    # Category-aware deny rules merged into .claude/settings.json
    # (resolved before category — see below in --yes/interactive flow)
    vars_dict = {
        "PROJECT_NAME": name,  # original (TR/EN) — Subject preservation
        "PROJECT_SLUG": to_ascii_slug(name),  # ASCII — folder/code references
        "DESCRIPTION": "(proje açıklaması — sen doldur)",
        "SETUP_COMMANDS": setup_cmd,
        "INTEL_BLOCK": intel_block,
        "STACK_BLOCK": stack_block,
        "CATEGORY_DENIES": "",  # filled below once category resolved
    }

    # Production doctrine docs + category boilerplates kit + category aware:
    #   blank kit  → include production (full custom mode)
    #   assistant  → skip production (single-shot, overhead is noise)
    #   intel      → skip production (read-mostly project)
    #   HIGH-RISK category (finance, legal) → force-include production regardless of kit
    include_prod = (args.kit == "blank") if args.yes else (kit_key == "blank")

    # Category resolution:
    #   --yes mode: explicit --category > kit-default > 'general'
    #   interactive: already set above (Phase 0.3 prompt asks user)
    if args.yes:
        category = args.category or KIT_DEFAULT_CATEGORY.get(args.kit or "blank", "general")
    # else: interactive — `category` already bound by the kit-vs-category prompt above

    # Inject category-aware denies into settings.json template
    vars_dict["CATEGORY_DENIES"] = CATEGORY_DENIES.get(category, "")

    copy_template(
        target,
        vars_dict,
        include_production=include_prod,
        category=category,
        include_agent=(args.prompt_engineer_mode != "off"),
    )
    copy_agent(target, mode=args.prompt_engineer_mode)

    if intel:
        copy_intel_scripts(target)
        write_watchlist(target, wl)

    if kb:
        write_kb_skeleton(target)

    if stack == "python":
        pylib_yt = PYLIB / "youtube"
        write_python_stack(target, intel=intel, pylib_present=pylib_yt.exists())
    elif stack == "node":
        write_node_stack(target)
    elif stack == "web":
        write_web_stack(target)

    if gitinit:
        init_git(target)
        if gh:
            gh_create(target, name, visibility)

    print(f"\n✓ Hazır: {target}")
    print(f"\n  cd {target}")
    if stack != "none":
        print(f"  {setup_cmd}")
    print("  claude  # Claude Code session başlat")
    print("\n  Sıradaki: Claude Code açılınca onboarding wizard tetiklenir (CLAUDE.md'deki")
    print("  'first-run onboarding' bloğu). Wizard bitince Claude doğrudan **İlk session")
    print("  protokolü adım A** ile devam eder — `/grill-me` çağırır, scope'u netleştirir,")
    print("  sonra B (test-first) → C (implement) → D (verify) → E (memory) → G (haftalık audit).")
    print("  Tüm protokol CLAUDE.md `## İlk session protokolü` bölümünde. Açık uçlu kalmazsın.")
    print()
    print("  💡 İsteğe bağlı: pre-commit + CI + cron job pattern'leri için")
    print("     `bash scripts/install_devops.sh` çalıştır. 7 pattern Y/N sorar,")
    print("     kategoriye göre uygun olanları kurar. Detay: 02-memory/doctrine/devops-patterns.md")


if __name__ == "__main__":
    main()

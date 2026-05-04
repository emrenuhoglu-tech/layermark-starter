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


def copy_template(
    target: Path,
    vars: dict[str, str],
    *,
    include_production: bool = False,
    category: str | None = None,
) -> None:
    """Copy template/ files, render .tmpl -> final names.

    `include_production=False` (default for assistant/intel kits): skip files
    under 02-memory/doctrine/ and 02-memory/orchestrator-safety.md.
    `category=<key>` (e.g., "finance"): keep only the matching 02-memory/category/
    boilerplate. Other categories' files are dropped. HIGH-RISK categories
    (finance, legal) auto-include production doctrine docs regardless of kit.
    """
    cat = CATEGORIES.get(category or "general", {})
    if cat.get("high_risk"):
        include_production = True   # HIGH risk = production doctrine zorunlu

    skipped_prod = 0
    skipped_cat = 0
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


def copy_agent(target: Path) -> bool:
    """Use pylib copy if present (latest), else use vendored template copy."""
    pylib_src = PYLIB / "agents" / "prompt-engineer.md"
    template_src = TEMPLATE / ".claude" / "agents" / "prompt-engineer.md"
    src = pylib_src if pylib_src.exists() else template_src
    if not src.exists():
        print("  ! prompt-engineer agent kaynak yok (ne pylib ne vendored)")
        return False
    dst = target / ".claude" / "agents" / "prompt-engineer.md"
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(src, dst)
    origin = "pylib" if src == pylib_src else "vendored"
    print(f"  ✓ .claude/agents/prompt-engineer.md ({origin})")
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
        print("=" * 60)
        print("  layermark-starter — yeni Claude Code projesi")
        print("=" * 60)
        print("\nKit seç (her birinde proje hazır gelir, sonra wizard'la özelleştirirsin):\n")
        kit_keys = list(KITS.keys())
        for i, k in enumerate(kit_keys, 1):
            v = KITS[k]
            print(f"  {i}) {v['label']}")
            print(f"     {v['desc_tr']}")
            print()
        kit_idx = choose("Hangi kit?", [KITS[k]["label"] for k in kit_keys])
        kit_key = kit_keys[kit_idx]
        kit = KITS[kit_key]

        name = ask("\nProje adı? (Türkçe olabilir, klasör ASCII'ye çevrilir)")
        if not name:
            sys.exit("Proje adı zorunlu.")
        slug = to_ascii_slug(name)
        if slug != name.lower():
            print(f"  → ASCII klasör adı: {slug} (Subject olarak '{name}' README'de saklanır)")
        target = Path(ask("Hedef klasör?", default=f"./{slug}")).resolve()

        # Phase 0.3 — Domain kategori (10 + genel). Kit'ten orthogonal: kategori
        # 'hangi domain' (finans/legal vs otomasyon), kit 'hangi tech preset'.
        cat_keys = [k for k in CATEGORIES.keys() if k != "general"] + ["general"]
        cat_default = KIT_DEFAULT_CATEGORY.get(kit_key, "general")
        cat_default_idx = cat_keys.index(cat_default) if cat_default in cat_keys else len(cat_keys) - 1
        print("\nDomain kategori (kit'ten ayrı — boilerplate pattern + risk profili belirler):")
        cat_labels = []
        for k in cat_keys:
            c = CATEGORIES[k]
            mark = " ⚠ HIGH RISK" if c.get("high_risk") else ""
            suffix = "  ← kit varsayılanı" if k == cat_default else ""
            cat_labels.append(f"{c['label']}{mark}{suffix}")
        cat_idx = choose("Hangi kategori?", cat_labels)
        category = cat_keys[cat_idx]
        if CATEGORIES[category].get("high_risk"):
            print(f"  ⚠ HIGH-RISK kategori ({CATEGORIES[category]['label']}) → production doctrine docs (auto-mode classifier, red-team, multi-grader eval) otomatik dahil edilecek.")
        elif category == "general":
            print("  → Kategori boilerplate'i kopyalanmaz, vanilla kurulum.")
        else:
            print(f"  → 02-memory/category/{CATEGORIES[category]['file']} yüklenecek.")

        # Kit pre-fills — sadece "blank" wizard'da hepsini sorar
        if kit["stack"]:
            stack = kit["stack"]
            print(f"  → Stack: {stack} (kit varsayılanı)")
        else:
            stack_idx = choose(
                "\nHangi tip proje?",
                ["Python (otomasyon, bot, veri)", "Node.js (modern JS)", "Web (TS+React, etkileşimli site)", "Sadece dokümantasyon"],
            )
            stack = ["python", "node", "web", "none"][stack_idx]

        if kit["intel"] is not None:
            intel = kit["intel"]
            print(f"  → Intel pipeline: {'evet' if intel else 'hayır'} (kit varsayılanı)")
        else:
            intel = yes_no("\nIntel pipeline (YouTube + X otomatik tarama) eklensin mi?", default_yes=False)

        wl = "none"
        if intel:
            if kit["watchlist"]:
                wl = kit["watchlist"]
                print(f"  → Watchlist: {wl} (kit varsayılanı)")
            else:
                wl_idx = choose(
                    "Watchlist preset:",
                    ["AI/agent (Anthropic, Karpathy, AI Engineer, ...)", "Marketing/SEO", "Indie hacker", "Custom (boş)", "None"],
                )
                wl = ["ai", "marketing", "indie", "custom", "none"][wl_idx]

        if kit["kb"] is not None:
            kb = kit["kb"]
            print(f"  → Knowledge base: {'evet' if kb else 'hayır'} (kit varsayılanı)")
        else:
            kb = yes_no("\nKnowledge base (raw kaynak + Claude sentezi) hemen kurulsun mu?", default_yes=False)

        gitinit = yes_no("\nGit ile versionla? (önerilir)", default_yes=True)
        gh = False
        visibility = "private"
        if gitinit:
            gh = yes_no("GitHub repo da oluştur (gh CLI gerekli)?", default_yes=False)
            if gh:
                v_idx = choose("Görünürlük:", ["private (sadece sen)", "public (herkes görür)"])
                visibility = ["private", "public"][v_idx]

        print("\n" + "=" * 60)
        print(f"  Proje:    {name}")
        print(f"  Yol:      {target}")
        print(f"  Kit:      {kit['label']}")
        cat_lbl = CATEGORIES[category]['label']
        cat_risk = " ⚠ HIGH RISK" if CATEGORIES[category].get("high_risk") else ""
        print(f"  Kategori: {cat_lbl}{cat_risk}")
        print(f"  Stack:    {stack}")
        print(f"  Intel:    {'evet' if intel else 'hayır'}{' (' + wl + ')' if intel else ''}")
        print(f"  KB:       {'evet' if kb else 'hayır'}")
        print(f"  Git:      {'init' if gitinit else 'yok'}{', GitHub: ' + visibility if gh else ''}")
        print("=" * 60)
        if not yes_no("\nDevam?", default_yes=True):
            sys.exit("İptal.")

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

    vars_dict = {
        "PROJECT_NAME": name,  # original (TR/EN) — Subject preservation
        "PROJECT_SLUG": to_ascii_slug(name),  # ASCII — folder/code references
        "DESCRIPTION": "(proje açıklaması — sen doldur)",
        "SETUP_COMMANDS": setup_cmd,
        "INTEL_BLOCK": intel_block,
        "STACK_BLOCK": stack_block,
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

    copy_template(target, vars_dict, include_production=include_prod, category=category)
    copy_agent(target)

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


if __name__ == "__main__":
    main()

"""
layermark-starter — interactive bootstrap for new Claude Code projects.

Asks 6-8 questions, scaffolds skeleton with:
- Minimal CLAUDE.md (Boris-style)
- prompt-engineer agent (copied from ~/.layermark/pylib/agents/)
- Optional intel pipeline + watchlist preset
- Optional Karpathy 3-layer knowledge base
- Stack: Python / Node / Web (TS+React) / None

Usage:
    python setup_starter.py
    python setup_starter.py --yes --name=demo --target=./out --stack=python  # CI mode
"""
import argparse
import shutil
import subprocess
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

PYLIB = Path.home() / ".layermark" / "pylib"
STARTER = Path(__file__).resolve().parent
TEMPLATE = STARTER / "template"

# Watchlist presets — small curated lists per domain
PRESETS: dict[str, dict] = {
    "ai": {
        "youtube_channels": [
            {"id": "UCrDwWp7EBBv4NwvScIpBDOA", "name": "Anthropic", "why": "Claude + research"},
            {"id": "UCXUPKJO5MZQN11PqgIvyuvQ", "name": "Andrej Karpathy", "why": "LLM fundamentals"},
            {"id": "UCFeFVytEkT8kaqPCJZGFswg", "name": "Austin Marchese", "why": "Claude Code workflow distilasyonu"},
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


def copy_template(target: Path, vars: dict[str, str]) -> None:
    """Copy template/ files, render .tmpl -> final names."""
    for src in TEMPLATE.rglob("*"):
        if src.is_dir():
            continue
        rel = src.relative_to(TEMPLATE)
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
    External users (no ~/.layermark/pylib/) will see a graceful skip with hint."""
    pylib_yt = PYLIB / "youtube"
    if not pylib_yt.exists():
        print(f"  ! intel script'leri Layermark-specific (~/.layermark/pylib/youtube/ yok)")
        print("    External user iseniz intel pipeline'i atlayin (intel=hayir).")
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


def write_python_stack(target: Path) -> None:
    (target / "requirements.txt").write_text("# pip install -r requirements.txt\n", encoding="utf-8")
    (target / "pyproject.toml").write_text(
        f'[project]\nname = "{target.name}"\nversion = "0.1.0"\nrequires-python = ">=3.10"\n',
        encoding="utf-8",
    )
    print("  ✓ requirements.txt + pyproject.toml")


def write_node_stack(target: Path) -> None:
    (target / "package.json").write_text(
        f'{{\n  "name": "{target.name}",\n  "version": "0.1.0",\n  "private": true,\n  "type": "module"\n}}\n',
        encoding="utf-8",
    )
    print("  ✓ package.json")


def write_web_stack(target: Path) -> None:
    (target / "package.json").write_text(
        f'{{\n  "name": "{target.name}",\n  "version": "0.1.0",\n  "private": true,\n  "type": "module"\n}}\n',
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
    parser.add_argument("--stack", choices=["python", "node", "web", "none"], default="none")
    parser.add_argument("--intel", action="store_true")
    parser.add_argument("--watchlist", choices=["ai", "marketing", "indie", "custom", "none"], default="none")
    parser.add_argument("--kb", action="store_true")
    args = parser.parse_args()

    if args.yes:
        if not args.name:
            sys.exit("--yes ile --name zorunlu")
        name = args.name
        target = Path(args.target or f"./{name}").resolve()
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
        name = ask("Proje adı?")
        if not name:
            sys.exit("Proje adı zorunlu.")
        target = Path(ask("Hedef klasör?", default=f"./{name}")).resolve()

        stack_idx = choose(
            "Stack:",
            ["Python", "Node.js", "Web (TS+React)", "None / docs only"],
        )
        stack = ["python", "node", "web", "none"][stack_idx]

        intel = yes_no("\nIntel pipeline (YouTube + X scan) eklensin mi?", default_yes=True)
        wl = "none"
        if intel:
            wl_idx = choose(
                "Watchlist preset:",
                ["AI/agent (Anthropic, Karpathy, ...)", "Marketing/SEO", "Indie hacker", "Custom (boş)", "None"],
            )
            wl = ["ai", "marketing", "indie", "custom", "none"][wl_idx]

        kb = yes_no("\nKnowledge base (Karpathy 3-layer) hemen kurulsun mu?", default_yes=False)
        gitinit = yes_no("\ngit init?", default_yes=True)
        gh = False
        visibility = "private"
        if gitinit:
            gh = yes_no("GitHub repo oluştur (gh CLI gerekli)?", default_yes=False)
            if gh:
                v_idx = choose("Visibility:", ["private", "public"])
                visibility = ["private", "public"][v_idx]

        print("\n" + "=" * 60)
        print(f"  Proje: {name}")
        print(f"  Yol:   {target}")
        print(f"  Stack: {stack}")
        print(f"  Intel: {'evet' if intel else 'hayır'}{' (' + wl + ')' if intel else ''}")
        print(f"  KB:    {'evet' if kb else 'hayır'}")
        print(f"  Git:   {'init' if gitinit else 'yok'}{', GitHub: ' + visibility if gh else ''}")
        print("=" * 60)
        if not yes_no("\nDevam?", default_yes=True):
            sys.exit("İptal.")

    if target.exists() and any(target.iterdir()):
        if args.yes:
            sys.exit(f"{target} dolu (--yes mode, üstüne yazma yok).")
        if not yes_no(f"\n{target} dolu. Üstüne yazılsın mı?", default_yes=False):
            sys.exit("İptal.")
    target.mkdir(parents=True, exist_ok=True)

    print(f"\n→ Kuruluyor: {target}\n")

    intel_block = INTEL_README_BLOCK if intel else ""
    stack_block = STACK_README_BLOCK.get(stack, "")
    setup_cmd = {
        "python": "python -m venv .venv && .venv/Scripts/activate && pip install -r requirements.txt",
        "node": "npm install",
        "web": "npm install && npm run dev",
        "none": "(no build step)",
    }[stack]

    vars_dict = {
        "PROJECT_NAME": name,
        "DESCRIPTION": "(proje açıklaması — sen doldur)",
        "SETUP_COMMANDS": setup_cmd,
        "INTEL_BLOCK": intel_block,
        "STACK_BLOCK": stack_block,
    }

    copy_template(target, vars_dict)
    copy_agent(target)

    if intel:
        copy_intel_scripts(target)
        write_watchlist(target, wl)

    if kb:
        write_kb_skeleton(target)

    if stack == "python":
        write_python_stack(target)
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


if __name__ == "__main__":
    main()

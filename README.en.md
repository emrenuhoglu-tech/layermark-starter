# layermark-starter

**1-minute setup template for Claude Code projects.** Distilled from Anthropic's agentic engineering principles — Pocock + AI Engineer Conf + Anthropic Engineering + Karpathy doctrine pre-shipped.

[![Use this template](https://img.shields.io/badge/Use%20this%20template-2ea44f?style=for-the-badge&logo=github)](https://github.com/emrenuhoglu-tech/layermark-starter/generate)
[![Live demo](https://img.shields.io/badge/Live%20demo-output%20repo-blue?style=for-the-badge&logo=github)](https://github.com/emrenuhoglu-tech/layermark-demo-ai-assistant)

> 🇹🇷 **Türkçe README:** see [README.md](README.md). The wizard inside Claude Code asks language at the start.

---

## 🧭 Why does this exist? — origin story

Everyone opening Claude Code for the first time falls into the same 3-day pit: empty `CLAUDE.md`, scattered context, "now what?", restart. This starter exists to skip that pit. Distilled from four primary sources:

- **Matt Pocock** (Sand Castle, AI Engineer 2026) — smart-zone (~100K), Memento pattern, inner-loop test, "fewer + better skills"
- **AI Engineer Conf 2026** — Sandipan's distributed-systems orchestrator pattern, Anthropic MCP guidance, Cursor "200 LoC skill replaced 12K LoC" lesson
- **Anthropic Engineering** (May 2026) — Claude Code auto-mode classifier, scaling Managed Agents (brain/hands/session decoupling), demystifying evals (multi-grader rubric), eval-awareness defense, Project Vend red-team primitive
- **Andrej Karpathy** — Software 3.0, Bitter Lesson, surgical changes, "don't bet against the model"

20 doctrine + 14 foundational skills + opinionated wizard → works out of the box.

---

## 📐 Before / After — empty repo vs. starter

**Empty `claude /init` output (without starter):**

```text
my-project/
├── CLAUDE.md          # 8 lines of generic boilerplate
└── (else nothing)
```

→ `CLAUDE.md` is Anthropic's default sycophant filler. No doctrine, no skills, no structure.

**`python setup_starter.py` output (AI Assistant kit, ~1 sec):**

```text
my-bot/
├── CLAUDE.md                   # 20 doctrine + 9-question wizard (TR/EN, fast mode 3-Q)
├── README.md                   # project skeleton
├── .gitignore + .env.example   # secret hygiene
├── requirements.txt
├── pyproject.toml
└── .claude/
    ├── agents/
    │   └── prompt-engineer.md  # BUILD + AUDIT + always-on security
    ├── hooks/
    │   ├── prompt-log.ps1      # Win UserPromptSubmit hook
    │   └── prompt-log.sh       # Mac/Linux version
    ├── settings.json.example
    └── skills/                 # 14 foundational skills
        ├── grill-me.md         # interview before non-trivial work
        ├── skill-creator.md    # ASSESS / ADVISE / CREATE
        ├── agent-creator.md    # 3-mode subagent creator
        ├── project-advisor.md  # monthly audit
        ├── yardim.md           # TR/EN troubleshooting
        ├── suspend.md          # Memento operationalized
        ├── resume.md           # companion to suspend
        ├── sync-drift.md       # multi-folder drift detection
        ├── ne-yapayim.md       # idle-prompt 4-option menu
        ├── spagetti-check.md   # code-smell tier-1
        ├── ubiquitous-language.md  # domain glossary
        ├── failing-test-as-prompt.md
        ├── agent-approval.md   # gate high-risk actions
        └── verify-agent-output.md  # independent verification
```

→ Each file passes the inner-loop test, real practical. **Not an empty repo — installed doctrine.**

---

## ⚖ Why this, instead of no-code?

| Thing | Bubble / Lovable / v0 / atoms.dev | layermark-starter |
|---|---|---|
| Speed (first MVP) | 5 min | 10 min |
| Backend / Python access | Limited | Full |
| Vendor lock-in | High | Zero (your own GitHub repo) |
| Monthly fee | $20-300 (atoms: $20-100, Bubble: $29+) | $0 (only Claude Code subscription) |
| AI agent / subagent control | None / black box | Full (your own `.claude/` folder) |
| Doctrine / opinionated structure | Generic templates | Pocock + AI Engineer + Anthropic Engineering distilled |
| Exit door | Limited export (atoms: GitHub sync) | `git clone` → everything is yours |
| Who pays for AI compute | They do (your credits run out) | You do (your Claude subscription) |

**Answer:** If you say *"just write me an app, I don't want to see code"* → atoms.dev / Lovable / Bubble are the right pick. If you want **control**, **AI agent visibility**, **no vendor lock-in**, **free** → this starter.

---

## 💼 Premium kits — coming soon (waitlist)

The core starter is **MIT open source forever**. On top of that, we're preparing curated kits for niche use ($29-49 one-time, lifetime updates):

- 🤖 AI Assistant — customer message replies, calendar, mail automation, chatbot
- 📊 Content Tracker — YouTube/X channels scan + transcript + auto-summary
- 📝 Blank Slate — full custom wizard, all doctrine docs included

Want one? Open a [GitHub Discussion](https://github.com/emrenuhoglu-tech/layermark-starter/discussions) with the kit name + your use case. ≥20 sign-ups per kit triggers priority build.

---

## 🚀 Quick start

```bash
# 1. Clone
git clone https://github.com/emrenuhoglu-tech/layermark-starter
cd layermark-starter

# 2. Run the bootstrap — picks your kit + project name
python setup_starter.py

# 3. Open Claude Code in the new project — wizard starts on first prompt
cd ../my-new-project
claude
```

Or paste a single prompt to Claude Code: see the [/start page](https://emrenuhoglu-tech.github.io/layermark-starter/start) on the site.

---

## 📚 Pre-shipped — what's in the box

### Doctrine (CLAUDE.md.tmpl)
20 doctrine — Pocock + AI Engineer + Anthropic Engineering distilled. Full catalog: [/docs/doctrines](https://emrenuhoglu-tech.github.io/layermark-starter/docs/doctrines/)
- **Core (1-7):** Grill before build, Smart zone, Memento, Surgical changes, Simplicity first, Verification, Minimum permissions
- **Skill + workflow (8-14):** Inner-loop test, Rules emerge, Never `/init`, Hooks > prompts, Concise + unresolved, Anti-hallucination ("use your search tool"), Bitter Lesson
- **Production agent (opt-in, 15-20):** Orchestrator-only multi-agent, Auto-mode classifier customization, Brain/hands/session decoupling, Multi-grader eval rubric, Eval-awareness defense, Red-team primitive

### Wizard (CLAUDE.md.tmpl, first session)
- **Phase 0** — Language (TR/EN)
- **Phase 0.1** — Mode (full 9-Q ~5 min, or fast 3-Q ~1 min)
- **Phase 0.5** — Single vs multi-agent (consultative — categorizes use case A/B/C, recommends single by default)
- **Phase 0.7** — Risk level (only if multi-agent OR autonomous action — local / mixed / production)
- **Phase 1-4** — Project description, success criteria, verification, structure

Every question has a **"Don't know?"** safety net. No jargon, opinionated defaults.

### Skills (14)
Categorized by usage — see [.claude/skills/README.md](template/.claude/skills/README.md) for the decision tree:
- **First 10 min:** grill-me, ne-yapayim
- **New feature:** grill-me → failing-test-as-prompt, ubiquitous-language
- **Risky action:** agent-approval → verify-agent-output
- **Stuck:** yardim → suspend → resume
- **Monthly cleanup:** project-advisor, spagetti-check, sync-drift
- **Skill / agent creation:** skill-creator, agent-creator

### Production doctrine docs (opt-in, blank kit only)
5 detail docs in `02-memory/doctrine/` — referenced from doctrine bullets 16-20:
- `auto-mode-classifier.md` — 3 customization slots
- `brain-hands-decoupling.md` — execute() interface registry
- `multi-grader-eval.md` — 3-grader rubric, eval-as-gate
- `eval-awareness.md` — canary, credential gate, network isolation
- `red-team-primitive.md` — 10-prompt checklist, continuous canary

These add cognitive overhead for single-shot projects → setup_starter.py only copies them for the **blank** kit. Run with `--kit=blank` to include.

---

## 🎯 Key concepts

| Term | Meaning |
|---|---|
| **Doctrine** | The set of rules for the project. Ours is distilled from Pocock + AI Engineer + Anthropic Engineering |
| **Skill** | A `.md` file Claude invokes for repeating workflow (slash command) |
| **Subagent** | Specialized agent invoked from main session (e.g., prompt-engineer) |
| **Inner-loop test** | Should a workflow become a skill? 2-3x/day + same pattern + preloaded context helps |
| **Memento** | Don't compact, use fresh window. Suspend → fresh session → resume |
| **Smart zone** | LLM degrades past ~100K tokens. Cut work to fit |
| **Bitter Lesson** | Don't bet against the model. Custom scaffold today = native feature in 6 months |

---

## License

MIT — see [LICENSE](LICENSE).

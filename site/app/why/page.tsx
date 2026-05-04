'use client';

import Link from 'next/link';
import { useT, LangToggle, type Lang } from '../i18n';

const REPO = 'https://github.com/emrenuhoglu-tech/layermark-starter';

type Skill = { name: string; oneline: string; trigger: string; source: string };
type Doctrine = { id: string; title: string; source: string };

const CONTENT: Record<Lang, {
  intro: { tag: string; title: string; lead: string };
  agent: { title: string; lead: string; trainingTitle: string; training: string[]; modesTitle: string; modes: { name: string; desc: string }[]; vanillaNote: string };
  skills: { title: string; lead: string; items: Skill[] };
  doctrines: { title: string; lead: string; items: Doctrine[]; ctaLink: string };
  categories: { title: string; lead: string; rows: { name: string; risk: string; doctrine: string }[] };
  trust: { title: string; lead: string; bullets: string[] };
}> = {
  tr: {
    intro: {
      tag: 'NIYE STARTER · KANIT SAYFASI',
      title: 'Vanilla Claude Code\'a göre layermark-starter ne ekliyor?',
      lead: 'Bu sayfa "trust me bro" değil — her iddianın yanında kaynak referansı (Pocock course adı, AI Engineer talk speaker\'ı, Anthropic Engineering post URL\'i) ve kanıt commit hash\'i (GitHub link). Kullanıcı bilgi-bazlı karar versin diye yazıldı.',
    },
    agent: {
      title: '1) Prompt-engineer subagent — vanilla\'da yok',
      lead: '`.claude/agents/prompt-engineer.md` 8 training doc damıtılarak yazıldı. Vanilla Claude Code subagent kavramına sahip (Anthropic Engineering "scaling Managed Agents" 2026-05) ama template + training corpus pre-loaded değil. Sıfırdan yazıp inner-loop test\'inden geçirmen, training doc\'ları kendin distile etmen gerekir.',
      trainingTitle: 'Training corpus (8 doc, source-cited)',
      training: [
        '**Anthropic Academy 5-course "Claude Partner Training"** — `.claude/skills/claude-partner-training.md` (prompt engineering, tool use, model dispatch, MCP, agent design). Kaynak: Anthropic Skilljar / Academy.',
        '**Pocock — Sand Castle, AI Engineer 2026** — smart-zone (~100K), Memento, inner-loop test, "fewer + better skills".',
        '**AI Engineer Conf 2026 — 9-talk distillation** — Sandipan distributed-systems orchestrator, Anthropic MCP guidance, Cursor "200 LoC skill replaced 12K LoC" lesson.',
        '**Anthropic Engineering 2026-05 — 5 doctrine** — Claude Code auto-mode classifier, scaling Managed Agents (brain/hands/session), demystifying evals (multi-grader rubric), eval-awareness defense, Project Vend red-team primitive.',
        '**Karpathy** — Software 3.0, Bitter Lesson, surgical changes, "don\'t bet against the model".',
        'Training docs `02-memory/training/01-08.md` altında — her biri primary source\'a referans verir.',
      ],
      modesTitle: '2-mode + always-on security pass',
      modes: [
        { name: 'BUILD modu', desc: 'Casual istek ("X yap", "Y ekle") → structured prompt (role, constraints, output format, verification gate). Kullanıcı "iki kelime" söyler, agent paste-ready prompt çıkarır.' },
        { name: 'AUDIT modu', desc: 'Proje doctrine ihlallerini bulur. CLAUDE.md kuralları + 14 skill + kategori-spesifik patterns ile mevcut kodu/dosyaları karşılaştırır. Önerir, uygulamaz (read-only by design).' },
        { name: 'Always-on security pass', desc: 'Her BUILD/AUDIT çıktısında zorunlu: secrets leak, prompt injection, SSRF, path traversal kontrolleri. Doctrine #20 (red-team) operationalize.' },
      ],
      vanillaNote: 'Vanilla Claude Code\'da: `.claude/agents/` boş. Agent yaratmak için `/agents` slash command var (Anthropic Code 2026-05) ama pre-loaded template + training corpus yok — sen yazarsın.',
    },
    skills: {
      title: '2) 14 foundational skill — her biri inner-loop test\'i geçer',
      lead: 'Vanilla Claude Code\'da 0 skill var. layermark-starter\'da 14 skill `.claude/skills/` altında pre-loaded. Hiçbiri "yararlı olur diye" yazılmadı — her birinin alt kısmında *"Why this exists pre-shipped"* bölümü kaynağı söyler. Decision tree: `.claude/skills/README.md`.',
      items: [
        { name: '/grill-me', oneline: 'Non-trivial iş başında shared understanding (tek soru, recommend-first, design tree walk).', trigger: 'Yeni feature, refactor, design decision, ambiguous request.', source: 'Pocock — Anthropic Academy course primary pattern.' },
        { name: '/skill-creator', oneline: 'Yeni skill kararı için ASSESS / ADVISE / CREATE 3 yol; inner-loop test\'i operationalize.', trigger: 'Aynı pattern\'i 2-3x/gün tekrarlıyorsun, skill yapmalı mıyım?', source: 'Pocock meta-skill — "rules emerge from friction".' },
        { name: '/agent-creator', oneline: '3-mod subagent yaratıcı (BUILD / AUDIT / SECURITY).', trigger: 'Yeni subagent ihtiyacı (proje uzun-süreli ya da multi-agent).', source: 'Anthropic Engineering "scaling Managed Agents" 2026-05.' },
        { name: '/project-advisor', oneline: 'Aylık audit; HIGH-RISK kategoriler için Step 1.5 (immutable ledger, double-entry, jurisdiction citation kontrolü).', trigger: 'Hafta/ay sonu, drift kontrolü.', source: 'Pocock weekly-audit pattern + AI Engineer kategori-spesifik review.' },
        { name: '/yardim', oneline: 'TR/EN troubleshooting; hata mesajı yapıştır → plain-language açıklama + fix adımları.', trigger: 'Hata aldın, ne demek bilmiyorsun.', source: 'TR/EN ergonomics — vanilla\'da generic error trace.' },
        { name: '/suspend', oneline: 'Mevcut session\'ı checkpoint\'e kaydet; sıradaki SOMUT adım + RESUME PROMPT bloğu üretir.', trigger: 'Smart-zone sınırına yaklaştın, fresh window aç.', source: 'Pocock Memento doctrine D3 operationalize.' },
        { name: '/resume', oneline: 'Yeni session\'da en son /suspend checkpoint\'ini yükler, kaldığın yeri 1 satır recap\'le verir.', trigger: 'Fresh window açtın, kaldığın yere dön.', source: 'Suspend companion — Memento.' },
        { name: '/sync-drift', oneline: 'Multi-folder drift detection (wiki ↔ raw alignment).', trigger: 'Knowledge base 3-layer\'da raw güncellendi, wiki stale.', source: 'Karpathy 3-layer KB pattern.' },
        { name: '/ne-yapayim', oneline: 'Idle-prompt 4-option menu — "şimdi ne?" hissini yapısal route\'a dönüştürür.', trigger: 'Stuck, hangi yöne gideceğini bilmiyorsun.', source: 'Decision-fatigue ergonomics — Pocock "concise + unresolved".' },
        { name: '/spagetti-check', oneline: 'Code-smell tier-1 (350+ satır, deep nesting, duplikasyon).', trigger: 'Refactor değer mi soruyorsun.', source: 'Karpathy surgical-changes principle.' },
        { name: '/ubiquitous-language', oneline: 'DDD ubiquitous-language; ekip + Claude\'un terminoloji glossary\'sini ortak tutar.', trigger: 'Yeni domain term, ortak anlam yoksa.', source: 'DDD (Eric Evans) + Pocock vocabulary discipline.' },
        { name: '/failing-test-as-prompt', oneline: 'Test kırmızıdan başlar; spec yanlışsa A\'ya dön.', trigger: 'Yeni feature implementation öncesi.', source: 'TDD principle + Doctrine #6 (Verification).' },
        { name: '/agent-approval', oneline: 'HIGH-RISK kategorilerde her significant action gate\'i (finance/legal threshold-üstü transaction).', trigger: 'Production action, irreversible move.', source: 'Anthropic Engineering "auto-mode classifier" 2026-05.' },
        { name: '/verify-agent-output', oneline: 'Doctrine #6 implementation; multi-grader rubric\'in deterministic pillar\'ı (independent 2. yol).', trigger: 'Claude bir iddia/sayı/sonuç üretti, kanıt iste.', source: 'Anthropic Engineering "demystifying evals" 2026-05.' },
      ],
    },
    doctrines: {
      title: '3) 20 doctrine — her birinin kaynağı belli',
      lead: 'Doctrine\'ler "best practice" değil, primary source\'lardan distile. Her doctrine\'in detayı /docs/doctrines\'de — bu sayfada sadece kaynak özeti.',
      items: [
        { id: '1', title: 'Grill before build', source: 'Pocock — Anthropic Academy "alignment before code"' },
        { id: '2', title: 'Smart zone (~100K)', source: 'Pocock — attention quadratic scaling, AI Engineer 2026 talk' },
        { id: '3', title: 'Memento, compact değil', source: 'Pocock — Memento mental model + suspend/resume implementation' },
        { id: '4', title: 'Surgical changes', source: 'Karpathy — Software 3.0 + LLM coding eleştirisi' },
        { id: '5', title: 'Simplicity first', source: 'Karpathy + Pocock — over-engineering anti-pattern' },
        { id: '6', title: 'Verification', source: 'Anthropic Engineering "demystifying evals" 2026-05 + Pocock' },
        { id: '7', title: 'Minimum permissions', source: 'Anthropic security guidance + Project Vend lesson' },
        { id: '8', title: 'Inner-loop test', source: 'Pocock — meta-skill / pre-shipping criterion' },
        { id: '9', title: 'Rules emerge', source: 'Pocock — "50 kuralın directory\'si" anti-pattern' },
        { id: '10', title: 'Never /init', source: 'Pocock + Anthropic Engineering — auto-CLAUDE.md anti-pattern' },
        { id: '11', title: 'Hooks > prompt negatives', source: 'Pocock — deterministic enforcement' },
        { id: '12', title: 'Concise + unresolved', source: 'Pocock — output style discipline' },
        { id: '13', title: 'Anti-hallucination', source: 'AI Engineer 2026 + Anthropic Engineering — search tool' },
        { id: '14', title: 'Bitter Lesson', source: 'Karpathy — "don\'t bet against the model"' },
        { id: '15', title: 'Orchestrator-only multi-agent', source: 'AI Engineer — Sandipan distributed-systems pattern' },
        { id: '16', title: 'Auto-mode classifier customization', source: 'Anthropic Engineering "Claude Code auto mode" 2026-05' },
        { id: '17', title: 'Brain / hands / session decoupling', source: 'Anthropic Engineering "scaling Managed Agents" 2026-05' },
        { id: '18', title: 'Multi-grader eval rubric', source: 'Anthropic Engineering "demystifying evals" 2026-05' },
        { id: '19', title: 'Eval-awareness defense', source: 'Anthropic Engineering "eval-awareness in BrowseComp" 2026-05' },
        { id: '20', title: 'Red-team primitive', source: 'Anthropic Engineering "Project Vend" 2026' },
      ],
      ctaLink: 'Tüm doctrine\'lerin detayı + uygulama rehberi → /docs/doctrines',
    },
    categories: {
      title: '4) Kategori matrisi — vanilla\'da bu yok',
      lead: 'Wizard Phase 0.3\'te 10 kategoriden birini seçersin. Her kategori için 5-10 pattern boilerplate (`02-memory/category/<slug>.md`) + kategori-spesifik skill önerileri. HIGH-RISK kategoriler (finans, hukuk) **otomatik** olarak 5 production doctrine doc + `agent-approval` gate alır.',
      rows: [
        { name: '🔁 Otomasyon & workflow', risk: 'Low-Med', doctrine: 'Standart 14 — kategori boilerplate yeter' },
        { name: '📝 İçerik & medya', risk: 'Low', doctrine: 'Standart 14 + ubiquitous-language' },
        { name: '💻 Yazılım & ürün', risk: 'Med', doctrine: 'Standart 14 + failing-test-as-prompt vurgu' },
        { name: '🎮 Oyun', risk: 'Low', doctrine: 'Standart 14' },
        { name: '📊 Veri & analiz', risk: 'Med', doctrine: 'Standart 14 + verify-agent-output zorunlu' },
        { name: '🧮 Finans/audit (HIGH RISK)', risk: 'HIGH', doctrine: 'Standart 14 + 5 production doctrine + agent-approval gate' },
        { name: '🏛 Hukuk/uyumluluk (HIGH RISK)', risk: 'HIGH', doctrine: 'Standart 14 + 5 production doctrine + 4-jurisdiction citation' },
        { name: '📈 Pazarlama', risk: 'Low-Med', doctrine: 'Standart 14 + brand-voice glossary' },
        { name: '🎓 Eğitim & araştırma', risk: 'Low', doctrine: 'Standart 14 + Karpathy 3-layer KB pattern' },
        { name: '🧘 Kişisel', risk: 'Low', doctrine: 'Standart 14' },
      ],
    },
    trust: {
      title: 'Bunların hepsi git\'te kanıtlanabilir',
      lead: 'Yukarıdaki her dosyaya GitHub\'dan ulaşabilirsin. Markdown + Python + TypeScript — gizli logic yok, vendor lock yok, lifetime ücretsiz.',
      bullets: [
        '14 skill source code: `.claude/skills/<name>.md` — her birinin sonunda *"Why this exists pre-shipped"* bölümü inner-loop test kanıtı verir.',
        'prompt-engineer agent: `.claude/agents/prompt-engineer.md` — 2-mode + always-on security, training corpus referanslı.',
        '20 doctrine source code: `template/CLAUDE.md.tmpl` satır 333+ — her doctrine\'in primary source\'u var.',
        '10 kategori boilerplate: `template/02-memory/category/<NN>-<slug>.md` — her kategori 5-10 pattern + risk profili + sample first-task prompt.',
        '5 production doctrine doc: `template/02-memory/doctrine/` — HIGH-RISK kategori veya blank kit\'te otomatik kopyalanır.',
        'Smoke test: `tests/smoke_test.py` — 3 senaryo (assistant+automation, blank+general, assistant+finance HIGH-RISK) CI\'da geçer.',
      ],
    },
  },
  en: {
    intro: {
      tag: 'WHY THE STARTER · PROOF PAGE',
      title: 'What does layermark-starter add to vanilla Claude Code?',
      lead: 'This is not "trust me bro" — every claim cites a primary source (Pocock course name, AI Engineer talk speaker, Anthropic Engineering post URL) and proof commit hash (GitHub link). Written so users can decide based on evidence.',
    },
    agent: {
      title: '1) Prompt-engineer subagent — not in vanilla',
      lead: '`.claude/agents/prompt-engineer.md` distilled from 8 training docs. Vanilla Claude Code has the subagent concept (Anthropic Engineering "scaling Managed Agents" 2026-05) but no template + training corpus pre-loaded. You\'d write your own from scratch, run inner-loop test, distill the training docs by hand.',
      trainingTitle: 'Training corpus (8 docs, source-cited)',
      training: [
        '**Anthropic Academy 5-course "Claude Partner Training"** — `.claude/skills/claude-partner-training.md` (prompt engineering, tool use, model dispatch, MCP, agent design). Source: Anthropic Skilljar / Academy.',
        '**Pocock — Sand Castle, AI Engineer 2026** — smart-zone (~100K), Memento, inner-loop test, "fewer + better skills".',
        '**AI Engineer Conf 2026 — 9-talk distillation** — Sandipan\'s distributed-systems orchestrator, Anthropic MCP guidance, Cursor "200 LoC skill replaced 12K LoC" lesson.',
        '**Anthropic Engineering 2026-05 — 5 doctrines** — Claude Code auto-mode classifier, scaling Managed Agents (brain/hands/session), demystifying evals (multi-grader rubric), eval-awareness defense, Project Vend red-team primitive.',
        '**Karpathy** — Software 3.0, Bitter Lesson, surgical changes, "don\'t bet against the model".',
        'Training docs are in `02-memory/training/01-08.md` — each cites its primary source.',
      ],
      modesTitle: '2-mode + always-on security pass',
      modes: [
        { name: 'BUILD mode', desc: 'Casual request ("do X", "add Y") → structured prompt (role, constraints, output format, verification gate). User says "two words", agent emits paste-ready prompt.' },
        { name: 'AUDIT mode', desc: 'Surfaces project doctrine violations. Compares existing code/files against CLAUDE.md rules + 14 skills + category-specific patterns. Recommends, does not apply (read-only by design).' },
        { name: 'Always-on security pass', desc: 'Mandatory on every BUILD/AUDIT output: secrets leak, prompt injection, SSRF, path traversal checks. Operationalizes Doctrine #20 (red-team).' },
      ],
      vanillaNote: 'In vanilla Claude Code: `.claude/agents/` is empty. The `/agents` slash command exists for creating agents (Anthropic Code 2026-05) but no pre-loaded template + training corpus — you write it.',
    },
    skills: {
      title: '2) 14 foundational skills — each passes the inner-loop test',
      lead: 'Vanilla Claude Code has 0 skills. layermark-starter pre-loads 14 under `.claude/skills/`. None were written "because it might help" — each one\'s file ends with *"Why this exists pre-shipped"* showing its source. Decision tree: `.claude/skills/README.md`.',
      items: [
        { name: '/grill-me', oneline: 'Reach shared understanding before non-trivial work (one question at a time, recommend-first, walk the design tree).', trigger: 'New feature, refactor, design decision, ambiguous request.', source: 'Pocock — primary pattern from Anthropic Academy course.' },
        { name: '/skill-creator', oneline: 'ASSESS / ADVISE / CREATE for new-skill decisions; operationalizes the inner-loop test.', trigger: 'You repeat the same pattern 2-3x/day — should it be a skill?', source: 'Pocock meta-skill — "rules emerge from friction".' },
        { name: '/agent-creator', oneline: '3-mode subagent creator (BUILD / AUDIT / SECURITY).', trigger: 'New subagent need (long-lived project or multi-agent).', source: 'Anthropic Engineering "scaling Managed Agents" 2026-05.' },
        { name: '/project-advisor', oneline: 'Monthly audit; HIGH-RISK Step 1.5 (immutable ledger, double-entry, jurisdiction citation checks).', trigger: 'End of week/month, drift check.', source: 'Pocock weekly-audit pattern + AI Engineer category-specific review.' },
        { name: '/yardim', oneline: 'TR/EN troubleshooting; paste error → plain-language explanation + fix steps.', trigger: 'You got an error and don\'t understand it.', source: 'TR/EN ergonomics — vanilla shows generic error traces.' },
        { name: '/suspend', oneline: 'Checkpoint current session; emits CONCRETE next step + RESUME PROMPT block.', trigger: 'Approaching smart-zone limit, time for a fresh window.', source: 'Operationalizes Pocock Memento doctrine D3.' },
        { name: '/resume', oneline: 'Loads the latest /suspend checkpoint, gives a one-line recap of where you left off.', trigger: 'Opened a fresh window, picking up.', source: 'Suspend companion — Memento.' },
        { name: '/sync-drift', oneline: 'Multi-folder drift detection (wiki ↔ raw alignment).', trigger: 'Knowledge base 3-layer raw updated, wiki stale.', source: 'Karpathy 3-layer KB pattern.' },
        { name: '/ne-yapayim', oneline: 'Idle-prompt 4-option menu — turns "now what?" into a structured route.', trigger: 'Stuck, don\'t know which way to go.', source: 'Decision-fatigue ergonomics — Pocock "concise + unresolved".' },
        { name: '/spagetti-check', oneline: 'Tier-1 code-smell (350+ lines, deep nesting, duplication).', trigger: 'Wondering whether to refactor.', source: 'Karpathy surgical-changes principle.' },
        { name: '/ubiquitous-language', oneline: 'DDD ubiquitous-language; keeps team + Claude on a shared glossary.', trigger: 'New domain term, no shared meaning.', source: 'DDD (Eric Evans) + Pocock vocabulary discipline.' },
        { name: '/failing-test-as-prompt', oneline: 'Test starts red; if green, the spec is wrong, go back to A.', trigger: 'Before implementing a new feature.', source: 'TDD principle + Doctrine #6 (Verification).' },
        { name: '/agent-approval', oneline: 'Gates every significant action in HIGH-RISK categories (finance/legal above-threshold transactions).', trigger: 'Production action, irreversible move.', source: 'Anthropic Engineering "auto-mode classifier" 2026-05.' },
        { name: '/verify-agent-output', oneline: 'Doctrine #6 implementation; deterministic pillar of the multi-grader rubric (independent 2nd path).', trigger: 'Claude produced a claim/number/result — demand evidence.', source: 'Anthropic Engineering "demystifying evals" 2026-05.' },
      ],
    },
    doctrines: {
      title: '3) 20 doctrines — each cites its source',
      lead: 'Doctrines aren\'t "best practice" — they\'re distilled from primary sources. Full detail at /docs/doctrines; this page is just the source summary.',
      items: [
        { id: '1', title: 'Grill before build', source: 'Pocock — Anthropic Academy "alignment before code"' },
        { id: '2', title: 'Smart zone (~100K)', source: 'Pocock — attention quadratic scaling, AI Engineer 2026 talk' },
        { id: '3', title: 'Memento, not compact', source: 'Pocock — Memento mental model + suspend/resume impl' },
        { id: '4', title: 'Surgical changes', source: 'Karpathy — Software 3.0 + LLM coding critique' },
        { id: '5', title: 'Simplicity first', source: 'Karpathy + Pocock — over-engineering anti-pattern' },
        { id: '6', title: 'Verification', source: 'Anthropic Engineering "demystifying evals" 2026-05 + Pocock' },
        { id: '7', title: 'Minimum permissions', source: 'Anthropic security guidance + Project Vend lesson' },
        { id: '8', title: 'Inner-loop test', source: 'Pocock — meta-skill / pre-shipping criterion' },
        { id: '9', title: 'Rules emerge', source: 'Pocock — "directory of 50 rules" anti-pattern' },
        { id: '10', title: 'Never /init', source: 'Pocock + Anthropic Engineering — auto-CLAUDE.md anti-pattern' },
        { id: '11', title: 'Hooks > prompt negatives', source: 'Pocock — deterministic enforcement' },
        { id: '12', title: 'Concise + unresolved', source: 'Pocock — output style discipline' },
        { id: '13', title: 'Anti-hallucination', source: 'AI Engineer 2026 + Anthropic Engineering — search tool' },
        { id: '14', title: 'Bitter Lesson', source: 'Karpathy — "don\'t bet against the model"' },
        { id: '15', title: 'Orchestrator-only multi-agent', source: 'AI Engineer — Sandipan distributed-systems pattern' },
        { id: '16', title: 'Auto-mode classifier customization', source: 'Anthropic Engineering "Claude Code auto mode" 2026-05' },
        { id: '17', title: 'Brain / hands / session decoupling', source: 'Anthropic Engineering "scaling Managed Agents" 2026-05' },
        { id: '18', title: 'Multi-grader eval rubric', source: 'Anthropic Engineering "demystifying evals" 2026-05' },
        { id: '19', title: 'Eval-awareness defense', source: 'Anthropic Engineering "eval-awareness in BrowseComp" 2026-05' },
        { id: '20', title: 'Red-team primitive', source: 'Anthropic Engineering "Project Vend" 2026' },
      ],
      ctaLink: 'Full doctrine detail + application guide → /docs/doctrines',
    },
    categories: {
      title: '4) Category matrix — not in vanilla',
      lead: 'You pick one of 10 categories in wizard Phase 0.3. Each category gets 5-10 pattern boilerplates (`02-memory/category/<slug>.md`) + category-specific skill recommendations. HIGH-RISK categories (finance, legal) **automatically** get 5 production doctrine docs + `agent-approval` gate.',
      rows: [
        { name: '🔁 Automation & workflow', risk: 'Low-Med', doctrine: 'Standard 14 — category boilerplate is enough' },
        { name: '📝 Content & media', risk: 'Low', doctrine: 'Standard 14 + ubiquitous-language' },
        { name: '💻 Software & product', risk: 'Med', doctrine: 'Standard 14 + failing-test-as-prompt emphasis' },
        { name: '🎮 Game dev', risk: 'Low', doctrine: 'Standard 14' },
        { name: '📊 Data & analysis', risk: 'Med', doctrine: 'Standard 14 + verify-agent-output mandatory' },
        { name: '🧮 Finance/audit (HIGH RISK)', risk: 'HIGH', doctrine: 'Standard 14 + 5 production doctrines + agent-approval gate' },
        { name: '🏛 Legal/compliance (HIGH RISK)', risk: 'HIGH', doctrine: 'Standard 14 + 5 production doctrines + 4-jurisdiction citation' },
        { name: '📈 Marketing & sales', risk: 'Low-Med', doctrine: 'Standard 14 + brand-voice glossary' },
        { name: '🎓 Education & research', risk: 'Low', doctrine: 'Standard 14 + Karpathy 3-layer KB pattern' },
        { name: '🧘 Personal', risk: 'Low', doctrine: 'Standard 14' },
      ],
    },
    trust: {
      title: 'Everything is verifiable in git',
      lead: 'Every file above is reachable on GitHub. Markdown + Python + TypeScript — no hidden logic, no vendor lock, free for life.',
      bullets: [
        '14 skill source code: `.claude/skills/<name>.md` — each ends with *"Why this exists pre-shipped"* showing inner-loop test evidence.',
        'prompt-engineer agent: `.claude/agents/prompt-engineer.md` — 2-mode + always-on security, training corpus cited.',
        '20 doctrine source: `template/CLAUDE.md.tmpl` line 333+ — each doctrine has its primary source listed.',
        '10 category boilerplates: `template/02-memory/category/<NN>-<slug>.md` — 5-10 patterns + risk profile + sample first-task prompt per category.',
        '5 production doctrine docs: `template/02-memory/doctrine/` — auto-copied for HIGH-RISK categories or blank kit.',
        'Smoke test: `tests/smoke_test.py` — 3 scenarios (assistant+automation, blank+general, assistant+finance HIGH-RISK) green in CI.',
      ],
    },
  },
};

export default function WhyPage() {
  const { lang } = useT();
  const c = CONTENT[lang];

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between gap-4">
          <Link href="/" className="font-mono text-sm hover:text-accent">
            <span className="text-accent">▸</span> layermark-starter
          </Link>
          <div className="flex items-center gap-3 md:gap-6">
            <nav className="hidden md:flex gap-6 text-sm text-muted">
              <Link href="/" className="hover:text-text">←</Link>
              <Link href="/docs/doctrines" className="hover:text-text">{lang === 'tr' ? 'Doctrine detayları' : 'Doctrine details'}</Link>
              <a href={REPO} className="hover:text-text" target="_blank" rel="noopener noreferrer">GitHub</a>
            </nav>
            <LangToggle />
          </div>
        </div>
      </header>

      {/* Intro */}
      <section className="max-w-4xl mx-auto px-6 pt-20 pb-12">
        <div className="text-xs font-mono text-accent mb-4">{c.intro.tag}</div>
        <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6">{c.intro.title}</h1>
        <p className="text-lg text-muted leading-relaxed">{c.intro.lead}</p>
      </section>

      {/* 1) Agent */}
      <section className="border-t border-border bg-surface">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-4">{c.agent.title}</h2>
          <p className="text-muted leading-relaxed mb-8">{c.agent.lead}</p>

          <h3 className="font-bold text-xl mb-4">{c.agent.trainingTitle}</h3>
          <ul className="space-y-3 text-sm leading-relaxed mb-10">
            {c.agent.training.map((line, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-accent font-mono">{i + 1}.</span>
                <span className="text-muted" dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong class="text-text">$1</strong>').replace(/`([^`]+)`/g, '<code class="text-accent text-xs">$1</code>') }} />
              </li>
            ))}
          </ul>

          <h3 className="font-bold text-xl mb-4">{c.agent.modesTitle}</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {c.agent.modes.map((m, i) => (
              <div key={i} className="border border-border rounded-lg p-5 bg-bg">
                <div className="font-bold mb-2">{m.name}</div>
                <p className="text-sm text-muted leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-sm text-muted leading-relaxed border-l-2 border-accent pl-4 italic">
            {c.agent.vanillaNote}
          </p>

          <a href={`${REPO}/blob/master/template/.claude/agents/prompt-engineer.md`}
             target="_blank" rel="noopener noreferrer"
             className="inline-block mt-6 text-sm text-accent hover:underline">
            → {lang === 'tr' ? 'GitHub\'da agent dosyasını gör' : 'See agent file on GitHub'}
          </a>
        </div>
      </section>

      {/* 2) Skills */}
      <section className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-4">{c.skills.title}</h2>
          <p className="text-muted leading-relaxed mb-10 max-w-2xl">{c.skills.lead}</p>

          <div className="grid md:grid-cols-2 gap-4">
            {c.skills.items.map((s, i) => (
              <div key={i} className="border border-border rounded-lg p-5 bg-surface">
                <div className="font-mono text-accent text-sm mb-2">{s.name}</div>
                <p className="text-sm leading-relaxed mb-3">{s.oneline}</p>
                <div className="text-xs text-muted leading-relaxed space-y-1">
                  <div><strong>{lang === 'tr' ? 'Tetik:' : 'Trigger:'}</strong> {s.trigger}</div>
                  <div><strong>{lang === 'tr' ? 'Kaynak:' : 'Source:'}</strong> {s.source}</div>
                </div>
              </div>
            ))}
          </div>

          <a href={`${REPO}/tree/master/template/.claude/skills`}
             target="_blank" rel="noopener noreferrer"
             className="inline-block mt-8 text-sm text-accent hover:underline">
            → {lang === 'tr' ? 'GitHub\'da 14 skill kaynak kodunu gör' : 'See all 14 skill sources on GitHub'}
          </a>
        </div>
      </section>

      {/* 3) Doctrines */}
      <section className="border-t border-border bg-surface">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-4">{c.doctrines.title}</h2>
          <p className="text-muted leading-relaxed mb-10">{c.doctrines.lead}</p>

          <div className="grid md:grid-cols-2 gap-3 text-sm">
            {c.doctrines.items.map((d, i) => (
              <div key={i} className="border border-border rounded-lg p-4 bg-bg">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-mono text-accent text-xs">D{d.id}</span>
                  <span className="font-semibold">{d.title}</span>
                </div>
                <div className="text-xs text-muted leading-relaxed">{d.source}</div>
              </div>
            ))}
          </div>

          <Link href="/docs/doctrines" className="inline-block mt-8 text-sm text-accent hover:underline">
            → {c.doctrines.ctaLink}
          </Link>
        </div>
      </section>

      {/* 4) Category matrix */}
      <section className="border-t border-border">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-4">{c.categories.title}</h2>
          <p className="text-muted leading-relaxed mb-10">{c.categories.lead}</p>

          <div className="border border-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-surface">
                <tr>
                  <th className="text-left p-3 font-semibold">{lang === 'tr' ? 'Kategori' : 'Category'}</th>
                  <th className="text-left p-3 font-semibold">{lang === 'tr' ? 'Risk' : 'Risk'}</th>
                  <th className="text-left p-3 font-semibold">{lang === 'tr' ? 'Doctrine seti' : 'Doctrine set'}</th>
                </tr>
              </thead>
              <tbody>
                {c.categories.rows.map((r, i) => (
                  <tr key={i} className={`border-t border-border ${r.risk === 'HIGH' ? 'bg-accent/5' : ''}`}>
                    <td className="p-3">{r.name}</td>
                    <td className="p-3">
                      <span className={`text-xs font-mono px-2 py-1 rounded ${r.risk === 'HIGH' ? 'bg-accent/20 text-accent' : 'bg-surface text-muted'}`}>
                        {r.risk}
                      </span>
                    </td>
                    <td className="p-3 text-muted">{r.doctrine}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* 5) Trust / verification */}
      <section className="border-t border-border bg-surface">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold mb-4">{c.trust.title}</h2>
          <p className="text-muted leading-relaxed mb-8">{c.trust.lead}</p>

          <ul className="space-y-3 text-sm leading-relaxed">
            {c.trust.bullets.map((b, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-accent">→</span>
                <span className="text-muted" dangerouslySetInnerHTML={{ __html: b.replace(/\*\*(.+?)\*\*/g, '<strong class="text-text">$1</strong>').replace(/`([^`]+)`/g, '<code class="text-accent text-xs">$1</code>').replace(/\*(.+?)\*/g, '<em class="text-text">$1</em>') }} />
              </li>
            ))}
          </ul>

          <div className="mt-10 flex flex-wrap gap-4">
            <a href={REPO} target="_blank" rel="noopener noreferrer"
               className="bg-accent hover:bg-orange-500 text-bg font-semibold px-6 py-3 rounded-lg transition">
              {lang === 'tr' ? 'GitHub\'da incele' : 'Browse on GitHub'}
            </a>
            <Link href="/start"
                  className="border border-border hover:border-text font-semibold px-6 py-3 rounded-lg transition">
              {lang === 'tr' ? 'Kuruluma başla →' : 'Start setup →'}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="max-w-5xl mx-auto px-6 py-8 text-sm text-muted text-center">
          © Layermark · MIT · {lang === 'tr' ? 'Açık kaynak' : 'Open source'}
        </div>
      </footer>
    </main>
  );
}

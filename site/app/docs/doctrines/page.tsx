'use client';

import Link from 'next/link';
import { useT, LangToggle, type Lang } from '../../i18n';

type Doctrine = {
  id: string;
  title: string;
  summary: string;
  why: string;
  apply: string;
  source?: string;
};

const DOCTRINES: Record<Lang, { intro: string; sections: { heading: string; items: Doctrine[] }[] }> = {
  tr: {
    intro:
      "19 doctrine kuralı — Pocock + AI Engineer + Anthropic Engineering primary source'larından distile. Hepsi inner-loop test'i geçer (2-3x/gün + aynı pattern + preloaded context yardım eder). Her biri opt-in: senin proje pattern'ine uymuyorsa skip et veya `_archive/`'a taşı.",
    sections: [
      {
        heading: 'Çekirdek (her proje)',
        items: [
          {
            id: 'grill-before-build',
            title: '1. Grill before build',
            summary: 'Non-trivial iş başında shared understanding kur, sonra implement et.',
            why: 'Plan-mode yetmez — Claude da sen de aynı kafada olmalısın. Pocock\'un "grill the user" pattern\'i: önce sorularla problemi netleştir, sonra çöz.',
            apply: '`.claude/skills/grill-me.md` çağır. Ajan 5-10 soru sorar, sen cevaplarsın, sonunda spec/plan çıkar. Plan-mode bunun yanında, alternatifi değil.',
            source: 'Matt Pocock 2026',
          },
          {
            id: 'smart-zone',
            title: '2. Smart zone (~100K)',
            summary: 'LLM 100K token sonrası dumb zone\'a düşer (declared context window ne olursa olsun).',
            why: 'Attention quadratic scaling. 200K, 1M context\'lerde de gerçek smart-zone ~100K. Sonrası yumuşak bozulma.',
            apply: 'İşi smart zone\'a sığacak boyutta kes. `/suspend` ile checkpoint, fresh window\'da `/resume`. Tek session\'da 100K\'yı geçeceksen split at.',
          },
          {
            id: 'memento',
            title: '3. Memento, compact değil',
            summary: 'Compact yerine fresh window. Repeated compact = sediment.',
            why: 'Compact context\'i sıkıştırır ama eski/stale bilgi birikir. Fresh window aynı problemi temiz görür. "Memento" film — bellek silinir, problem yeniden kavranır.',
            apply: 'Stuck\'ken yeni session aç, problemi tek paragrafta sıfırdan tarif et. Implementation: `/suspend` (checkpoint yaz) → next session `/resume` (kaldığın yeri kavra).',
          },
          {
            id: 'surgical-changes',
            title: '4. Surgical changes',
            summary: 'Sadece istenen satırı değiştir. Adjacent kodu refactor etme.',
            why: 'LLM "iyileştirme" güdüsüyle scope dışı değişiklik yapar. Bu code review zorlaştırır, breaking change riski getirir. Karpathy: "every changed line should trace directly to the request."',
            apply: 'Mevcut stile uy (kendi tercihin farklıysa bile). Kırılmamış şeyi düzeltme. Alakasız dead code fark edersen — bahset, silme.',
          },
          {
            id: 'simplicity-first',
            title: '5. Simplicity first',
            summary: 'En kısa kod. Speculative abstraction yok.',
            why: 'LLM\'ler "future flexibility" için generic interfaces yazar. Çoğu zaman gerek olmaz, sadece okuma yükü ekler.',
            apply: '200 satır 50\'ye iniyorsa baştan yaz. Test: senior engineer "overcomplicated" der mi?',
          },
          {
            id: 'verification',
            title: '6. Verification',
            summary: 'Her non-trivial iş "nasıl doğrularız?" ile bitsin.',
            why: 'Feedback loop olmadan output güvenilmez. LLM "tamamlandı" der ama gerçekte test edilmemiştir.',
            apply: 'Verification artifact: test çıktısı, screenshot, log. UI feature için: dev server + browser test. Type check + test suite **kod doğruluğu** verifies, **feature doğruluğu** değil.',
          },
          {
            id: 'minimum-permissions',
            title: '7. Minimum permissions',
            summary: 'Tool/file/key erişimi gerektiği kadar.',
            why: 'Erişim verirsen kullanılır. Geniş scope = blast radius geniş. Auto-mode\'da bu özellikle kritik.',
            apply: '.claude/settings.json permission rules. Default deny. Yeni kategori → açık onay. Hook ile pre-tool-use enforcement (CLAUDE.md\'deki probabilistic kuraldan farklı).',
          },
        ],
      },
      {
        heading: 'Skill + workflow',
        items: [
          {
            id: 'inner-loop-test',
            title: '8. Inner-loop test',
            summary: 'Skill yapma kararı için: 2-3x/gün + aynı pattern + preloaded context yardım eder mi?',
            why: 'Premature skill yazımı pre-load anti-pattern\'i ("50 kuralın directory\'si"). Çoğu workflow tek-kullanım — skill yapılmamalı.',
            apply: 'Yeni skill önerisi geldiğinde test et. 3 kriter geçerse `.claude/skills/` altına ekle. Geçmezse not al, gerçek kullanımı bekle.',
          },
          {
            id: 'rules-emerge',
            title: '9. Rules emerge',
            summary: 'Pre-load "kural directory\'si" anti-pattern. Ajan off-rails giderse kural yaz.',
            why: 'Spekülasyonla yazılan kurallar hiç tetiklenmez ama context yer. Gerçek failure görünce kuralın değeri ortaya çıkar.',
            apply: 'Ajan yanlış yapınca: CLAUDE.md, hook, lint, ya da reviewer-agent ekle. Aynı kural inner-loop test\'i geçmezse ekleme.',
          },
          {
            id: 'never-init',
            title: '10. Never /init',
            summary: '`claude /init` çalıştırma; auto-generated CLAUDE.md sil.',
            why: '`/init` package.json\'dan keşfedilebilir şeyleri CLAUDE.md\'ye yazar — gereksiz instruction budget yer. Pocock: instruction budget ~300-500 token, tiny tut.',
            apply: 'CLAUDE.md tiny kalsın (env + output style). Auto-generated içerik gördüysen sil. Repository-spesifik invariant\'ları yaz, derivable şeyleri yazma.',
          },
          {
            id: 'hooks-vs-prompts',
            title: '11. Hooks > prompt negatives',
            summary: '"Use X not Y" / "never run npm" gibi deterministic kurallar hook olsun, CLAUDE.md\'de değil.',
            why: 'CLAUDE.md\'deki "never X" probabilistic — bazen tutmaz. Hook deterministic — tetiklenir veya tetiklenmez. Prompt budget yakmaz, gerçekten enforce eder.',
            apply: 'Pre-tool-use hook + exit 2. Örnek: `[[ "$TOOL_NAME" == "Bash" && "$TOOL_INPUT" =~ npm ]] && { echo "use pnpm"; exit 2; }`. Hooks **enforced**, prompts **probabilistic**.',
          },
          {
            id: 'concise-output',
            title: '12. Concise + unresolved',
            summary: 'Output stili: extremely concise, gramer feda et.',
            why: 'Markdown formatting + uzun açıklama context yer. Kısa, açık, bullet-friendly tercih.',
            apply: 'Her plan sonunda "unresolved questions" listele (varsa). Bilinmeyen yokmuş gibi davranma — flag et.',
          },
          {
            id: 'anti-hallucination',
            title: '13. Anti-hallucination prompt',
            summary: 'Extrinsic bilgi gerektiren işte prompt\'a "use your search tool" + "load existing implementations" ekle.',
            why: 'LLM training cutoff sonrası API/library değişiklikleri hallucinate edilir. Tool call zorla, training\'e güvenme.',
            apply: 'Prompt\'a: "Look at existing implementations of X, load them into context before writing new code." Code mevcutsa onu okumaya zorla.',
          },
          {
            id: 'bitter-lesson',
            title: '14. Bitter Lesson',
            summary: 'Modele karşı bahis yapma. 6 ay sonra senin custom scaffold model\'in feature\'ı olmuş olur.',
            why: 'Sutton\'ın "bitter lesson"\'ı: scale + general method > clever hand-built. LLM ekosistem aynı hızda — bugün custom yazdığın çoğu şey 6 ay sonra native feature.',
            apply: 'Custom orchestration / prompt-rewriting / agent framework yazmadan önce dur — model frontier\'ı kapatacak mı? Şüpheliyse minimal scaffold yaz, vendor-lock\'tan kaçın.',
          },
        ],
      },
      {
        heading: 'Production agent (opt-in, multi-step / tool-using)',
        items: [
          {
            id: 'orchestrator-only',
            title: '15. Orchestrator-only multi-agent',
            summary: 'Multi-agent setup\'ta orchestrator owns mutable state. Ajanlar paylaşılan state\'e never write.',
            why: 'Distributed-systems doctrine — race conditions, byzantine failures, eventual consistency. 30 yıl kanıtlanmış pattern\'ler multi-agent için **şart**.',
            apply: '6 zorunlu pattern: orchestrator-only writes, immutable+versioned events, data contracts at handoff, circuit breaker per agent, saga execute()/compensate(), summarized payloads. Detay: `02-memory/orchestrator-safety.md`.',
            source: 'AI Engineer Conf 2026 (Sandipan Roy)',
          },
          {
            id: 'auto-mode-classifier',
            title: '16. Auto-mode classifier customization',
            summary: 'Production agent için Anthropic\'in 2-katmanlı savunması (input probe + output classifier) domain-spesifik tuning ister.',
            why: 'Generic 17% FNR (false-negative) overeager actions için OK olabilir; finansal/sağlık/güvenlik domain\'inde olmaz. Block list (yasaklar), allow exceptions (override\'lar), trust boundary (input vs output direction).',
            apply: '`02-memory/doctrine/auto-mode-classifier.md` — 3 customization slot. Pre-tool-use hook ile ek katman olarak. Domain-spesifik block keyword\'leri + endpoint allow-list.',
            source: 'Anthropic Engineering "Claude Code auto mode" 2026-05',
          },
          {
            id: 'decoupling',
            title: '17. Brain / hands / session decoupling',
            summary: 'Tool execution `execute(name, input) → result` interface arkasında. Brain tool modüllerini direkt import etmez.',
            why: 'Hot-swap mümkün (harness restart yok), single audit point, multi-provider abstraction. 3 katman karıştırılırsa agent ölçeklenmez.',
            apply: '`packages/tools/execute.py` registry pattern. `@register_tool("name")` decorator. Stub mode + production mode env-driven. Detay: `02-memory/doctrine/brain-hands-decoupling.md`.',
            source: 'Anthropic Engineering "Scaling Managed Agents" 2026-05',
          },
          {
            id: 'multi-grader-eval',
            title: '18. Multi-grader eval rubric',
            summary: '3 kanal: outcome (deterministic 50%) + transcript (model-based 30%) + human (calibration 20%).',
            why: 'Tek-skor eval ("test passed") gerçek kaliteyi yansıtmaz. Coding agent doğru kararı verdi mi? Policy uydu mu? Eval harness\'ı tanıyıp gaming yapmadı mı?',
            apply: 'Eval-as-gate (CI exit code 1 → merge block). Rubric prompt cache\'lenmeli. Human spot-check haftada 5-10 case. Detay: `02-memory/doctrine/multi-grader-eval.md`.',
            source: 'Anthropic Engineering "Demystifying evals" 2026-05 + Eugene Yan',
          },
          {
            id: 'eval-awareness',
            title: '19. Eval-awareness defense',
            summary: 'Frontier modeller benchmark\'ı tanıyıp exploit edebiliyor (Opus 4.6 BrowseComp\'u XOR decryption ile çözdü).',
            why: 'Eval harness recognition production riskleri yaratır: agent benchmark\'ta iyi çıkar, gerçekte değil. Trigger: aşırı specificity + failed search + benchmark keyword\'leri.',
            apply: 'Canary string contamination check + credential gate (eval datasets `.secrets/`) + network isolation eval sırasında + benchmark keyword block list. Detay: `02-memory/doctrine/eval-awareness.md`.',
            source: 'Anthropic Engineering "Eval awareness in BrowseComp" 2026-05',
          },
          {
            id: 'red-team-primitive',
            title: '20. Red-team primitive',
            summary: '10-prompt pre-deploy checklist + continuous canary. Production multi-agent için **şart**.',
            why: 'Project Vend (Anthropic 2026) — Claude\'a virtual shop yönetme görevi verildi, müşteriler discount scam + identity hallucination + policy override yaptı. Bir compromised agent sistemin tamamını drainleyebilir.',
            apply: 'Pre-deploy gate (10/10 reject zorunlu). Continuous canary (orchestrator periyodik fake-malicious payload). P-008 quarantine playbook compromise tespit edilince. Detay: `02-memory/doctrine/red-team-primitive.md`.',
            source: 'Anthropic Project Vend (2026)',
          },
        ],
      },
    ],
  },
  en: {
    intro:
      "19 doctrine rules — distilled from primary sources (Pocock + AI Engineer + Anthropic Engineering). All pass the inner-loop test (2-3x/day + same pattern + preloaded context helps). Each is opt-in: skip or move to `_archive/` if it doesn't fit your project pattern.",
    sections: [
      {
        heading: 'Core (every project)',
        items: [
          {
            id: 'grill-before-build',
            title: '1. Grill before build',
            summary: 'Build shared understanding before non-trivial work, then implement.',
            why: "Plan-mode isn't enough — both you and Claude need to be aligned. Pocock's pattern: clarify the problem with questions, then solve.",
            apply: 'Invoke `.claude/skills/grill-me.md`. Agent asks 5-10 questions, you answer, spec/plan emerges. Plan-mode is alongside, not alternative.',
            source: 'Matt Pocock 2026',
          },
          {
            id: 'smart-zone',
            title: '2. Smart zone (~100K)',
            summary: "LLMs degrade past 100K tokens regardless of declared context window.",
            why: "Attention scales quadratically. Even 200K, 1M context windows have effective smart-zone ~100K. Beyond that: soft degradation.",
            apply: 'Cut work to fit smart zone. `/suspend` to checkpoint, `/resume` in fresh window. Split when single session would exceed 100K.',
          },
          {
            id: 'memento',
            title: '3. Memento, not compact',
            summary: 'Fresh window > compact. Repeated compact = sediment.',
            why: "Compact compresses context but stale info accumulates. Fresh window sees the same problem cleanly. Like the Memento film — memory wipes, problem re-grokked.",
            apply: 'When stuck: open new session, describe the problem from scratch in one paragraph. Implementation: `/suspend` (write checkpoint) → next session `/resume` (read checkpoint, grok where you left off).',
          },
          {
            id: 'surgical-changes',
            title: '4. Surgical changes',
            summary: 'Change only the requested line. Don\'t refactor adjacent code.',
            why: "LLMs urge to 'improve' beyond scope. This complicates code review, risks breaking changes. Karpathy: 'every changed line should trace directly to the request.'",
            apply: 'Match existing style (even if you\'d do it differently). Don\'t fix what isn\'t broken. Notice unrelated dead code? Mention, don\'t delete.',
          },
          {
            id: 'simplicity-first',
            title: '5. Simplicity first',
            summary: 'Shortest code. No speculative abstraction.',
            why: 'LLMs write generic interfaces for "future flexibility." Most of the time unnecessary, just adds reading load.',
            apply: 'If 200 lines could be 50, rewrite. Test: would a senior engineer call this overcomplicated?',
          },
          {
            id: 'verification',
            title: '6. Verification',
            summary: 'Every non-trivial task ends with "how do we verify?"',
            why: "Without feedback loop, output isn't trustworthy. LLM says 'done' but reality may not match.",
            apply: 'Verification artifact: test output, screenshot, log. UI feature: dev server + browser test. Type check + test suite verifies **code correctness**, not **feature correctness**.',
          },
          {
            id: 'minimum-permissions',
            title: '7. Minimum permissions',
            summary: 'Tool/file/key access only as needed.',
            why: 'Access granted will be used. Wide scope = wide blast radius. Especially critical in auto-mode.',
            apply: '.claude/settings.json permission rules. Default deny. New category → explicit approval. Pre-tool-use hook for enforcement (different from probabilistic CLAUDE.md rules).',
          },
        ],
      },
      {
        heading: 'Skill + workflow',
        items: [
          {
            id: 'inner-loop-test',
            title: '8. Inner-loop test',
            summary: 'Skill decision criteria: does 2-3x/day + same pattern + preloaded context help?',
            why: "Premature skill creation = pre-load anti-pattern ('directory of 50 rules'). Most workflows are one-off — shouldn't be skills.",
            apply: 'When new skill suggested, apply test. Pass 3 criteria → add to `.claude/skills/`. Fail → note, wait for real usage.',
          },
          {
            id: 'rules-emerge',
            title: '9. Rules emerge',
            summary: "Pre-loading 'rule directory' is anti-pattern. Write a rule when agent goes off-rails.",
            why: "Speculative rules never trigger but consume context. Real failure surfaces a rule's value.",
            apply: 'Agent does wrong: add CLAUDE.md, hook, lint, or reviewer-agent. Same inner-loop test applies — fail → don\'t add.',
          },
          {
            id: 'never-init',
            title: '10. Never /init',
            summary: "Don't run `claude /init`; delete auto-generated CLAUDE.md.",
            why: "/init writes things derivable from package.json into CLAUDE.md — wastes instruction budget. Pocock: keep instruction budget ~300-500 tokens, tiny.",
            apply: 'CLAUDE.md stays tiny (env + output style). Saw auto-generated content? Delete. Write repository-specific invariants, not derivable things.',
          },
          {
            id: 'hooks-vs-prompts',
            title: '11. Hooks > prompt negatives',
            summary: "'Use X not Y' / 'never run npm' style deterministic rules → hook, not CLAUDE.md.",
            why: "CLAUDE.md 'never X' is probabilistic — sometimes ignored. Hook is deterministic — fires or doesn't. No prompt budget burn, real enforcement.",
            apply: 'Pre-tool-use hook + exit 2. Example: `[[ "$TOOL_NAME" == "Bash" && "$TOOL_INPUT" =~ npm ]] && { echo "use pnpm"; exit 2; }`. Hooks **enforced**, prompts **probabilistic**.',
          },
          {
            id: 'concise-output',
            title: '12. Concise + unresolved',
            summary: 'Output style: extremely concise, sacrifice grammar.',
            why: 'Markdown formatting + long explanation consumes context. Prefer short, clear, bullet-friendly.',
            apply: 'List "unresolved questions" at end of every plan (when present). Don\'t pretend nothing is unknown — flag it.',
          },
          {
            id: 'anti-hallucination',
            title: '13. Anti-hallucination prompt',
            summary: 'For tasks needing extrinsic info, add "use your search tool" + "load existing implementations".',
            why: "Post-training-cutoff API/library changes get hallucinated. Force tool call, don't trust training.",
            apply: 'Prompt: "Look at existing implementations of X, load them into context before writing new code." Force reading existing code if available.',
          },
          {
            id: 'bitter-lesson',
            title: '14. Bitter Lesson',
            summary: "Don't bet against the model. In 6 months your custom scaffold becomes the model's feature.",
            why: "Sutton's bitter lesson: scale + general method > clever hand-built. LLM ecosystem moves at the same pace — most custom code today is native in 6 months.",
            apply: "Before writing custom orchestration / prompt-rewriting / agent framework, pause: will the model frontier close this? If unsure, minimal scaffold, avoid vendor-lock.",
          },
        ],
      },
      {
        heading: 'Production agent (opt-in, multi-step / tool-using)',
        items: [
          {
            id: 'orchestrator-only',
            title: '15. Orchestrator-only multi-agent',
            summary: 'In multi-agent setup, orchestrator owns mutable state. Agents never write to shared state.',
            why: '30-year-proven distributed-systems doctrine — race conditions, byzantine failures, eventual consistency. **Required**, not optional, for multi-agent.',
            apply: '6 mandatory patterns: orchestrator-only writes, immutable+versioned events, data contracts at handoff, circuit breaker per agent, saga execute()/compensate(), summarized payloads. Detail: `02-memory/orchestrator-safety.md`.',
            source: 'AI Engineer Conf 2026 (Sandipan Roy)',
          },
          {
            id: 'auto-mode-classifier',
            title: '16. Auto-mode classifier customization',
            summary: "Anthropic's 2-layer auto-mode defense (input probe + output classifier) needs domain-specific tuning for production.",
            why: "Generic 17% FNR (false-negative) for overeager actions is OK for some agents, not for finance/health/security. Block list (forbidden), allow exceptions (overrides), trust boundary (input vs output direction).",
            apply: '`02-memory/doctrine/auto-mode-classifier.md` — 3 customization slots. Pre-tool-use hook as additional layer. Domain-specific block keywords + endpoint allow-list.',
            source: 'Anthropic Engineering "Claude Code auto mode" 2026-05',
          },
          {
            id: 'decoupling',
            title: '17. Brain / hands / session decoupling',
            summary: 'Tool execution behind `execute(name, input) → result` interface. Brain never imports tool modules.',
            why: 'Hot-swap possible (no harness restart), single audit point, multi-provider abstraction. Mixing the 3 layers prevents agent scaling.',
            apply: '`packages/tools/execute.py` registry pattern. `@register_tool("name")` decorator. Stub mode + production mode env-driven. Detail: `02-memory/doctrine/brain-hands-decoupling.md`.',
            source: 'Anthropic Engineering "Scaling Managed Agents" 2026-05',
          },
          {
            id: 'multi-grader-eval',
            title: '18. Multi-grader eval rubric',
            summary: '3 channels: outcome (deterministic 50%) + transcript (model-based 30%) + human (calibration 20%).',
            why: "Single-score eval ('test passed') doesn't reflect real quality. Did the coding agent make the right decision? Follow policy? Avoid eval-harness gaming?",
            apply: 'Eval-as-gate (CI exit 1 → merge block). Rubric prompt must be cached. Human spot-check 5-10 cases/week. Detail: `02-memory/doctrine/multi-grader-eval.md`.',
            source: 'Anthropic Engineering "Demystifying evals" 2026-05 + Eugene Yan',
          },
          {
            id: 'eval-awareness',
            title: '19. Eval-awareness defense',
            summary: 'Frontier models can recognize benchmarks and exploit them (Opus 4.6 solved BrowseComp via XOR decryption).',
            why: 'Eval harness recognition creates production risk: agent looks good on benchmark, not in reality. Trigger: extreme specificity + failed search + benchmark keywords.',
            apply: 'Canary string contamination check + credential gate (eval datasets in `.secrets/`) + network isolation during eval + benchmark keyword block list. Detail: `02-memory/doctrine/eval-awareness.md`.',
            source: 'Anthropic Engineering "Eval awareness in BrowseComp" 2026-05',
          },
          {
            id: 'red-team-primitive',
            title: '20. Red-team primitive',
            summary: '10-prompt pre-deploy checklist + continuous canary. **Required** for production multi-agent.',
            why: "Project Vend (Anthropic 2026) — Claude given task of running virtual shop, customers ran discount scams + identity hallucination + policy override. One compromised agent can drain the whole system.",
            apply: 'Pre-deploy gate (10/10 reject required). Continuous canary (orchestrator periodically injects fake-malicious payload). P-008 quarantine playbook on compromise detection. Detail: `02-memory/doctrine/red-team-primitive.md`.',
            source: 'Anthropic Project Vend (2026)',
          },
        ],
      },
    ],
  },
};

export default function DoctrinesPage() {
  const { lang } = useT();
  const data = DOCTRINES[lang];

  return (
    <main className="min-h-screen bg-bg text-text">
      <header className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="text-muted hover:text-text text-sm">
            ← {lang === 'tr' ? 'Ana sayfa' : 'Home'}
          </Link>
          <LangToggle />
        </div>
      </header>

      <article className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          {lang === 'tr' ? '20 Doctrine' : '20 Doctrines'}
        </h1>
        <p className="text-muted text-lg mb-12 leading-relaxed">{data.intro}</p>

        {data.sections.map((section) => (
          <section key={section.heading} className="mb-16">
            <h2 className="text-2xl font-semibold mb-8 pb-2 border-b border-border">
              {section.heading}
            </h2>
            <div className="space-y-10">
              {section.items.map((d) => (
                <div key={d.id} id={d.id} className="scroll-mt-20">
                  <h3 className="text-xl font-semibold mb-2">
                    <a href={`#${d.id}`} className="hover:text-accent">
                      {d.title}
                    </a>
                  </h3>
                  <p className="text-text mb-3 leading-relaxed">{d.summary}</p>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-accent font-semibold">{lang === 'tr' ? 'Niye' : 'Why'}:</span>{' '}
                      <span className="text-muted">{d.why}</span>
                    </div>
                    <div>
                      <span className="text-accent font-semibold">{lang === 'tr' ? 'Nasıl uygula' : 'How to apply'}:</span>{' '}
                      <span className="text-muted">{d.apply}</span>
                    </div>
                    {d.source && (
                      <div>
                        <span className="text-accent font-semibold">{lang === 'tr' ? 'Kaynak' : 'Source'}:</span>{' '}
                        <span className="text-muted italic">{d.source}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        <footer className="mt-16 pt-8 border-t border-border text-sm text-muted">
          <p className="mb-2">
            {lang === 'tr'
              ? 'Bu doktrinler `template/CLAUDE.md.tmpl` ve `template/02-memory/` altında — yeni proje açtığında hepsi yüklü gelir.'
              : "These doctrines live in `template/CLAUDE.md.tmpl` and `template/02-memory/` — pre-loaded when you scaffold a new project."}
          </p>
          <p>
            {lang === 'tr' ? 'Son güncelleme:' : 'Last updated:'} 2026-05-04
          </p>
        </footer>
      </article>
    </main>
  );
}

# Doctrine index

Bu klasör, layermark template'inin "always-on" doctrine'larını tutar. Her doctrine = bir spesifik kaynaktan (Anthropic Engineering, Project Vend, AI Engineer Conf, vendor incident) damıtılmış **uygulanabilir** kural seti.

Doctrine'lar `CLAUDE.md` üzerinden transitively yüklenir. Yeni doctrine eklerken bu tabloyu güncelle ve `CLAUDE.md.tmpl` içinden referans ver.

## Index

| # | Doctrine | Scope | Kaynak |
|---|---|---|---|
| D1 | [auto-mode-classifier](auto-mode-classifier.md) | Production agent — permission gate skip eden | Anthropic "Claude Code auto mode" (2026-05) |
| D2 | [brain-hands-decoupling](brain-hands-decoupling.md) | Tool-using production agent | Anthropic "Scaling Managed Agents" (2026-05) |
| D3 | [build-failure-prevention](build-failure-prevention.md) | Build/deploy pipeline olan tüm projeler | layermark internal (deploy-site.yml retro) |
| D4 | [devops-patterns](devops-patterns.md) | CI/CD + agent etkileşimi | layermark internal + community |
| D5 | [eval-awareness](eval-awareness.md) | Eval suite çalıştıran agent | Anthropic "Opus 4.6 BrowseComp" (2026-05) |
| D6 | [multi-grader-eval](multi-grader-eval.md) | Outcome-tracked production agent | Anthropic "Demystifying Evals" (2026-05) |
| D7 | [red-team-primitive](red-team-primitive.md) | Side-effect alan otonom agent | Anthropic Project Vend (2026) |
| D8 | [pre-trust-config](pre-trust-config.md) | Hook/sandbox/classifier config — trust gate'i öncesi çalışan | Anthropic "Containment" (2026-06-01) |
| D9 | [sub-agent-trust-escalation](sub-agent-trust-escalation.md) | Parent + sub-agent structured output kullanan harness | Anthropic "Containment" (2026-06-01) |
| D10 | [memory-poisoning-vector](memory-poisoning-vector.md) | `CLAUDE.md` / `02-memory/` / `.claude/*` reload eden tüm projeler | Anthropic "Containment" (2026-06-01) |

## Security pack (D8 + D9 + D10)

Anthropic 2026-06-01 "Containment" yazısından damıtılmış 3 doctrine birlikte uygulanır:

- **D8 (pre-trust-config)** — execution-gap kapatır: hook'lar trust marker olmadan çalışmaz
- **D9 (sub-agent-trust-escalation)** — laundering vector'ünü kapatır: sub-agent free-text untrusted
- **D10 (memory-poisoning-vector)** — persistence vector'ünü kapatır: memory file'lar review + scan + hash

Üçü beraber: **input** (D9), **persistence** (D10), **execution** (D8) — defense in depth. Birini atlamak diğerlerinin etkisini düşürür.

Scanner script: [`../../scripts/check-memory-poisoning.py`](../../scripts/check-memory-poisoning.py)

## Yeni doctrine eklerken

1. Bu klasöre `<short-slug>.md` koy
2. Üst başlık + 2-3 satır one-liner + kaynak citation şart
3. "Niye gerek?" + en az 1 implementation snippet + "Ne zaman silebilirsin?" bölümleri
4. Bu tabloyu güncelle (yeni satır)
5. `template/CLAUDE.md.tmpl` içinden transitively load edildiğinden emin ol
6. `template/scripts/check-memory-poisoning.py --target template/02-memory/doctrine/<new>.md` ile sanity scan

Tek-shot prototype için doctrine'ı `_archive/` altına taşımak meşrudur — her doctrine "ne zaman silebilirsin" bölümünde N/A kriterini tanımlıyor.

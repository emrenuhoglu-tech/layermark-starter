# Kategori: Yazılım & ürün geliştirme

## Tipik kullanım
SaaS MVP, web/mobile app, kütüphane, internal dev tool, API service.

## Risk profili
**Medium.** Code'un kendisi geri-alınabilir (revert), ama deploy edilen feature gerçek kullanıcıları etkiler. Production gate'leri sıkı tut.

## Doctrine emphasis
1. **Surgical changes (D4)** — sadece istenen satır, adjacent refactor yok
2. **Simplicity first (D5)** — speculative abstraction yok; 200 satır 50'ye iniyorsa yaz baştan
3. **Verification (D6)** — her non-trivial commit için: how do we verify? (test, screenshot, demo)
4. **Inner-loop test (D8)** — yeni skill önerirken agresif "yapma" eşiği
5. **Bitter Lesson (D14)** — custom orchestration yazma; modeli geçecek 6 ay sonra
6. **Hooks > prompts (D11)** — *"asla force push to main"* gibi kurallar pre-commit hook
7. **Multi-grader eval rubric (D18)** — production agent feature'larda eval-as-gate

## 8 spesifik pattern

### 1. Failing-test-as-prompt
Yeni feature için: önce test (`failing-test-as-prompt` skill), sonra implementation. Test = success spec.

### 2. Surgical PR'lar
1 PR = 1 amaç. Refactor + feature aynı PR'a gitmez. Review hızı + revert kolaylığı için.

### 3. Anti-spaghetti
File 350+ satıra çıkıyorsa `spagetti-check` skill çağır. Deep nesting (>4), duplication, dead code flag'lenir, fix prompt verir.

### 4. Anti-hallucination — kütüphane API kullanımı
*"X kütüphanesinde Y fonksiyonu var mı?"* gibi sorularda **search tool zorunlu** + mevcut implementations'ı load et. Hallucinated import = compile error en az; production crash en kötü.

### 5. Domain glossary (`ubiquitous-language`)
`02-memory/glossary.md` — `User`, `Customer`, `Account` gibi terimleri kim ne demek? Naming drift = bug factory.

### 6. Eval-as-gate (production feature için)
Multi-grader rubric (D18): outcome (deterministic test) + transcript (rubric model) + human spot-check. CI exit code 1 → merge block.

### 7. Architecture decision records (ADR)
`02-memory/adr/<NNNN>-<slug>.md` — neden bu kararı aldık (1-2 paragraf, sonradan zihin tazeleme). `decisions-log.md`'a entegre.

### 8. Migration path her breaking change için
"Old → new" schema değişiklikleri için: backward-compat layer + deprecation notice + sunset date.

## Önerilen skill'ler
- `grill-me` — yeni feature spec öncesi
- `failing-test-as-prompt` — test-first
- `ubiquitous-language` — domain glossary
- `spagetti-check` — code-smell tier-1
- `verify-agent-output` — agent claim doğrulama
- `project-advisor` — aylık architecture audit

## Sample first-task prompt
> *"İlk feature: user signup flow (email + password + verification email). Önce `failing-test-as-prompt` ile test yaz, sonra implement. PR'da: test + implementation tek commit, refactor yok. Migration var mı? Schema diff göster."*

## Anti-patterns
- ❌ "Önce mimariyi kuralım, feature sonra" — premature abstraction
- ❌ "Hızlı çalışan" code → unmaintainable. Surgical + simple > clever
- ❌ Test sonradan yazılır — agent hallucinated implementation'ı pass edemez

## Bu kategori için zorunlu doctrine docs
- `02-memory/doctrine/multi-grader-eval.md` — production feature için
- `02-memory/doctrine/brain-hands-decoupling.md` — tool-using agent yazıyorsan

---
name: failing-test-as-prompt
description: Use when user wants to enforce coding rules without burning CLAUDE.md instruction budget. Tests/lints become just-in-time prompts to the agent. Distilled from Ryan Carniato's harness-engineering pattern.
---

Sen test ve lint çıktılarını **agent'a JIT context injection** olarak kullanırsın. CLAUDE.md'de "asla şunu yapma" yazmak yerine, test yaz — fail mesajı agent'a ne yapması gerektiğini söyler.

# Ne zaman çalış

- User bir kuralı zorlamak istediğinde ("dosyalarım 350 satırı geçmesin", "nesting 4'ten fazla olmasın")
- CLAUDE.md doctrine kalabalıklaşmaya başladığında
- Bir kural %100 deterministik enforce edilmeli (probabilistic değil)

# Process

## 1 — Kuralı analiz et

Kural enforce edilebilir mi (test yazılabilir) yoksa subjective mi?

| Enforceable (test yaz) | Subjective (doctrine'de kalsın) |
|---|---|
| File size > 350 lines | "Kod okunabilir olsun" |
| Nesting depth > 4 | "Surgical changes" |
| Hardcoded API key | "İyi naming" |
| Missing type hints | "Pocock disiplinine uy" |

Test yazılabiliyorsa ➞ aşağıdaki adımlar. Subjective ise CLAUDE.md'de bırak.

## 2 — Test ya da lint script yaz

Pattern:

```python
# scripts/lint_file_size.py
import sys
from pathlib import Path

MAX_LINES = 350
violations = []

for py in Path("src").rglob("*.py"):
    n = sum(1 for _ in py.open(encoding="utf-8"))
    if n > MAX_LINES:
        violations.append(f"{py}: {n} lines (cap: {MAX_LINES})")

if violations:
    print("FAIL — files exceeding line cap. Split or refactor:")
    for v in violations:
        print(f"  - {v}")
    print("\nSuggested fix: extract sub-modules. Each file should do ONE thing.")
    sys.exit(1)

print("OK")
```

**Kritik:** Failure mesajı **bir prompt** olmalı — *ne yapılacağını söyle*, sadece "X failed" deme.

## 3 — Hook'a bağla (opsiyonel)

`.claude/hooks/post-edit.sh`:

```bash
#!/bin/bash
python scripts/lint_file_size.py || exit 2  # exit 2 = block
```

`settings.json`:

```json
{
  "hooks": {
    "post-edit": ["scripts/post-edit.sh"]
  }
}
```

Edit sonrası hook çalışır, fail çıktısı agent'a otomatik gelir, agent fix etmek zorunda.

## 4 — CI'ye bağla (production)

```yaml
# .github/workflows/lint.yml
- name: File size cap
  run: python scripts/lint_file_size.py
```

PR'lar fail olursa agent (veya human) fix etmeden merge olamaz.

# Örnekler

| Kural | Test |
|---|---|
| Hardcoded selector yok | `grep -r 'find_element' src/ && exit 1` |
| Async-only | `grep -nE 'def [a-z]' src/  # def yerine async def lazım` |
| .env not committed | `git ls-files \| grep -E '^\.env$' && exit 1` |
| All tests in test/ folder | `find . -name 'test_*.py' -not -path './test/*' && exit 1` |
| TODO comment yok | `grep -rn 'TODO' src/ && exit 1` |

# Hard rules

- **Failure mesajı = prompt.** "FAIL" yetmez. *"Suggested fix: X"* yaz.
- **Test'ler hızlı olmalı** — <2 saniye. Yavaşsa post-edit hook'tan çıkar, sadece CI'ye koy.
- **Kural deterministik değilse test yazma** — subjective kural CLAUDE.md'de kalır.

# Anti-patterns

- ❌ Aynı kural hem CLAUDE.md hem test'te (DRY violation, biri aynı şeyi söylüyor)
- ❌ Test çıktısı sadece error code (-1 vs 1) — agent ne yapacağını anlamaz
- ❌ Hook'u her dosya değişiminde tetikleme — sadece edit/write hook'larında

# Inner-loop kanıt

- Günde 5-10x edit → her edit hook'u tetikler → kural enforce edilir
- Aynı pattern: edit → fail → fix → pass
- Preloaded context: failure mesajı doğrudan agent prompt'una giriyor (system-prompt budget yanmıyor)

# spagetti-check.md ile fark

- `spagetti-check.md` **detection** — file size, nesting, dead code rapor verir, manuel skill çağırınca çalışır
- `failing-test-as-prompt.md` **enforcement** — hook'a bağlanır, otomatik tetiklenir, agent fix etmeden devam edemez

İkisi tamamlayıcı. Detection için `/spagetti-check`, enforcement için bu skill.

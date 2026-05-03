---
name: spagetti-check
description: Use when user asks "spagetti var mı?", "kod kalitesi nasıl?", "refactor lazım mı?", or after a feature merge to flag code-smell early. Tier-1 sanity check (file size, nesting, duplication, dead code) — NOT a full review, just surface tension. Output: prioritized findings + 1-line fix prompts. No edits.
---

Sen junior-pair-programmer'sın — kodu okur, "burada spagetti birikiyor" diye uyarır, çözmez. **Reasoning gerekiyor**, hook'la replace edilemez.

# Ne zaman çağırılır

- Feature merge sonrası ("yeni endpoint ekledim, kod sağlam mı?")
- "Refactor lazım mı?" şüphesi
- 2 hafta+ aktif gelişim sonra hijyen check
- `project-advisor` çağrıldığında automatic sub-step olarak

**Çağırma:**
- Yeni proje, 100 satır altı codebase (pattern oturmadan code-smell mantıksız)
- Aktif feature ortasında (focus break)

# Process

## Step 1 — Inventory

```bash
# Major source files (Python/Node/TS — bu skill stack-agnostic değil, adapt et)
find . -path './node_modules' -prune -o -path './.venv' -prune -o \
  \( -name '*.py' -o -name '*.ts' -o -name '*.tsx' -o -name '*.js' \) \
  -type f -print 2>/dev/null
```

## Step 2 — 4 boyutta tara

### A. File size — soft cap 350 satır
- Pocock: "kodun bu boyutta tutulsun ki context'ten taşmasın"
- 350+ ise FLAG, 500+ ise BLOCKER
- Hesap: `wc -l` her file için, sıralı liste

### B. Deep nesting — 4+ seviye iç içe block
- Python `def` içinde `if` içinde `for` içinde `if` içinde `try` = 4 seviye
- Grep yaklaşımı: `grep -E "^( {16}|\t{4})" file.py` (4 indent gözle)
- 4+ derinlik = MAJOR (bilişsel yük yüksek)

### C. Duplication signal
- Aynı 5+ satırlık blok 3+ yerde tekrar ediyor mu?
- `grep` yerine basit yaklaşım: file başlıkları (function names) listele, isim benzerliği ara
- Daha doğrusu: kullanıcıya sor *"X ve Y functions benzer iş yapıyor gibi geldi, ortak helper'a çıkarılabilir mi?"*

### D. Dead code signal
- Imports kullanılmıyor (`import X` ama `X` ref edilmiyor)
- Functions çağrılmıyor (find-references mental check)
- Comments TODO/FIXME 3+ ay önceki

## Step 3 — Output

Dikkat: **edit yapma**, sadece raporla.

```markdown
## Spagetti check — <date>

### Sağlam (sürdür)
- ✓ <ne iyi gidiyor — concrete>

### Yüksek öncelik
- **[BLOCKER] <file>:<line> — <issue>** (file size 547, soft cap 350)
  Fix prompt: "<file>'ı 2-3 modüle ayır, X concern'i Y file'a, Z'yi keep here. <one-paragraph plan>"
- **[MAJOR] <file>:<line> — deep nesting (5 levels)**
  Fix prompt: "<function>'da nesting'i flatten et: early-return + helper extract"

### Orta öncelik
- **[MINOR] <file> — TODO from 4 ay önce: 'fix later'**
  Fix prompt: "TODO'yu çöz ya da issue'ya taşı, kod içinde stale comment kalmasın"

### Sileyim diyebileceğin
- Unused imports: <file>:<line>
- Dead function: <file>:<line> (no callers found)

### Yapma henüz
- Soft refactor önerileri (file 280 satır, soft cap 350) — şimdilik OK, 350'ye yaklaşırsa dön
```

## Step 4 — Confirm + close

Kullanıcıya: **"Hangi BLOCKER/MAJOR'i şimdi çözelim? Numara/dosya söyle, fix prompt'u BUILD-mode'a hand-off ederim."**

Onay sonrası prompt-engineer'a delegete et veya kullanıcı direct çözer.

# Hard rules

- **Edit yapma.** Sadece flag + fix prompt. Edit ayrı bir BUILD-mode invocation.
- **Concrete kanıt zorunlu.** "Maybe spaghetti" YOK. "X.py:120 fonksiyon 80 satır" GERÇEK.
- **Cap findings at 12.** Fazlaysa top 12 by severity, "+<N> more, scope this skill'i specific dir'a daralt" notu.
- **Stack-aware ol.** Python heuristic'leri Node'da yanlış olabilir. Bilmediğin stack'te SOR: *"Bu stack için spaghetti pattern'leri farklı, X mı kontrol etmeliyim?"*
- **Soft cap (350) hard cap değil.** Bazı dosyalar haklı uzun (config, schema). Refactor önermeden önce **rationale** sor.

# Anti-patterns

- ❌ Generic best-practices listesi (proje-spesifik kanıt yok)
- ❌ "Looks great!" pat-on-back (advisor'ın görevi tension surface)
- ❌ Fix yaparak refactor başlat (Surgical Changes ihlali)
- ❌ Bütün codebase'i tek seferde iddialı tara (cap + scope shrink)
- ❌ Pocock'un 350-line rule'unu literal kanun olarak uygula (bağlama göre değer)

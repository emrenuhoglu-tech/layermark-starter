---
name: sync-drift
description: Use periodically (haftalık önerilir) on multi-topic (b) or multi-workstream (c) projects. Detects drift between actual folder reality and README/CLAUDE.md descriptions — surfaces MISSING entries (folder exists but not documented), STALE entries (documented but folder gone), inconsistent naming. Outputs reconcile suggestions; user picks which to apply. Hook'la yapılamaz çünkü LLM reasoning gerekiyor.
---

Multi-topic projelerde dokümantasyon ve gerçeklik birbirinden ayrılır — yeni klasör eklenir README'ye yazılmaz, eski iş silinir CLAUDE.md güncellenmez. Bu skill drift'i tespit eder.

# When to invoke

- Hafta sonu / sprint sonu audit
- Yeni feature merge sonrası "doküman güncel mi" şüphesi
- "Kafam karıştı, neyin ne olduğunu unuttum" hissi

**Ne zaman ÇAĞIRMA:**
- (a) tek-iş projelerde anlamsız (zaten tek folder)
- Henüz 5'ten az numbered klasör varsa over-audit
- Aktif iş ortasında (drift kabul edilebilir, sprint sonunda toparlama daha verimli)

# Process

## Step 1 — Inventory

```bash
# Numbered klasörleri listele (10s, 20s, 30s, vs.)
find . -maxdepth 2 -type d -name "[0-9][0-9]-*" 2>/dev/null | sort

# README ve CLAUDE.md'de bahsedilen klasörler
grep -hE "[0-9][0-9]-[a-z-]+/" README.md CLAUDE.md 2>/dev/null | sort -u
```

İki listeyi compare:
- **Actual'da var, doc'ta yok** → MISSING
- **Doc'ta var, actual'da yok** → STALE
- **Naming inconsistent** (örn: README'de `30-customer-x` ama folder `30-cust-x`) → MISMATCH

## Step 2 — _INDEX.md var mı kontrol

`02-memory/_INDEX.md` veya proje root'unda `_FOLDER-GUIDE.md` varsa onu da audit'e dahil et.

## Step 3 — Rapor formatla

```markdown
## Drift Audit — <date>

### Klasör inventory: <N> numbered folders found
<one-line summary>

### MISSING — folder var, doc yok
- `30-customer-y/` — README'de bahis yok. Eklemeli: <neresine, ne yazmalı önerisi>
- ...

### STALE — doc var, folder yok
- `40-old-project/` — README'de var ama klasör silinmiş. Önerin: README'den remove + `99-archive/` referansı varsa orada mı?
- ...

### MISMATCH — isim tutarsızlığı
- README: `30-cust-x` | folder: `30-customer-x`. Hangisi doğru?

### Önerilen action'lar (öncelikli)
1. <eylem> — effort: <S/M/L>
2. ...
```

## Step 4 — Interactive reconcile

**Edit yapma — sadece öner.** Kullanıcıya sor: *"Hangi action'ları uygulayım? 1, 2, 3 numara ya da 'all' / 'none' yaz."*

Onay sonrası Edit yap. Yapılan her değişikliği TASK END'de "Memory updated: [file1, file2]" formatında raporla.

# Hard rules

- **Hook'la replace edilemez.** Drift detect = pattern reasoning + context judgment. Bu skill LLM gerektiriyor, deterministic değil.
- **Bilgisayar bilgisi yok varsay.** Naming önerisi verirken Türkçe slug uygula (`satış` → `38-satis/` ASCII), `Subject:` field'ında orijinal Türkçe.
- **(a) projelerde no-op.** Tek folder = drift impossible.
- **Otomatik silme yok.** STALE entry'i README'den çıkarmadan önce kullanıcıya doğrula — belki klasör başka yere taşındı, kayıp değil.

# Anti-patterns

- ❌ Tüm drift'i tek seferde fix et (kullanıcı kontrolü kaybeder)
- ❌ Documentation stale ama folder doğru → folder'ı sil (asla — code/data > doc)
- ❌ Hiç audit raporu vermeden direkt Edit
- ❌ Naming conflict'te otomatik birini seç (kullanıcı kararı)

# Frequency

- Haftalık önerilir (b)/(c) projelerde
- (a)'da hiç çağırma
- 6 numbered folder'ın altındaysan over-audit, 10+ varsa kritik

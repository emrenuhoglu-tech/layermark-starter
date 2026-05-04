# Kategori: Finans & muhasebe & audit

> **🚨 HIGH RISK kategorisi.** Bu doc seçildiyse setup_starter.py otomatik şu doctrine docs'larını kopyalar:
> - `02-memory/doctrine/auto-mode-classifier.md` (zorunlu, agent action gate)
> - `02-memory/doctrine/red-team-primitive.md` (zorunlu, scam/social-engineering savunma)
> - `02-memory/doctrine/multi-grader-eval.md` (zorunlu, sayısal doğruluk için)
>
> `agent-approval` skill'i her finansal action'da otomatik tetiklenir. Phase 0.7 risk = (3) production default.

## Tipik kullanım
Bookkeeping, P&L, expense tracking, vergi hesaplama, fatura takibi, denetim/audit, bütçe analizi, regülasyon raporu, financial planning.

## Risk profili
**HIGH.** Finansal hata:
- Geri alınamaz para kaybı
- Vergi cezası (yanlış declaration)
- Audit failure (regülasyon ihlali)
- Hukuki sorumluluk (sahte rapor)
- Müşteri/yatırımcı güveni

Kategori 1-5'in *Medium-Low* doctrine'i yetmez. Defense-in-depth zorunlu.

## Doctrine emphasis (kategori 1-5'ten ÖTE)
1. **Auto-mode classifier customization (D16)** — block list: "withdraw", "transfer", "delete_record", "reverse_entry". Allow exceptions credentialed action only.
2. **Red-team primitive (D20)** — 10-prompt pre-deploy test: discount scam, identity hallucination, fake bonus, policy override. Continuous canary.
3. **Multi-grader eval (D18)** — outcome (totals deterministic), transcript (rubric: did agent cite source? respect double-entry?), human (weekly spot-check).
4. **Eval-awareness defense (D19)** — public benchmark'lardan agent gaming sinyali yakala.
5. **Brain/hands decoupling (D17)** — finansal API tools ayrı interface arkasında, hot-swap için.
6. **Verification (D6)** — her sayı için 2 path: agent claim + bağımsız re-calc.

## 10 spesifik pattern (HIGH RISK)

### 1. Immutable audit log (zorunlu)
Her finansal event append-only log'a yazılır. Edit yok, sadece reverse entry. `data/ledger/<period>.jsonl` — hash chain (her satır önceki satırın hash'ini içerir, tampering tespit).

### 2. Double-entry verification
Her transaction iki kayıtla: debit + credit. Toplam her zaman 0. Agent ürettiği her transaction için bu invariant'i otomatik test eder.

```python
def verify_balanced(entries: list[Entry]) -> bool:
    return sum(e.debit - e.credit for e in entries) == 0
```

### 3. Period close immutability
Kapanan dönem (örn. ay sonu) **immutable**. Agent retroaktif değişiklik yapamaz; correction yeni dönemde reverse entry olur.

### 4. Reconciliation discipline
Banka hesabı + kitabınız haftalık reconcile. Mismatch = kritik alarm, fix öncesi yeni transaction yok.

### 5. Source-of-truth + provenance
Her sayı için kaynak: bank statement PDF, fatura, order confirmation. `data/sources/<id>/<doc>.pdf` immutable.

### 6. Currency precision
Float kullanma — `Decimal` veya integer cents. Float rounding error finansal data'da unacceptable.

### 7. Tax + jurisdiction awareness
Vergi kuralları lokasyon ve dönem-spesifik. Agent kuralı varsayar değil, **resmi kaynaktan çek** (search tool zorunlu) + cite.

### 8. Approval gate her significant action için
Agent threshold (örn: $100+) üzerinde transaction'a otomatik `agent-approval` skill'ini çağırır. User onayı yoksa hold.

### 9. Compliance trail
Regülasyon rapor (KVKK, SOX, GDPR) için audit trail format: kim, ne, ne zaman, niye. Default değil, aktif gereksinim.

### 10. Sanity check rules
*"Bu hesap >$10K ödeme içeriyor"* veya *"Aylık expense %30 arttı"* gibi outlier rules. Agent flag eder, otomatik geçmez.

## Önerilen skill'ler (categorical bundle)
- `agent-approval` — **zorunlu**, her finansal action gate
- `verify-agent-output` — **zorunlu**, sayıları bağımsız doğrula
- `grill-me` — yeni rapor / analiz spec öncesi (kim okuyacak, regülasyon var mı)
- `failing-test-as-prompt` — finansal pipeline için test = invariant ("toplam = 0", "hiç negatif balance")
- `project-advisor` — aylık audit
- `ubiquitous-language` — accounting terms (revenue vs MRR vs ARR)

## Sample first-task prompt
> *"İlk feature: aylık P&L raporu. Önce double-entry invariant test'i yaz (`failing-test-as-prompt`). Sonra raw data → `data/ledger/2026-05.jsonl` (immutable, hash-chained). Rapor query'si pure SQL. Her sayı için source link footnote. Agent çıktısı user-approval gate'inden geçmeden gönderilmez."*

## Anti-patterns (HIGH RISK)
- ❌ "Hızlıca tahmin et" — finansal sayıda tahmin yok
- ❌ Float arithmetic — Decimal/integer cents zorunlu
- ❌ Inline edit (kapanan dönem) — reverse entry only
- ❌ "Agent ödeme tetiklesin" — APPROVAL gate olmadan asla
- ❌ Generic rate / vergi oranı — spesifik jurisdiction + kaynak link

## Compliance checklist (yapacaksan oku)
- [ ] KVKK (Türkiye) / GDPR (EU) — kişisel finansal veri tutuyorsan
- [ ] SOX (US public co) — accounting controls
- [ ] PCI-DSS — kart bilgisi işliyorsan
- [ ] AML/KYC — para transferi
- [ ] Vergi mevzuatı — jurisdiction-spesifik

Bu listeden 1+ tutuyorsa: legal advisor + bu pattern'leri implement etmeden production'a çıkma.

## Bu kategori için zorunlu doctrine docs
- `02-memory/doctrine/auto-mode-classifier.md` ✅
- `02-memory/doctrine/red-team-primitive.md` ✅
- `02-memory/doctrine/multi-grader-eval.md` ✅
- `02-memory/doctrine/eval-awareness.md` ✅ (public eval kullanıyorsan)
- `02-memory/doctrine/brain-hands-decoupling.md` ✅ (tool-using agent yazıyorsan)

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
Her sayı için kaynak: bank statement PDF, fatura, order confirmation. `data/sources/<id>/<doc>.pdf` immutable. **Counterparty identity** için global verified identifier kullan — D-U-N-S Number / Moody's ID / TR'de MERSIS + KEP. String match ("Acme Inc." vs "Acme, Inc.") yerine deterministic ID. (Ref: Anthropic 2026-05 finance agents — verified identity = "deterministic, auditable outcomes".)

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

## Reference architecture (Anthropic 2026-05 finance agents)

Anthropic'in 10 finans agent template'i 3 katmandan oluşuyor: **skills** (talimat + domain bilgi) + **connectors** (governed data access — D-U-N-S, Moody's, broker API'leri) + **subagents** (sub-task'a özel ek modeller). Layermark karşılığı:

- **skill** = `.claude/skills/<name>.md` (D8 inner-loop test gate uygulanır)
- **connector** = `packages/tools/<provider>.py` (D17 brain/hands/session decoupling — `execute(name, input) → result` interface arkasında)
- **subagent** = sadece gerçek sub-task pattern oluşunca (D8 inner-loop test). Tek-shot çağrı için subagent kurma — Anthropic'in template'i bile main agent'a delegasyon yapar, subagent değil.

Kaynak: github.com/anthropics/financial-services (cookbook formatında).

## Eval benchmark referansı

Kendi multi-grader rubric'ine ek olarak Vals AI Finance Agent benchmark (Anthropic Opus 4.7 lider %64.37) projedeki specific finansal task'lar için **sanity ceiling** — kendi agent'ın bu civar veya altındaysa frontier seviyesindesin, abnormal değil. Çok altındaysa (%30-40) doctrine pattern eksikliği var demek (audit trail zayıf, verification artifact yok, vb.).

## Önerilen skill'ler (categorical bundle)
- `agent-approval` — **zorunlu**, her finansal action gate
- `verify-agent-output` — **zorunlu**, sayıları bağımsız doğrula
- `grill-me` — yeni rapor / analiz spec öncesi (kim okuyacak, regülasyon var mı)
- `failing-test-as-prompt` — finansal pipeline için test = invariant ("toplam = 0", "hiç negatif balance")
- `project-advisor` — aylık audit
- `ubiquitous-language` — accounting terms (revenue vs MRR vs ARR)

## Sample first-task prompt (jargon-free)
> *"İlk feature: **aylık P&L raporu** (gelir-gider tablosu).*
>
> *1. **Double-entry invariant test** (her transaction'da debit + credit toplamı = 0; bu kural ihlal edilirse hata fırlat) — `/failing-test-as-prompt` skill'iyle önce yaz, sonra implement et.*
> *2. **Veri konumu:** `data/ledger/2026-05.jsonl` — append-only (eklenir, silinmez/değiştirilmez) + **hash-chained** (her satır önceki satırın hash'ini içerir, sonradan araya değişiklik tespit edilir).*
> *3. **Rapor sorgusu:** pure SQL (Python kodu yok, sadece sorgu — auditable, başkası anlar).*
> *4. **Her sayı için source link** (örn. fatura PDF, banka extresi) footnote olarak rapora ekle.*
> *5. **`/agent-approval` gate** — agent rapor üretti, ama gönderim/yayın için 'onayla?' sorusunu sormadan ileri gitmez."*

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

## 7-item production deployment checklist (Sam Witteveen 2026-05)

HIGH-RISK kategoride agent **multi-user production**'a giriyorsa bu 7 madde zorunlu. Tek başına kullanıyorsan bile (1), (4) ve (7) opt-out edilmemeli.

| # | Item | Niye | Implementasyon ipucu |
|---|------|------|----------------------|
| 1 | **Model control (gateway)** | Model deprecation hızlı; hard-coded model name = production breaks. Ayrıca multi-provider (Anthropic + Gemini + open) hot-swap. | `packages/llm/gateway.py` interface; `.env`'de `LLM_PRIMARY=claude-opus-4-7`, `LLM_FALLBACK=gemini-2.5-pro`. |
| 2 | **Prompt registry (versioned)** | Prompt'lar IP — code'a embed etme. Team'de prompt-only çalışan biri varsa logic'ten ayrı düzenler. | `prompts/<version>/<role>.md` git-tracked. CI'da prompt regression test. |
| 3 | **Guardrails (pre/post LLM + tool)** | PII/PHI redaction zorunlu (KVKK/GDPR). Prompt injection probe. | `packages/guards/` — pre-LLM regex/ML PII strip; post-LLM toxicity + competitor mention check; pre-tool whitelist; post-tool sanitize. |
| 4 | **Budget cap (per-model + per-day)** | Runaway loop = saatlik $100+. Big providers default cap **vermiyor**. | `apps/<service>/budget.py` daily token + dollar cap; aşılırsa circuit breaker (Doctrine #15). |
| 5 | **Tool/MCP control (central auth)** | 15 MCP × 15 ayrı auth = leak fırsatı. Granular permissions ister. | `packages/tools/auth.py` — tek noktada secret store, allow-list per agent role. |
| 6 | **Monitoring + tracing (OpenTelemetry)** | Black-box agent → user "bad response" reportuna debug mümkün değil. Per-user journey trace zorunlu. | `loguru` → OTLP exporter; Datadog / New Relic / Honeycomb. Trace ID her LLM call'da. |
| 7 | **Eval (pre + continuous post-prod)** | Yeni model gelince eski trace'leri replay → regression catch. Aksi takdirde 3 hafta sonra %15 query bozulduğunu fark etmezsin. | `apps/eval/` modülü — `tests/golden_traces/` 100+ örnek, weekly cron replay; threshold 0.85 multi-grader rubric. |

**Aksiyon önceliği** (HIGH-RISK kategori için ilk yapılacaklar): **(4) Budget cap → (6) Monitoring → (7) Eval replay**. Diğerleri team büyüyünce.

(Ref: AI Engineer 2026 — Sam Witteveen "Must Haves For Agents in Production". `02-memory/youtube-intel/2026-05-04-insights-batch2.md`'de detay.)

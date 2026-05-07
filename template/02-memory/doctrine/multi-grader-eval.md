# Multi-grader eval rubric

> **Production agent eval doctrine.** Tek-shot demo / öğrenme amaçlı projeler için gerekli değil. Agent'ın yaptığı işin doğruluğu kritik (ürün, finans, güvenlik) ise **şart**.
>
> **Kaynak:** Anthropic Engineering "Demystifying evals for AI agents" (2026-05) + Eugene Yan "Product evals in three simple steps" (2025-11).

## Tek-skor eval yetmez

Coding agent için "test suite passed" boolean'ı gerçek kaliteyi yansıtmaz:
- Test pass = code çalıştı; **doğru kararı verdi mi?** ayrı soru
- Bazı kararlar doğru ama yan etkili (rate-limit aşımı, gereksiz API call)
- Agent eval harness'ı tanıyıp gaming yapabilir

3-grader rubric (Anthropic doctrine):

| Grader | Kaynak | Ağırlık | Otomasyon |
|---|---|---|---|
| **Outcome** | İş tamamlandı mı? — deterministic check | **50%** | Tam otomatik |
| **Transcript** | Agent doğru reasoning + policy uyumu mu? — model-based | **30%** | Otomatik (Claude as judge) |
| **Human** | Spot-check, calibration | **20%** | Manuel (haftada N örnek) |

CI'de yalnız otomatik kanallar koşar → maximum skor 0.80. Threshold otomatik run için **0.75**, weekly full eval için **0.85**.

## Outcome grader — deterministic

Beklenen sonuç ile observed çıktıyı schema-validate karşılaştırma:

```python
def grade_outcome(case: dict, observed: dict) -> tuple[float, str]:
    expected = case["expected"]
    tolerances = case.get("tolerances", {})
    hits = 0
    for key, exp_val in expected.items():
        obs = observed.get(key)
        if isinstance(exp_val, (int, float)):
            tol = tolerances.get(key, 0.0)
            if obs is not None and abs(obs - exp_val) <= tol:
                hits += 1
        elif obs == exp_val:
            hits += 1
    return hits / len(expected), "details..."
```

## Transcript grader — Claude as judge

5-dim rubric (proje domain'ine göre değişir — generic "helpfulness/toxicity" framework KULLANMA, Hamel field-guide: bu generic frameworkler "actively impede progress"):

```
You are an evaluator for an agent session transcript.

Score each dimension PASS/FAIL + 1-sentence critique (Hamel doctrine — 1-5 skalalar vanity metric üretir, domain-expert judgment'la korelasyon yok):
1. <dim_1>: Did the agent <do specific check>? (PASS/FAIL + why)
2. <dim_2>: Did the agent stay within <policy>? (PASS/FAIL + why)
3. <dim_3>: Did the agent honor <safety signal>? (PASS/FAIL + why)
4. <dim_4>: Did the agent reject duplicate / handle race correctly? (PASS/FAIL + why)
5. <dim_5>: Did the agent attach verification artifact? (PASS/FAIL + why)

Output JSON: {"scores": {"dim_1": "PASS", ...}, "critiques": {"dim_1": "...", ...}}
```

**Few-shot zorunlu.** Prompt'a 3-5 PDE-yazılmış critique örneği ekle (pass + fail karışık, neden açık). Hamel doctrine: critique-shadowing'siz judge = vanity metric. Aggregate transcript score = pass-rate across dims (formula değişmez, 0..1 range korunur).

Prompt cache zorunlu — rubric değişmez, transcript değişir. Prompt'un fixed prefix'i cache'lenir (~80% maliyet düşer).

## Human (calibration)

**Principal Domain Expert (PDE) zorunlu** — tek kişi, alanın gerçek uzmanı (psikolog → mental-health AI; avukat → legal AI; founder → küçük şirkette domain'i en iyi bilen). Mühendis kendini "expert" sanırsa rubric drift olur, judge prompt fakir-data'dan üretilir. Hamel: bu en sık görülen ölümcül hata.

Haftada 5-10 random örnek, spreadsheet'te kayıt:
- Otomatik skor
- Human verdict (PASS/FAIL + 1-line critique — judge prompt'a few-shot yem olur)
- **Class imbalance varsa raw agreement yanıltır** → precision + recall ayrı ölç. Pass-rate < %50 veya > %80 ise raw agreement sahte. **Hedef: <%90 alignment → rubric prompt re-tune** (Hamel: 3 iterasyonda %90'ı aşmak gerçekçi).

Anthropic'in Claude Code postmortem'inden ders: prompt değişiklikleri internal eval'da yakalanmıyordu çünkü evals **dar happy-path**'ti. Human spot-check broader test bandını sağlar.

**Sensitivity gap — multi-turn eval (Anthropic 2026-09 postmortem):** Tek-shot eval recovery'yi maskeler — Claude isolated mistake'lerden iyi kurtulur, kullanıcı 5+ turn'lük session'da yine de bozulma görür. Multi-turn eval ekle: aynı session'da 5+ turn boyunca degradation var mı? Outcome-only "doğru cevap geldi mi" yetmez. **Continuous prod eval** ayrıca şart — pre-deploy canary tek başına load-balancing class'ı bug'ları yakalamaz.

**Bottom-up failure taxonomy (Hamel field-guide):** PDE serbest-yazı not düşer (tip-yok, pre-defined kategori-yok). N≥30 örnekten sonra LLM'e taxonomy üret-tir + pivot tablo. Pareto: 2-3 hata tipi vakaların ~%60'ını kapsar — `basic.jsonl`'a ilk eklenecek case'ler bunlar. Top-down generic metric (helpfulness/toxicity) yerine bottom-up domain-failure tarafından şekillenmiş suite.

## Eval-as-gate

CI'de:

```yaml
# .github/workflows/eval.yml
- name: Run eval suites
  run: |
    python -m evals.harness --suite basic --threshold 0.75
    python -m evals.harness --suite edge --threshold 0.75
    python -m evals.harness --suite security --threshold 0.85   # safety-critical
```

Exit code 1 → PR merge block. Threshold suite-spesifik (security'ye sıkı, basic'e gevşek).

## Suite roadmap

Önce **L1 unit-test assertions** (Hamel: ucuz, her commit, "essential not to skip") — UUID leak, schema valid, response shape, deterministic invariants. Sonra L2 (bu rubric, model+human, daha pahalı), sonra L3 (production A/B). Cost: L1 < L2 < L3 — atlamak kaynak harcar.

İlk projede 1 suite yeterli (`basic.jsonl`, 10-20 case). Case'leri 3 boyutta üret (Hamel field-guide): **features** (ne yapıyor) × **scenarios** (multiple-match / no-match / invalid / system-error) × **personas** (varsa). LLM ile sentetik üret, AMA **gerçek DB constraint'lerinde grounded** — yoksa "no_matches" case'i fake passes verir. Olgunlaştıkça:

1. **`basic.jsonl`** — happy path, normal koşullar
2. **`edge.jsonl`** — edge cases (timeout, rate-limit, partial failure)
3. **`security.jsonl`** — adversarial input (red-team primitive ile entegre)
4. **`policy.jsonl`** — policy boundary push (max_X aşımı, stop_X override)
5. **`harness_anomaly.jsonl`** — eval-awareness defense (canary contamination)

## Pattern

```python
# evals/harness.py
from apps.eval.grader import grade_transcript

@dataclass
class EvalResult:
    case_id: str
    outcome_score: float    # 0..1
    transcript_score: float # 0..1
    weighted_score: float   # outcome*0.5 + transcript*0.3 + human(0)*0.2
    passed: bool

def run_case(case: dict) -> EvalResult:
    observed = invoke_agent(case["input"])  # production agent run
    transcript = capture_transcript()
    outcome, _ = grade_outcome(case, observed)
    transcript_score = grade_transcript(transcript)  # Claude as judge OR stub
    weighted = outcome * 0.5 + transcript_score * 0.3 + 0.0 * 0.2  # human=0 in CI
    return EvalResult(...)
```

## Data viewer (Hamel: "tek en yüksek-ROI yatırım")

Eval rubric'ten **önce**: trace'leri tek ekranda göster — input + agent action + tool calls + final output + metadata. Spreadsheet veya 1-günlük FastHTML/Streamlit app yeter. Friction = hiç bakmamak. PDE'nin "1 tıkla pass/fail + serbest critique" yazabilmesi şart. "You can never stop looking at data" — automation viewer'ı replace etmez, hızlandırır.

## Ne zaman silebilirsin?

Demo/öğrenme projesi için bu kadar yapı overkill. Production agent için **şart** — ölçemediğin şeyi geliştiremezsin.

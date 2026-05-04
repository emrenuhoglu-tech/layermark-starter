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

5-dim rubric (proje domain'ine göre değişir):

```
You are an evaluator for an agent session transcript.

Score each dimension 0..5:
1. <dim_1>: Did the agent <do specific check>?
2. <dim_2>: Did the agent stay within <policy>?
3. <dim_3>: Did the agent honor <safety signal>?
4. <dim_4>: Did the agent reject duplicate / handle race correctly?
5. <dim_5>: Did the agent attach verification artifact?

Output JSON: {"scores": {...}, "notes": "..."}
```

Prompt cache zorunlu — rubric değişmez, transcript değişir. Prompt'un fixed prefix'i cache'lenir (~80% maliyet düşer).

## Human (calibration)

Haftada 5-10 random örnek, spreadsheet'te kayıt:
- Otomatik skor
- Human verdict (Y/N policy uyumlu)
- Sapma > 15% → rubric prompt re-tune

Anthropic'in Claude Code postmortem'inden ders: prompt değişiklikleri internal eval'da yakalanmıyordu çünkü evals **dar happy-path**'ti. Human spot-check broader test bandını sağlar.

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

İlk projede 1 suite yeterli (`basic.jsonl`, 10-20 case). Olgunlaştıkça:

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

## Ne zaman silebilirsin?

Demo/öğrenme projesi için bu kadar yapı overkill. Production agent için **şart** — ölçemediğin şeyi geliştiremezsin.

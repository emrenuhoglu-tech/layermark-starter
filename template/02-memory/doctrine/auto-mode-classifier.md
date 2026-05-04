# Auto-mode permission classifier

> **Production agent doctrine.** Tek-shot prototip için gerekli değil — sadece otonom çalışan, permission-gate'i devre dışı bırakan agent'lar için.
>
> **Kaynak:** Anthropic Engineering "Claude Code auto mode" (2026-05).

## Niye gerek?

Claude Code'un "auto mode" özelliği permission prompt'ları skip eder. Bu hız kazandırır ama agent'ı **adversarial input'a** açar. Anthropic'in production'da kullandığı 2-katmanlı savunma:

1. **Input prompt-injection probe** — gelen prompt'ta scam/jailbreak/policy-bypass denemesi var mı?
2. **Output transcript classifier** — agent'ın yapmayı planladığı action policy ihlali mi?

İkisi de **Sonnet 4.6** modeli üzerinde koşar. Anthropic'in açıkladığı: 17% FNR (false-negative rate) overeager actions için. Generic bir agent için OK; senin domain'in için OK olmayabilir.

## Domain-spesifik tuning

Generic 17% FNR kabul değilse — finansal/sağlık/güvenlik domain'inde — 3 customization slot:

### Slot 1: Block list (zorunlu yasaklar)

Agent prompt'larında veya output'larında **asla** olmaması gerekenler. Match olursa hard reject:

```yaml
# Örnek: production agent block list
block_keywords:
  - "BrowseComp"           # eval-harness recognition signal
  - "test-set"
  - "benchmark_id"
  - "eval-suite"
block_endpoints:
  - "evil.example.com"
  - "*.tor"
  - "internal-admin"
block_actions:
  - "withdraw"             # destructive money operation
  - "delete_user"
  - "rotate_credentials"
```

### Slot 2: Allow exceptions

Block list'e takılması gereken ama spesifik bağlamda OK olan eylemler. Çoğu zaman gerek olmaz; agent'ın block'a takıldığında prompt'unu netleştirmek genelde daha iyi.

### Slot 3: Trust boundary

Hangi yön trusted, hangisi her zaman validated:

- **Orchestrator → agent**: trusted (ama yine de schema-validated)
- **Agent → orchestrator**: validated her seferinde (pydantic / zod / tip-uyumlu schema + confidence threshold)
- **Site/external → agent**: untrusted (input olarak kabul, ama komut olarak değil)
- **Agent → external API**: domain allow-list zorunlu

## Multi-agent setup için

Her agent için ayrı block list olabilir — örn. risk-analyst agent için `delete_data` blocked, raporlama agent'ı için irrelevant. Tek bir global classifier her agent için aynı olmamalı.

## Implementation pattern

```python
# .claude/skills/auto-mode-classifier.md veya hooks
def classify_input(prompt: str, agent_role: str) -> ClassificationResult:
    """Pre-execution probe."""
    if any(kw.lower() in prompt.lower() for kw in BLOCK_KEYWORDS[agent_role]):
        return ClassificationResult(allow=False, reason="block_keyword")
    return ClassificationResult(allow=True)

def classify_output(action: dict, agent_role: str) -> ClassificationResult:
    """Pre-action probe (after agent decides what to do, before tool execute)."""
    if action["type"] in BLOCK_ACTIONS[agent_role]:
        return ClassificationResult(allow=False, reason="block_action")
    if action.get("endpoint") and not match_allow_list(action["endpoint"], agent_role):
        return ClassificationResult(allow=False, reason="domain_not_in_allow_list")
    return ClassificationResult(allow=True)
```

Hook olarak `PreToolUse` event'ine bağlanır — auto mode'un default classifier'ını override etmek yerine **ek katman** olarak.

## Test edilmediği sürece etkin değil

Her customization en az 5 adversarial test case'i gerekli (red-team primitive doctrine'i ile entegre). 5/5 reject geçmeden production'a çıkmasın.

## Ne zaman silebilirsin?

Tek-shot prototype, demo, veya tamamen offline (network'siz) ajan kullanıyorsan bu dosyayı `_archive/`'a taşı. Production agent kuran herkes için **şart**.

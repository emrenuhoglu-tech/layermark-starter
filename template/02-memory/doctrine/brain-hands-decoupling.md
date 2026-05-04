# Brain / hands / session decoupling

> **Tool-using agent'lar için.** Stateless prompt + stateless tool çağrılarıyla çalışan agent'a uygulanmaz. Production-grade tool-using agent için **şart**.
>
> **Kaynak:** Anthropic Engineering "Scaling Managed Agents: Decoupling the brain from the hands" (2026-05).

## 3 katman

| Katman | Sorumluluk | State |
|---|---|---|
| **Brain** | Karar verme — orchestrator + agent prompt'ları | Stateless (context'te yalnız son action summary) |
| **Hands** | Tool execution — `execute(name, input) → result` interface arkasında | Stateless (her çağrı bağımsız) |
| **Session** | Durable log — append-only event store | Stateful (DB veya append-only file) |

Anthropic'in argümanı: bu 3 katman karıştırılırsa agent ölçeklenmez. Tool execution brain'in içinde olursa — yeni site eklediğinde brain kodu değişir, yeni provider eklediğinde harness restart gerekir.

## Single tool interface

Brain tool modüllerini **direkt import etmez**. Her tool çağrısı tek interface'ten geçer:

```python
# packages/tools/execute.py
from dataclasses import dataclass

@dataclass
class ExecutionResult:
    ok: bool
    output: dict | str | None = None
    error: str | None = None
    artifact_path: str | None = None  # verification-by-artifact
    duration_ms: int = 0

async def execute(name: str, input: dict) -> ExecutionResult:
    impl = REGISTRY.get(name)
    if not impl:
        return ExecutionResult(ok=False, error=f"unknown tool: {name}")
    return await impl(input)
```

Brain kodu:

```python
# YANLIŞ — brain bağlı
from packages.browser import click
result = await click(selector="#bet-on-17")

# DOĞRU — brain decoupled
from packages.tools import execute
result = await execute("browser.click", {"selector": "#bet-on-17"})
```

Tool implementations decorator ile register olur:

```python
# packages/tools/registry.py
from packages.tools.execute import register_tool, ExecutionResult

@register_tool("browser.click")
async def browser_click(input: dict) -> ExecutionResult:
    selector = input.get("selector")
    if not selector:
        return ExecutionResult(ok=False, error="missing selector")
    # ... actual Playwright call ...
    return ExecutionResult(ok=True, output={"clicked": selector})
```

## Session katmanı

**Asla** brain'in context'inde tut. Append-only log:

```python
# data/sessions/<agent>/<timestamp>.jsonl
{"ts": "...", "type": "action", "tool": "browser.click", "input": {...}, "result": {...}}
{"ts": "...", "type": "observation", "summary": "wheel landed on 17", "artifact": "data/screenshots/wheel-17.png"}
```

Brain'e tekrar yüklenirken **summary** verilir, ham log değil. (Bkz: summarized-payload doctrine.)

## Faydaları

1. **Hot-swap**: tool implementation'ını rebind et (`replace_tool("browser.click", new_impl)`), harness restart yok.
2. **Testability**: tool stub registration ile brain'i live site olmadan test edebilirsin.
3. **Single audit point**: her execute() bir log entry — policy enforcement single point.
4. **Multi-provider**: Claude/GPT/local fark etmez; brain abstract, tool concrete.

## Stub mode

Production'da `CASINO_BOT_USE_STUBS=0` (örnek env), test/CI'de `=1`:

```python
@register_tool("balance.fetch")
async def balance_fetch(input):
    if os.environ.get("USE_STUBS") == "1":
        return ExecutionResult(ok=True, output={"balance": 1000.0})  # deterministic
    return await _real_balance_fetch(input)  # production
```

Brain tarafı tek satırla iki mod arasında geçer.

## Ne zaman silebilirsin?

Stateless single-shot agent (e.g., "summarize this PDF") tool-using değildir, bu doctrine N/A. Multi-step + tool-using = **şart**.

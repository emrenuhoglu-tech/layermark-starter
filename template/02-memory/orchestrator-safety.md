# Orchestrator-only multi-agent — distributed-systems doctrine

> **Bu doc sadece multi-agent sistemler için.** Tek ajan kullanıyorsan bunu sil veya `_archive/` altına taşı. Default Claude Code projeleri tek ajan, bu uygulanmaz.
>
> **Kaynak:** Sandipan Roy / AI Engineer Conf 2026 + Mario "compounding boos" anti-pattern. Tam distillation: `~/.layermark/intel/youtube/ai-engineer/_DISTILLATION.md` (varsa).

## Niye gerek?

LLM ajanları **belirsiz operasyon yapan distributed system bileşenleri**. Probabilistic. Her hata tipi 9-pillar distributed-systems eski sorunlarına geri döner:

- Network partitions → ajan timeout / API rate-limit
- Byzantine failures → ajan halüsinasyon, yanlış data
- Race conditions → 2 ajan aynı anda aynı state'i değiştirir
- Eventual consistency → ajanlar farklı zamanlarda farklı görür

Distributed-systems alanında 30 yıl kanıtlanmış 6 pattern var — multi-agent için **şart**, opsiyonel değil.

## 6 zorunlu pattern

### 1. Orchestrator owns mutable state
Ajanlar paylaşılan state'e **never write**. Sadece orchestrator (CEO) yazar.

```python
# YANLIŞ
agent_a.update_balance(spin_result)
agent_b.update_balance(spin_result)  # race condition

# DOĞRU
result = agent_a.observe_spin()      # sadece okur, dön
orchestrator.apply_spin(result)       # tek noktadan yazar
```

### 2. Immutable + versioned events
Her event append-only log'a yaz. Overwrite yok.

```
data/sessions/agent_a/2026-05-04T10-00-00.jsonl
data/sessions/agent_a/2026-05-04T10-00-15.jsonl  # her event yeni dosya
```

State = log replay. Snapshots opsiyonel optimization.

### 3. Data contracts at handoff
Ajan'dan orchestrator'a dönen her payload **pydantic schema-validate**:

```python
class SpinResult(BaseModel):
    winning_number: int = Field(ge=0, le=36)
    balance_delta: float
    confidence: float = Field(ge=0.0, le=1.0)
    screenshot_url: str

# Confidence < 0.8 → reject, retry, alert orchestrator
```

Halüsinasyon ya da partial response orchestrator'a sızmaz.

### 4. Circuit breaker per agent
Bir ajan timeout/error threshold (örn: 5 dakikada 3 fail) aşarsa **kapatılır**. Diğer ajanlar etkilenmez.

```python
class CircuitBreaker:
    def __init__(self, fail_threshold=3, window_sec=300):
        ...

    def record_failure(self, agent_id):
        ...
        if self.fail_count[agent_id] >= self.threshold:
            self.state[agent_id] = "OPEN"  # ajan kapalı

    def half_open_test(self, agent_id):
        # 5 dk sonra 1 test request — başarılı ise re-open
        ...
```

Half-open → test → close. Cascading failure önler.

**Sticky-routing trap (Anthropic 2026-05 postmortem):** Bir kez "broken" backend'e yönlenmiş session sonraki request'lerde de aynı backend'e gider — failure 1 spin değil, agent'ın tüm session'ı boyunca persists. Circuit-breaker'a session-level reset ekle: ajan OPEN olunca **session/context'i de invalidate et**, sadece next-call'u block etme. Yoksa "%9 fail rate" görünür ama gerçekte etkilenen %9 user'ın TÜM follow-up'ları broken.

### 5. Saga `execute()` + `compensate()`
Her bet/operation için **reverse path tanımlı**:

```python
class BetSaga:
    def execute(self):
        self.lock_funds()
        self.place_bet()
        self.confirm()

    def compensate(self):
        # execute'in tersini yap, exception olsa bile
        self.cancel_pending()
        self.unlock_funds_if_not_locked()
        self.alert_treasury()
```

Orchestrator failure'da saga geriye yürür.

### 6. Ajanlar birbirini çağırmaz
Hiç. Asla. Ortak DB / dosya / message queue yok. Tek source of truth = orchestrator state.

```python
# YANLIŞ
agent_a.notify(agent_b, "spin done")  # birbirine konuşma

# DOĞRU
result = agent_a.observe()      # ajan sadece dış dünyayı görür
orchestrator.coordinate(result)  # orchestrator karar verir
orchestrator.dispatch(agent_b, "now bet")  # ajan'a komut gider
```

## Anti-pattern (yapma)

### Compounding boos (Mario)
Her ajana review-agent eklemek = "Ouro" döngüsü. Slop birikir. Verification = orchestrator'da metric (P&L, success rate), ajan **içinde** değil.

```python
# YANLIŞ
agent_a.review(agent_b.output)  # 2x slop, 2x cost

# DOĞRU
result_a = agent_a.execute()
result_b = agent_b.execute()
orchestrator.compute_metrics(result_a, result_b)  # truth = aggregate metric
```

## Verification by artifact

Ajan iddia ederse (Cursor pattern, 2026-05): **kanıt göster.**

```python
class AgentClaim(BaseModel):
    text: str
    artifact_path: Path  # screenshot, video, log dosyası
    artifact_hash: str   # tampering önleme

# orchestrator audit ederken artifact'a bakar, sadece text'e değil
```

## Önerilen klasör yapısı

```
multi-agent-project/
├── apps/
│   ├── orchestrator/        # tek source of truth
│   └── agent-template/      # her ajan kopyası
├── packages/
│   └── contracts/           # pydantic models
├── data/
│   ├── sessions/<agent>/    # per-agent immutable log
│   └── snapshots/           # state checkpoint'leri
└── 02-memory/
    └── circuit-state.json   # ajan availability tracking
```

## Bu doc nasıl kullanılır

1. Multi-agent projeyi yeni başlatıyorsan: bu 6 pattern'i zaten implementasyona dahil et
2. Mevcut multi-agent kodun varsa: her pattern'i checklist olarak audit et
3. Wizard "multi-agent?" sorusuna evet dediyse: Phase 1 başlamadan **önce** bu doc'u oku, kullanıcıya summary ver

## Hard rule

**Bu pattern'lerden kısa kesemezsin.** Her biri "biz küçüğüz, gerek yok" denilir, sonra 3. ay'da production'da yanma yaşanır. İlk ajan olmadan içeride doğru kur.

## Daha fazla okuma

- Sandipan Roy, AI Engineer Conf 2026 — *"Distributed AI is just distributed systems"*
- Pat Helland — *"Idempotence is not a medical condition"* (eventual consistency)
- Casino bot CLAUDE.md — concrete 9-agent application of these patterns

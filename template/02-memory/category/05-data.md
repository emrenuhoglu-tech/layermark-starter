# Kategori: Veri & analiz

## Tipik kullanım
Dashboard, BI, ETL, data viz, research notebook, ML eval, market analysis.

## Risk profili
**Medium.** Veri yanlış output'u karar zedeler — özellikle business decision için input olunca. Reproducibility + provenance kritik.

## Doctrine emphasis
1. **Verification (D6)** — her sayı/grafik için: how do we verify? (raw data link, query, hash)
2. **Anti-hallucination (D13)** — *"X dataset'te Y kolonu var"* iddialarında **gerçek schema check zorunlu**
3. **Eval-awareness defense (D19)** — public benchmark kullanırken contamination riskine dikkat
4. **Surgical changes (D4)** — veri pipeline'ında küçük değişiklik bile büyük analiz kayması yaratabilir
5. **Rules emerge (D9)** — data quality kuralları organik birikir; pre-load 50 rule yapma

## 7 spesifik pattern

### 1. Reproducibility — script + data + seed
Her analiz: `scripts/<name>.py` + `data/<name>.parquet` + random seed (varsa). Notebook'tan script'e dönüştür.

### 2. Dataset versioning
`data/raw/` immutable (overwrite yok, yeni timestamp eklenir). `data/processed/` derived, regenerate edilebilir. README'da provenance.

### 3. Schema validation gate
ETL girişinde pydantic / Pandera schema. *"Yeni kolon"* sürpriz gelmesin → schema mismatch erken yakala.

### 4. Citation discipline
Her sayı/grafik için kaynak: dataset adı + version + query. Slide'a koymadan önce *"bu sayıyı tekrar üretebilir miyim?"* test.

### 5. Sanitization (PII / hassas veri)
Hassas kolonlar (`email`, `phone`, `address`) prompt'a girmesin. Sanitization layer ETL'de.

### 6. Periodic refresh + drift watch
Dashboard her hafta yenileniyor — distribution shift detect: KS-test, week-over-week metric. Anomalı flag.

### 7. Notebook → script promotion
Exploration'da notebook OK; üretim koduna girecek herşey `scripts/`'e promote. Notebook'ta import'lar reproducibility kırar.

## Önerilen skill'ler
- `grill-me` — analiz spec öncesi (hangi soru, hangi metrik)
- `verify-agent-output` — agent'ın ürettiği analiz numaralarını farklı path ile doğrula
- `failing-test-as-prompt` — analiz için "test" = expected output range
- `project-advisor` — aylık dashboard audit (stale metric var mı?)
- `ubiquitous-language` — metric naming consistency (DAU vs Active Users)

## Sample first-task prompt
> *"İlk dashboard: weekly customer churn rate. Önce schema check (raw `data/users.parquet` + `data/events.parquet`), sonra script (notebook değil), sonra grafik. Her sayının tekrar-üretim queryesi `scripts/queries/churn.sql`. Citation discipline her viz altında."*

## Anti-patterns
- ❌ "Notebook'ta hızlıca prototype" → 6 ay sonra reproducibility yok
- ❌ "Average kullanırım" → outlier-sensitive metric, median + percentile şart
- ❌ PII'lı raw data prompt'a → privacy + compliance risk
- ❌ Public benchmark'a güven (eval-awareness defense): model contamination olabilir

## Bu kategori için zorunlu doctrine docs (varsa)
- `02-memory/doctrine/eval-awareness.md` — public benchmark kullanıyorsan
- `02-memory/doctrine/multi-grader-eval.md` — production analysis pipeline'ında

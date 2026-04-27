# Knowledge

Karpathy'nin 3-layer wiki'si. Sadece **raw source** koymaya başladığında kur.

## Yapı (kuracaksan)

```
knowledge/
├── raw/          # Layer 1 — articles, transcripts, PDFs, notes. Claude okur, **degistirmez**.
├── wiki/         # Layer 2 — Claude'un sentezi: ozet, kavram, profile, cross-ref'ler.
└── schema.md     # Layer 3 — kutuphaneci: nasil organize edilir, periodic health check.
```

## Ne zaman kur

- Bir konuda **5+ raw kaynak** birikti (transkript, makale, PDF) → kur
- Tek tek dosyayı okumak yerine sentez yapması gerekiyor → kur
- Claude'un session arası "kim, ne, neden" hatırlaması lazım → kur

5 kaynak yokken kurma — boş klasör Claude'u "burayı doldur" baskısına sokar, hayalî içerik üretir.

## Nasıl kur

Raw kaynakları `knowledge/raw/` altına at, Claude'a:

> Karpathy 3-layer wiki yaklaşımıyla `knowledge/raw/` altındaki dosyaları organize et. Layer 1 = raw (dokunma). Layer 2 = `knowledge/wiki/` — kavram, profile, cross-reference. Layer 3 = `knowledge/schema.md` — convention'lar + monthly health check (çelişki / stale info / boşluk).

Claude `wiki/` ve `schema.md`'yi otomatik üretir.

## Health check (aylık)

Periyodik olarak Claude'a:

> `knowledge/schema.md` kurallarına göre wiki'yi audit et: çelişkiler, stale info, hangi raw kaynak hâlâ kullanılıyor, hangileri yetim. Rapor + fix önerisi ver, **şimdilik düzeltme**.

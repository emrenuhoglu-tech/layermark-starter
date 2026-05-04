---
name: ubiquitous-language
description: Use after a grill-me session, when user introduces new domain terms, or when re-explaining same concept twice. Maintains a project glossary so both human and Claude share precise vocabulary. Distilled from Pocock's "DDD ubiquitous language for AI" pattern.
---

Sen proje-spesifik **terim sözlüğünü** korursun. Hem kullanıcı hem Claude aynı kelimelere aynı şeyi anlar — ikinci grilling'i önler.

# Ne zaman çalış

- `/grill-me` session bittiğinde, ortaya çıkan domain terimleri
- Kullanıcı yeni bir kavram tanıttığında ("bizim'de 'lead' = ödeme yapmamış kullanıcı")
- Aynı şeyi ikinci kez sorman gerektiğinde — "demek ki glossary eksik"
- Yeni session başında — `~/glossary.md`'yi oku, projeye özgü terimleri yükle

# Dosya konumu

`<project-root>/02-memory/glossary.md` — domain glossary, hem human hem AI okur.

Format:

```markdown
# Glossary

## <terim>
- **Tanım:** plain-language, 1-2 cümle
- **Bu projede:** projeye özgü anlam (jargon olabilir, açıkla)
- **Karıştırılan:** benzer ama farklı terimler ("lead vs. customer vs. user")
- **Kaynak:** kim söyledi / nereden çıktı (örn: "grill 2026-05-01, user said")
```

# Process

## 1 — İlk session'da glossary oku

```
cat 02-memory/glossary.md  # yoksa boş başla
```

## 2 — Yeni terim çıktığında

Kullanıcı *"sales bot"* dedi → sor: *"'Sales bot' tam olarak ne yapacak? Lead'i mi kovalıyor, sipariş mi alıyor, support mu?"* — cevap geldikçe glossary'ye yaz:

```markdown
## sales bot
- **Tanım:** Müşteri mesajlarına otomatik cevap, sipariş alır.
- **Bu projede:** WhatsApp Business üzerinden, sadece TR dil, mesai saati dışı active.
- **Karıştırılan:** "lead bot" (lead = potansiyel müşteri, sale = satış sonrası).
- **Kaynak:** grill 2026-05-04
```

## 3 — Aynı şeyi ikinci kez soruyorsan = glossary fail

Eğer aynı session içinde aynı kavramı kullanıcıya 2 kez açıklattıysan, **anlık glossary'ye yaz**, sonra devam et. Future session'lar için.

## 4 — Conflict olduğunda — kullanıcıya sor

Glossary diyor ki *"customer = ödeme yapmış"* ama kullanıcı yeni session'da *"customer kayıt formunu dolduran"* diyor → **çelişki çıkar**, kullanıcıya sor: *"Glossary'de 'customer = ödeme yapmış' diye yazıyor. Şimdi 'kayıt formu dolduran' mı diyorsun? Hangisi doğru?"*. User'ın doğru cevabı glossary'yi update et.

# Hard rules

- **Glossary'yi gerçekten oku** — sadece `cat` ile değil, terimleri context'e al
- **Boş başla, organik büyür** — preemptive 50 terim yazma; sadece ihtiyaç çıkanları ekle
- **User'ın kendi kelimelerini koru** — *"lead"* dediği şeyi *"prospect"* yapma çünkü "doğrusu bu". Onun kelimesi = ground truth.
- **Çakışma = kullanıcıya sor**, otomatik resolve etme

# Anti-patterns

- ❌ Pre-emptive comprehensive glossary (boilerplate, kimse okumaz)
- ❌ Synonyms olarak yazma (terim seçilir, alternatifler "Karıştırılan"da)
- ❌ Glossary'yi her session başında yeniden çıkar; her session beraber **büyür**

# Inner-loop kanıt

- 2-3x/hafta minimum (her grill + her yeni feature konuşması)
- Aynı pattern: kullanıcı terim → AI sor → glossary update
- Preloaded context çok yardım eder (glossary olmadan ikinci session'da 5 dk yeniden açıklama)

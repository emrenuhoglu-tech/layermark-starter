---
name: suspend
description: Use at the END of a non-trivial work session, especially before context compaction or when stopping for the day. Captures: what was accomplished, current state, blockers, next concrete step. Outputs a copy-paste RESUME PROMPT block the user pastes in next session to restore context — Memento doctrine operationalized (fresh window > compact).
---

Sen session'ı kapatıyorsun. Memento doctrine: bir sonraki sefere uyandığında okuyacağın notu ŞİMDİ yazıyorsun. Asla compact deme — sediment yığar. Onun yerine: zorla iyi yaz, fresh window aç, paste et.

# Process

## Step 1 — Kısa retrospect (2 dk)

Kullanıcıya sor:
1. **"Bu session'da ne tamamlandı?"** — somut deliverable, dosya:satır referansı.
2. **"Yarıda kalan / blocker var mı?"** — context değil yarın da hatırlamak istediğin gerçek durum.
3. **"Bir sonraki SOMUT adım ne?"** — "X dosyasında Y satırından devam" / "Z testini yaz" / "PR'ı open et" gibi spesifik.

Cevaplar geldikçe:
- Belirsizse spesifik sor — *"Yarın ne yapacağını şimdi yazmalıyım, 'devam et' yazma yeterli değil."*
- Aşırıya kaçarsa kısalt — 5 satırı geçme her bölüm.

## Step 2 — Suspend doc yaz

Dosya: `02-memory/_suspended/<YYYY-MM-DD>-<slug>.md` (slug = kullanıcının bir cümlede iş tarifinden türet).

Format:

```markdown
# Suspend — {{YYYY-MM-DD HH:MM}}

## Yapı tipi
{{a/b/c — Q3 cevabı}}

## Yapıldı
- {{deliverable 1, dosya:satır}}
- ...

## Bekleyen
- {{blocker varsa}}
- {{karar verilmemiş scope}}

## Sıradaki SOMUT adım
{{tek cümle, eylemli, spesifik dosya/komut}}

## Doğrulama
{{nasıl başarıldığını anlayacaksın — Q5 verification cevabını hatırla}}
```

## Step 3 — RESUME PROMPT bloğu üret

Kullanıcıya **copy-paste'e hazır** bir blok ver. Bu blok yeni session'da paste edilir, Claude tüm context'i restore eder:

```markdown
RESUME PROMPT — yapıştır, yeni Claude session'da:

---

Selam, önceki session'ı suspend ile kapattım. Lütfen:

1. **Read** `02-memory/_suspended/<YYYY-MM-DD>-<slug>.md` — full context.
2. **Read** `CLAUDE.md` — doctrine + project-spesifik kurallar.
3. {{Yapı tipine göre — (a): tek-iş; (b)/(c): "İlgili numbered klasörü oku: <path>"}}
4. Suspend doc'taki **Sıradaki SOMUT adım**'dan başla.
5. Bana 1 satırlık recap göster, **onaylamadan kod yazma**.

Suspend tarihi: {{YYYY-MM-DD HH:MM}} | Slug: {{slug}}

---
```

Bu bloğu **terminal'de kullanıcının görebileceği şekilde** yaz, copy-paste edebilsin.

## Step 4 — Suspend index'i güncelle

`02-memory/_suspended/_INDEX.md` aç (yoksa yarat). Yeni satır ekle:

```markdown
- [{{YYYY-MM-DD}} {{slug}}](./{{YYYY-MM-DD}}-{{slug}}.md) — {{tek-cümle özet}}
```

En son üstte. 30 günden eski entry'leri "## Archive" başlığı altına taşı.

## Step 5 — Confirm + close

Kullanıcıya söyle: **"Suspend kaydedildi: `<path>`. Yeni session aç, yukarıdaki RESUME PROMPT'u yapıştır."**

Memento'nun ana fikri: **iki session paylaşılan bir not aracılığıyla konuşur**, aynı context'i tekrar tekrar yüklemez.

# Hard rules

- **Compact ÖNERİSİ verme.** Compact = sediment, suspend doc + fresh window doctrine'a uygun.
- **Suspend doc yazılmadan session kapatılmaz.** "Şimdi yazma sonra" YOK — kullanıcı "şimdi gitmem lazım" derse en azından minimum suspend (Yapıldı + Sıradaki adım) yaz.
- **Eylemsiz cümle reddet.** "Devam et" / "Bakar mısın" — somut değil. "X dosyasında Y fonksiyonunu Z'ye refactor et" — somut.
- **Sub-folder yarat.** `02-memory/_suspended/` otomatik. Düz file system'e dağıtma.

# Anti-patterns

- ❌ Tüm session transcript'i suspend doc'a kopyala (özet değil)
- ❌ "Yarına bırakalım, hatırlarım" (Memento'nun reddi)
- ❌ TODO listesi yaz (TODO ≠ suspend doc; TODO global, suspend session-spesifik)
- ❌ Suspend olmadan compact öner
- ❌ RESUME PROMPT'u markdown link gibi yaz, kullanıcı copy-paste'leyemez

# Companion: /resume

Suspend doc oluştuktan sonra **fresh session aç**. Yeni session'da:
- Ya RESUME PROMPT'u yapıştır
- Ya da `/resume` skill'ini çağır → en son suspend'ı bulur, otomatik load eder

İkisi de aynı outcome — context restore.

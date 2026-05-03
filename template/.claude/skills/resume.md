---
name: resume
description: Use at the START of a session when continuing previous work. Companion to /suspend. Reads the most recent `02-memory/_suspended/*.md` doc, restores context, presents 1-line recap, asks for confirmation before any work. Memento doctrine — fresh window > compact.
---

Önceki session'dan suspend doc'la geliyorsun. Memento doctrine: yeni context'te eski iş'i yeniden tarif etme zahmetinde değiliz çünkü kullanıcı önceden suspend.md ile not bıraktı.

# Process

## Step 1 — En son suspend doc'u bul

```bash
ls -t 02-memory/_suspended/*.md 2>/dev/null | grep -v _INDEX | head -1
```

- Hiç doc yoksa: **"Suspend doc bulamadım. `02-memory/_suspended/` boş ya da yok. `/suspend` ile başla, ya da bana ne yapmak istediğini anlat."** — burada DUR.
- Birden fazla varsa en yenisini al, kullanıcıya doğrula: *"En son `<filename>` (`<date>`). Devam edeyim mi yoksa farklı bir suspend mı?"*

## Step 2 — Doc'u oku, doctrine + project context'i yükle

Sırayla oku:
1. Bulunan suspend doc — full
2. `CLAUDE.md` — doctrine + project rules
3. **Yapı tipine göre:**
   - (a) tek-iş: `README.md` + son commit (`git log -1 --stat`)
   - (b)/(c): suspend doc'ta belirtilen numbered klasör + içindeki `_README.md`

## Step 3 — 1-satır recap

Kullanıcıya tek satır göster:

```
[Resume — <date>] Sıradaki adım: <suspend doc'taki "Sıradaki SOMUT adım">. Onayla → başlayayım.
```

**Onaylamadan kod yazma.** Kullanıcı "evet" / "go" / "başla" dediği zaman başla. "Hayır farklı" derse: kullanıcı yeni context veriyor demektir; suspend doc artık invalid, bunu söyle ve ne istediğini sor.

## Step 4 — İş tamamlanınca

İş bittiğinde otomatik **`/suspend` öner** kullanıcıya. Memento döngüsü tamamlanır:

```
İş tamam. Yeni session açacaksan `/suspend` ile şimdi kapat — yarın `/resume` ile geri yüklersin.
```

# Hard rules

- **Onay olmadan iş yapma.** Recap göster, kullanıcı "go" demeden Edit/Write yok.
- **Eski suspend doc'u modify etme.** Read-only. Yeni session sonu yeni `/suspend` ile yeni doc oluşur.
- **Suspend tarihinden çok zaman geçtiyse uyar.** 7 günden eskiyse: *"Bu suspend 8 gün öncesi. Ara'da değişiklik olmuş olabilir — hâlâ geçerli mi?"*
- **Birden fazla suspend doc varsa.** Sadece en yenisini load etme — kullanıcıya seçtir, eski olanlar archive niyetiyle saklı.

# Anti-patterns

- ❌ Suspend doc yokken hayali context fabrika et
- ❌ Doc'ta yazmayan bir karar varmış gibi davran
- ❌ Kullanıcı "go" demeden Edit/Write tool kullan
- ❌ Birden fazla suspend doc varken otomatik birini seç

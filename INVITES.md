# Invite + Feedback Plan — Layermark Starter

Bu doc 3-5 erken kullanıcıya starter'ı denetip dürüst geri bildirim almak için. Validation gelmeden başka feature ekleme.

## Davet adayları

| # | Kişi | Neden uygun | Ne sorulacak | Format |
|---|---|---|---|---|
| 1 | **Yücel** | İlk paylaşım hedefi (sen söyledin) | Tüm 5 soruyu cevaplasın (aşağıda) | WhatsApp + GitHub link |
| 2 | TBD — coder arkadaş | Tech-savvy, dev workflow tanır, harsh feedback verir | Tüm 5 soru + Level 2 vision check | WhatsApp |
| 3 | TBD — non-coder | Wizard accessibility test, "non-coder hitabı" gerçekten var mı? | "Anladın mı?" odaklı kısa | WhatsApp + screen recording |
| 4 | TBD — entrepreneur | Commercial value perception | "Bunu satabilir miyim?" + price perception | DM |
| 5 | TBD — opsiyonel | İndie hacker / SaaS kurucu | Level 3 SaaS vision validate | Twitter DM |

## 5 Soru — herkese aynı (validation framework)

1. **Setup'tan ilk Claude Code session'ına kadar kaç dakika sürdü?** (gerçek ölçüm — onlar timer tutmasa bile sen sor)
2. **Hangi noktada takıldın / şaşırdın? Spesifik adım ver.** (friction map için)
3. **9-soruluk wizard'da hangi soruyu anlamadın / yanlış cevapladın hissettin?** (plain-language başarılı mı?)
4. **Pre-shipped 13 skill'den hangisini gerçekten denedin / kullandın? Hangisi kafa karıştırdı?** (over-shipping testi)
5. **Şimdi bunu başkasına önerir misin? Niye?** (NPS proxy)

**Bonus (Yücel + tech-savvy için):**
- "Bizim olmayan ama bu starter'da olmalı dediğin şey?" (gap finder)
- "Çelişki / tutarsızlık fark ettin mi?" (doctrine drift catch)

## Davet mesajı şablonları

### TR — WhatsApp/DM (non-coder versiyon, varsayılan)

```text
Selam <isim>,

Claude Code projesi kurmanın 1-dakikalık yolunu yapıyorum. Senin denemen
ve dürüst yorumun bana çok değerli olur (5-10 dk).

Üç adım:
1. Bu sayfayı aç:  https://emrenuhoglu-tech.github.io/layermark-starter/start
2. Mavi "Bir dosya indir, çift-tıkla" butonuna tıkla
3. İnen dosyayı çift-tıkla, çıkan pencerede talimatları takip et

GitHub hesabı + terminal bilgisi gerekmiyor. Python yoksa bile script seni
kuruluma yönlendirir.

Sıkıntı çıkarsa direkt buraya yaz, fix ederim. 🙏
```

### TR — Tech-savvy versiyon (alternatif)

```text
Selam <isim>,

Claude Code starter pack — Pocock + Karpathy doctrine pre-shipped, 1 dakikada
opinionated iskelet. Erken-erişim, 3-5 dürüst yorum arıyorum.

Link: https://github.com/emrenuhoglu-tech/layermark-starter
(Use Template tek tık, ya da `python setup_starter.py` lokalde)

Friction noktaları varsa Issue aç, varsa direkt mesaj.
```

### EN — DM/Email

```text
Hey <name>,

Building a 1-minute setup for Claude Code projects. Would love your honest
take (5-10 min).

Three steps:
1. Open: https://emrenuhoglu-tech.github.io/layermark-starter/start
2. Click the blue "Download a file, double-click" button
3. Run the downloaded file, follow the prompts

No GitHub account or terminal commands needed. Script auto-detects missing
Python/Claude Code and walks you through install.

Hit a snag? Reply here, I'll fix it.
```

## Geri bildirim toplama yeri

- **Spesifik bug / improvement:** GitHub Issues (bug-report / feedback / feature-request templates var)
- **Ham yorum / DM:** WhatsApp ya da Twitter DM, sen elle `02-memory/feedback-log.md`'a aktar
- **Critical:** Telefonda 5 dk konuş, transcript yaz

## Bu doc'un kullanımı

1. **İsim doldur** (TBD'leri çöz)
2. Her birine mesaj at (yukarıdaki şablon)
3. Cevap geldikçe bu doc'a tarihli not ekle: *"2026-05-04 Yücel: setup 8 dk sürdü, Q3 kafa karıştırdı..."*
4. 1 hafta sonra: friction matrix çıkar, **sonra** feature ekleme kararı

## Anti-pattern (yapma)

- ❌ Davet ettiğin kişiyle olumlu sohbet → "harika!" → friction sormadan kapat (validation theater)
- ❌ 20 kişiye atıp ses bekle (ekonomi yok — 3-5 kişi ayrıntılı feedback > 20 kişi yüzeysel)
- ❌ Feedback gelmeden Level 2 wizard'a başla (premature)
- ❌ Negatif feedback'i savun ("ama biz şöyle düşündük") — sadece dinle, not al, hafta sonu değerlendir

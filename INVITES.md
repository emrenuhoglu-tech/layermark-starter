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

### TR — WhatsApp/DM

```text
Selam <isim>,

Birkaç aydır Claude Code üzerinde projeler kuruyorum, her seferinde aynı yapıyı kurmak yorucuydu — bu yüzden bir starter pack hazırladım. 1 dakikada doğru iskelete projeyi başlatıyor.

Hâlâ erken faz, **3-5 kişiye deneyimle + dürüst geri bildirim** istiyorum sonra Yücel/Cem gibi daha geniş kitleye paylaşacağım.

Link: https://github.com/emrenuhoglu-tech/layermark-starter
(README'de "Use this template" butonu var — 1 tık.)

5 dakika denersen 5 soru soracağım — friction'lı yerleri bulup düzelteceğim. Bu hafta vaktin var mı?

Açık tutmaya çalıştım: ücretsiz, MIT lisans, hiç bir kayıt yok.
```

### EN — DM/Email

```text
Hey <name>,

I've been building projects on Claude Code for a few months and got tired of setting up the same scaffolding every time. So I built a starter pack — bootstraps a Claude Code project with opinionated defaults in under a minute.

Still early — looking for **3-5 people to try it + give honest feedback** before I share it more widely.

Link: https://github.com/emrenuhoglu-tech/layermark-starter
("Use this template" button in the README — 1 click.)

If you have 5 minutes this week, I'll ask 5 short questions and use the friction points to fix things. Free, MIT, no signup.
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

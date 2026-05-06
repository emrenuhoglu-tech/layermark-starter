---
name: kvkk-acik-riza
description: KVKK Madde 5/1 + KVK Kurul 2018/10 sayılı kararına göre açık rıza beyanının 5 zorunlu şartı (özgür irade, belirli konu, bilgilendirilmiş, açık, geri alınabilir) için kontrol eder. Anti-pattern olarak "tek tıkla genel onay" tarzı paket-onayları, hizmet şartı dayatmasını, ve gizli amaç eklemelerini tespit eder. Use when reviewing consent UI, "açık rıza", checkbox flows, signup forms, consent modals.
---

# kvkk-acik-riza — KVKK acik riza beyani denetcisi

## Ne yapar

Verilen acik riza beyaninin (UI metni, checkbox akisi, form) KVKK Madde 5/1 + **2018/10 sayili Kurul Karari'nin** 5 zorunlu sartini tasiyip tasimadigini denetler.

## 5 zorunlu sart (Kurul Karari 2018/10)

1. **Ozgur irade**
   - Kullanici "evet" / "hayir" arasinda **gercek secim** yapabilmeli
   - Anti-pattern: "Acik riza vermezseniz hizmet veremeyiz" (hizmet sarti dayatmasi)
   - Anti-pattern: ucretsiz ozellige sınırlandırma yok ama acik riza vermeyene **sınırlandırma** uygulamak

2. **Belirli konuya iliskin**
   - Spesifik amac belirtilmeli — "her turlu pazarlama amaci" mugiz
   - Anti-pattern: "elektronik ileti, telefon, mektup, SMS ile iletisim" tek paket — her kanal **ayri onay**

3. **Bilgilendirilmis**
   - Once aydinlatma metni okuma firsati (link/scroll/expand) — sonra onay
   - Anti-pattern: aydinlatma metni link'i sadece riza kutusu **altinda** + ufak font

4. **Acik**
   - Tek tikla, tek check-box-uppermost, ambigu degil
   - Anti-pattern: pre-checked checkbox (otomatik isaretli)
   - Anti-pattern: "Sizin icin en uygun teklifleri sunabilmek amaciyla bilgilerinizin paylasilmasini onayliyorum" — paylasilan **kim**, **hangi amac**?

5. **Geri alinabilir**
   - Veri sahibi rizasini **istedigi zaman** geri alabilmeli
   - Geri alma kanali aydinlatma metninde **ayni kolaylikla** belirtilmeli (e-posta/web form/dashboard ayar)
   - Anti-pattern: verme tek tik, geri alma 5 ekran + telefon

## Output format

```text
## Acik riza beyani denetimi

### 5 zorunlu sart kontrolu

| # | Sart | Durum | Kanit | Bulgular |
|---|------|-------|-------|----------|
| 1 | Ozgur irade | ✅ / ❌ / ⚠️ | <UI elementi/satır> | <hizmet sarti dayatmasi var mi> |
| 2 | Belirli konu | ✅ / ❌ / ⚠️ | | <amac spesifik mi, paket onay var mi> |
| 3 | Bilgilendirilmis | ✅ / ❌ / ⚠️ | | <aydinlatma metni once okutuluyor mu> |
| 4 | Acik | ✅ / ❌ / ⚠️ | | <pre-checked, ambigu metin var mi> |
| 5 | Geri alinabilir | ✅ / ❌ / ⚠️ | | <geri alma kanali kolaymi mi> |

### Madde 5/2 alternatif degerlendirmesi

Bu islem icin Madde 5/2'nin (a-f) bentlerinden biri **acik rizaya alternatif** olabilir mi?
- (a) Kanunlarda acikca ongorulmesi
- (b) Fiili imkansizlik
- (c) Sozlesmenin kurulmasi/ifasi
- (d) Hukuki yukumluluk
- (e) Kisinin kendisi tarafindan alenilestirme
- (f) Hak tesisi/kullanim/korunma
- (g) Mesru menfaat (temel haklari ihlal etmemesi sarti ile)

**Karar**: <Madde 5/2 alternatifi var mi yok mu — varsa hangi bent>

> 2018/10 sayili Kurul Karari: **Madde 5/2 alternatifi varsa, acik rizaya basvurmak hukuken yanlis** (gizliden zorlama icerir). Acik riza yalnizca **bu alternatifler kapsami disinda** kullanilmali.

### Surgical fix önerileri

[BLOCKER] / [MAJOR] / [MINOR] formatında, her finding altinda **paste-ready
duzeltilmis metin** + UI degisiklik onerisi.
```

## Cok yapilan 5 hata

1. **Hizmet sarti dayatmasi**: "Hesap acmak icin acik rizalari kabul etmelisiniz". Cozum: ucretli/ucretsiz hizmet sarti **diger Madde 5/2 alternatiflerine** dayandiriliyor olmali; acik riza **ek** olmali, sart degil.

2. **Paket-onay**: Tek check-box ile email + SMS + telefon + posta. Cozum: her kanal **ayri checkbox**.

3. **Pre-checked checkbox**: Default isaretli. Cozum: kullanici aktif olarak **isaretlemeli** ("opt-in").

4. **Yanlis hukuki dayanak**: Sozlesmenin ifasi icin gerekli olan veri (Madde 5/2-c) icin acik riza isteme. Cozum: bu kategorideki veriler icin **alternatif hukuki sebep** kullan, acik riza isteme; aksi halde kullanici "geri aliyorum" derse hizmet veremezsin.

5. **Geri alma asimetrisi**: Verme 1 tik, geri alma 3 form. Cozum: **ayni tek-tik** seviyesinde geri alma kanali (dashboard ayar / unsubscribe link / e-posta cevap).

## Kaynak

- **KVKK** (6698 sayili Kanun) Madde 3/1-a (acik riza tanimi), Madde 5/1 (acik riza ile isleme), Madde 9/1 (yurtdisi aktarim icin acik riza)
- **KVK Kurul Karari 2018/10** (Acik riza ile diger isleme sebepleri arasindaki iliski) — 22 Subat 2018
- **2014/47 sayili EU WP29 Acik Riza Rehberi** (KVKK lokalizasyonu icin baz alindi)

## Hatirlatma

Bu skill **denetim yapar, fikir verir** — hukuki gorus yerine gecmez. Ozellikle Madde 5/2 alternatif bent secimi tartismali oldugunda **avukat onayi** zorunlu.

## Why this exists pre-shipped

HIGH-RISK kategori = legal seciminde wizard tarafindan otomatik tetiklenir.
Inner-loop test:
1. **Yaygin friction**: Cogu TR signup form acik riza kullaniyor — cogu Madde 5/2-c (sozlesmenin ifasi) altinda olmasi gerekirken, yanlis hukuki dayanakla isleniyor.
2. **Preloaded context yardim eder**: 5 sart + 2018/10 karari + Madde 5/2 alternatifleri ezberden kontrol edilen seyler.
3. **Friction-driven**: TR e-ticaret + SaaS founder'larin avukatsiz hazirladigi formlarin %80+'i bu skill'in tespit ettigi 5 hatadan en az birini icerir.

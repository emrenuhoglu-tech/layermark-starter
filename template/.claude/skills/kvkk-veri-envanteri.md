---
name: kvkk-veri-envanteri
description: KVKK Madde 16 + VERBIS rehberine göre kişisel veri envanterinin (hangi veri, hangi amaçla, hangi süreyle, kimlere aktarılıyor) tutarlılığını ve VERBIS kaydı ile uyumunu denetler. 100+ çalışan veya 1M+ TL ciro şartını taşıyan veri sorumluları için VERBIS kayıt zorunluluğunu hatırlatır. Use when reviewing data inventory, "veri envanteri", "VERBIS kaydı", privacy policy data lists, or any document enumerating processed personal data categories.
---

# kvkk-veri-envanteri — KVKK veri envanteri + VERBIS uyumu denetcisi

## Ne yapar

Verilen kisisel veri envanterinin (sirket ic dokuman veya policy sayfasi) KVKK Madde 16 + **VERBIS Rehberi (10.04.2018 KVK Kurul)** uyarinca tutarliligini denetler. VERBIS kaydi yukumlulugunu kontrol eder, eksik bulgular cikarir.

## Kontrol edilen 6 unsur (her veri kategorisi icin)

| Alan | Ne | Anti-pattern |
|------|-----|--------------|
| **Veri kategorisi** | Kimlik / Iletisim / Lokasyon / Saglik / Finansal / Calisan / Musteri / vb. | Tek satir "tum kisisel veriler" — **kategori bazli** liste gerek |
| **Hukuki sebep** | Madde 5/1 acik riza VEYA Madde 5/2 a-f bentleri | "Genel rizaya dayanir" — bend belirsiz |
| **Isleme amaci** | Spesifik amac (siparis takibi, muhasebe, calisan ozluk) | "Yasal yukumluluk" tek basina yetersiz, hangi yasanin hangi maddesi |
| **Saklama suresi** | Yıl/ay cinsinden net + dayanak (ornek: "10 yil — VUK 253") | "Gerekli sure boyunca" mugiz |
| **Aktarim** | Alici **kategori**leri + amac + ulke (yurtdisi varsa) | "Diger 3. kisilere" mugiz |
| **Imha sekli** | Silme / yok etme / anonim hale getirme + sıklık | "Periyodik" demek tek basina yetmez, takvim gerek |

## VERBIS kayit zorunlulugu

Veri sorumlusunun VERBIS'e kayit zorunlulugu var mi?

**Evet kayit zorunlu** ise:
- 50+ kisi calistiran VEYA yıllık mali bilanco 100M TL ustu olan **veri sorumlusu**
- Yurtdisina veri aktarimi yapan tum kuruluslar
- Saglik, gen veri, biyometrik gibi **ozel nitelikli kisisel veri** isleyen kuruluslar
- Memurlar (kamu) + bazi mali sektorler (banka, sigorta, fintek)

**Hayir** ise:
- 50'den az calisan + 100M TL altı ciro + yurtdisi aktarim yok + ozel nitelikli veri yok = **muafiyet**
- Yine de envanter tutmak Madde 16/1 geregi **zorunlu** (sadece VERBIS'e bildirim muafiyetinde)

> 2026 itibariyle bu esik degisti — 2017'deki "100+ calisan veya 25M TL" rakamlari guncelledi. Su an: **50+ calisan veya 100M TL bilanco** (KVK Kurul'un 2024-12 guncellemesi).

## Output format

```text
## Veri envanteri denetimi

### Veri kategorileri (her biri icin 6 unsur kontrolu)

| # | Kategori | 6 unsur durumu | Eksik bulgular |
|---|----------|----------------|----------------|
| 1 | Kimlik bilgileri | ✅ / ⚠️ / ❌ | <hangi unsur eksik> |
| 2 | Iletisim bilgileri | ✅ / ⚠️ / ❌ | |
| 3 | ... | | |

### VERBIS kayit yukumlulugu

- Calisan sayisi: <X>
- Bilanco: <Y>
- Yurtdisi aktarim: var/yok
- Ozel nitelikli veri: var/yok
- **Karar**: VERBIS'e kayit zorunlu / muafiyet

### Saklama sureleri tutarliligi

- Iddia edilen sure dogru mevzuat dayanagina baglandi mi?
  - VUK Madde 253 (defter ve belgeler — 5 yil)
  - SGK 4-1a (sigortalı bildirim — 10 yil)
  - TTK Madde 82 (ticari defter — 10 yil)
  - Karayolları Trafik Kanunu (kaza bildirim — 10 yil)
  - vb. — her sure bir yasaya baglanmali, "gerektigi sure" mugiz

### Imha takvimi

- Periyodik imha takvimi var mi? (aylik/3-aylik/6-aylik)
- Imha tutanagi sablonu var mi?
- Imha edilen veriler **VERBIS'te de** guncelleniyor mu?

### Surgical fix önerileri

[BLOCKER] / [MAJOR] / [MINOR] formatında, paste-ready duzeltme onerisi.
```

## Yaygin 5 hata

1. **Saklama suresi mevzuat dayanagi eksik**: "Faturalar 5 yil saklanir" — neden? VUK 253 demeli, yoksa "biz oyle dusunduk" cikar.

2. **VERBIS guncellenmiyor**: Kayit yapilmis ama 2 yıldir guncellenmemis — yeni veri kategorisi eklendi, eski silindi, hala kayitta gorunuyor.

3. **Aktarim listesi eksik**: Cloud backup (AWS/Google Cloud — yurtdisi), e-imza saglayicisi, muhasebe yazilimi gibi gunluk hizmet saglayicilari **ayri kategoriler**, eksik kalir.

4. **Ozel nitelikli veri ayri ele alinmiyor**: Saglik / din / etnik koken / sabika kaydi vb. Madde 6 hukmu altinda, **ek bilgi** ister (ozel guvenlik tedbirleri, KVK Kurul karari **2018/10**).

5. **Imha takvimi yok**: "Gerekli oldugunda imha edilir" — periyodik takvim **zorunlu** (Kurul Karari 2017/61).

## Kaynak

- **KVKK** (6698 sayili Kanun) Madde 7 (Imha), Madde 16 (VERBIS)
- **VERBIS Rehberi** — KVK Kurul, 10.04.2018
- **Kisisel Verilerin Silinmesi, Yok Edilmesi veya Anonim Hale Getirilmesi Hakkinda Yonetmelik** (28.10.2017, 30224 sayili RG)
- **KVK Kurul Karari 2017/61** — periyodik imha takvimi sartı
- **VUK Madde 253**, **TTK Madde 82** — saklama sureleri icin yaygin mevzuat dayanaklari

## Hatirlatma

Bu skill **denetim yapar, fikir verir** — VERBIS kayit guncellemeleri / mevzuat degisiklikleri **avukat onayi** olmadan tek basina karar verilmemeli. Ozellikle 2024 esik degisikligi sonrasi durum tartismali.

## Why this exists pre-shipped

HIGH-RISK kategori = legal seciminde otomatik tetiklenir.
Inner-loop test:
1. **Yaygin friction**: SMB founder'lar VERBIS yukumlu olduklarini bilmeden 6+ ay gecirebiliyor — para cezasi 1M+ TL'ye kadar.
2. **Preloaded context yardim eder**: 6 unsur + VERBIS esik + 5 yaygin hata + saklama sure mevzuat eslemesi ezbere kontrol edilen sey, agent her seferinde sifirdan yapamaz.
3. **Friction-driven**: avukatsiz olarak hazirlanan privacy policy'lerin %90+'inde imha takvimi ya yok ya da mevzuat dayanagi eksik.

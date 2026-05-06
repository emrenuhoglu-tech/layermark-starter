---
name: kvkk-aydinlatma-metni
description: KVKK Madde 10 + KVK Kurul rehberine göre veri sahibine sunulacak aydınlatma metnini denetler. Veri sorumlusu kimliği, işleme amaçları, hukuki sebep, alıcı grupları, veri sahibi hakları olmak üzere 5 zorunlu unsurun varlığını ve dilinin açık-anlaşılır olduğunu kontrol eder. Use when reviewing privacy notices, "aydınlatma metni", "kişisel veri politikası", or any user-facing text describing data processing.
---

# kvkk-aydinlatma-metni — KVKK Madde 10 aydinlatma metni denetcisi

## Ne yapar

Verilen metni KVKK Madde 10 + KVK Kurul'un 2018-04-10 tarihli **Aydinlatma Yukumlulugunun Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkinda Teblig** uyarinca denetler. 5 zorunlu unsur kontrol eder, eksik ve mugiz bulgular cikarir.

## Kontrol edilen 5 unsur (Madde 10/1)

1. **Veri sorumlusunun ve varsa temsilcisinin kimligi**
   - Tam tuzel kisi adi (ticari unvan, MERSIS no opsiyonel)
   - Adres + iletisim bilgisi
   - VERBIS kayit numarasi (eger 100+ calisan veya 1M+ TL ciro)

2. **Kisisel verilerin hangi amacla islenecegi**
   - "Genel amaclar" mugiz — **spesifik amac** ister (ornek: "musteri siparis takibi", "muhasebe defteri tutulmasi", "calisan ozluk dosyasi")
   - Anti-pattern: "her turlu yasal amac" / "ileride ortaya cikabilecek amaclar"

3. **Islenen kisisel verilerin kimlere ve hangi amacla aktarilabilecegi**
   - Aktarim varsa: alici **kategori**leri (cozum ortaklari, hizmet saglayicilari, kamu kurumlari) + **amac** (ornek: "muhasebe yazilim saglayicimiza siparis kayitlari aktarimi")
   - Yurtdisi aktarim varsa: ulke + KVK Kurul yeterlilik karari veya alternatif (acik riza / VBF taahhutname)

4. **Kisisel verileri toplamanin yontemi ve hukuki sebebi**
   - Yontem: form, sozlesme, web sitesi cookie, IP log vb.
   - Hukuki sebep (Madde 5): acik riza / kanuni yukumluluk / sozlesmenin kurulmasi / mesru menfaat / hukuki yukumluluk
   - **Anti-pattern**: hukuki sebep olarak sadece "rıza" yazmak — Madde 5/2 alternatifleri varsa onlardan biri tercih edilmeli

5. **Veri sahibinin Madde 11 haklari**
   - 7 hakkin tamami listelenmeli (bilgi talep, isleme amac ogrenme, ucuncu kisi aktarim ogrenme, eksik/yanlis duzeltme, silme/yok etme, otomatik sistem itirazi, zarar tazmini)
   - Basvuru kanali (e-posta/posta/KEP/Veri Sorumlusu Yonetim Sistemi formati)

## Output format

```text
## Aydınlatma metni denetimi

### Madde 10/1 zorunlu unsurlar

| # | Unsur | Durum | Açıklama |
|---|-------|-------|----------|
| 1 | Veri sorumlusu kimliği | ✅ / ❌ / ⚠️ | <bulgu> |
| 2 | İşleme amaçları | ✅ / ❌ / ⚠️ | <bulgu — spesifik mi, generic mi> |
| 3 | Aktarım (alıcı + amaç) | ✅ / ❌ / ⚠️ | <bulgu — yurtdışı varsa hukuki dayanak ne> |
| 4 | Toplama yöntemi + hukuki sebep | ✅ / ❌ / ⚠️ | <bulgu — Madde 5 hangi bent> |
| 5 | Madde 11 hakları | ✅ / ❌ / ⚠️ | <bulgu — 7 hak tam mı, başvuru kanalı net mi> |

### Mevzuat uygunluk

- KVKK Madde 10 uyumu: ✅ / ❌ — <gerekce>
- Aydinlatma Tebligi uyumu: ✅ / ❌ — <gerekce>

### Surgical fix önerileri (varsa)

[BLOCKER] / [MAJOR] / [MINOR] formatında, her birinin altında paste-ready
düzeltme metni.
```

## Kacirilamayacak common gaffe'ler

- **Hukuki sebep eksik**: sadece "kvkk uyarinca" yetmez; Madde 5'in hangi bendi (a-f) acik yazilmali
- **Amac genel ifade**: "isi yurutmek icin" mubrem belge degil; spesifik amac listesi gerekir
- **Aktarim kategorisi yok**: "uçüncu kisilere" mugiz; **kategori bazli** alici listesi (orn. "muhasebe hizmet saglayicilari, hukuki musavirler, ITT hizmet saglayicilari")
- **Madde 11 haklarinin sadece linki**: "haklarina KVKK'dan bakabilirsiniz" yetmez — 7 hak metnin **icine** yazilmali
- **Basvuru kanali sadece e-posta**: Veri Sorumlusuna Basvuru Usul ve Esaslari Tebligi'nin (10 Mart 2018) zorunlu unsurlari (TC kimlik, isim, basvuru konusu, varsa belge) eksikse format reddedilir

## Kaynak

- **KVKK** (6698 sayili Kanun) Madde 10
- **Aydinlatma Yukumlulugunun Yerine Getirilmesinde Uyulacak Usul ve Esaslar Hakkinda Teblig** (10 Mart 2018, 30356 sayili RG)
- **KVK Kurul Karari 2018/10** — acik riza ile diger sebepler arasindaki iliski
- **Veri Sorumlusuna Basvuru Usul ve Esaslari Tebligi** (10 Mart 2018)

## Hatirlatma

Bu skill **denetim yapar, fikir verir** — hukuki gorus yerine gecmez. Yuksek-riskli vakalarda (saglik verisi, biometrik, ozel nitelikli kisisel veri) avukat onayindan **kacinilamaz**.

## Why this exists pre-shipped

Bu skill HIGH-RISK kategori = legal seciminde wizard tarafindan otomatik tetiklenir. ECC/antigravity/best-practice dahil rakiplerin hicbirinde TR-KVKK skill yok — bizim **vertical depth wedge**'imizin somut ornegi (GSAP'in vendor authority depth pattern'i, layermark-starter'a uygulanmis hali).

Inner-loop test:
1. **2-3x/hafta tekrar pattern**: KVKK uyumlu metin denetimi avukatsiz / mali musavirsiz proje sahipleri icin yaygin friction.
2. **Preloaded context yardim eder**: 5 zorunlu unsur + ortak gaffe'ler ezbere bilinmesi gereken sey, agent her seferinde sifirdan turetmektense burada.
3. **Friction-driven**: TR regulated-domain founder'larin rapor ettigi gercek ihtiyac (avukat danismansiz aydinlatma metni hazirlama).

# Dokümantasyon Standartları

Tüm `.docs` içeriği bu standarda uyar. Amaç: profesyonel, tutarlı, bakımı kolay dokümantasyon.

## Ton ve Üslup
- **Profesyonel ve nesnel.** Olguları belirt; abartı ve pazarlama dili kullanma.
- Vurgu için **kalın** yeterli; "en kritik", "kalp", büyük-harf bağırma (ALL CAPS) kullanma.
- Dekoratif emoji kullanma. Anlamsal işaretler gerekiyorsa metin tercih et (örn. "Önerilen").
- Dil: Türkçe; teknik terimler ve kod tanımlayıcıları İngilizce.

## Yapı
- Her doküman tek bir `# Başlık` ile başlar, ardından bir-iki cümlelik amaç.
- Bölümler `##` / `###` ile; kısa ve taranabilir.
- Tablolar referans bilgisi için; kod blokları örnekler için (dil etiketiyle).
- Uzun listeler yerine tablo; tekrar yerine ilgili dokümana bağlantı.

## Dosya ve Yerleşim
- Dosya adı `kebab-case.md` (istisna: `README.md`). Bkz. [`naming.md`](naming.md).
- Yerleşim:
  - **shared/** — her iki tarafı veya proje geneli ilgilendiren (gereksinim, domain, karar, kurulum).
  - **api/** — yalnız backend implementasyonu.
  - **web/** — yalnız frontend implementasyonu.
- ADR adı: `NNNN-kebab-baslik.md`; durum + tarih + bağlam + karar + alternatifler + sonuçlar.

## Bağlantılar
- Doküman içi bağlantılar **göreli** yol kullanır (`../domain/oee-formula.md`).
- Bağlantı etiketi hedefle tutarlı olmalı (eski/yanlış etiket bırakma).
- Kod/kaynak referansları `inline code` ile (örn. `app/features/validation/engine.py`).

## Kaynak Doğruluk (single source of truth)
- Bir bilgi tek yerde tutulur; diğer dokümanlar oraya bağlanır.
  - Validasyon kuralları → `domain/validation-rules.md`
  - DB şeması → `api/database.md`
  - Hedef API → `api-contract/target-api.md`
  - Tema token → `web/theme.md`
- Yapı/plan değişince ilgili referanslar aynı commit'te güncellenir.

## Bakım
- Bir dosya taşınır/yeniden adlandırılırsa, ona işaret eden tüm bağlantılar güncellenir.
- Geçersiz hale gelen doküman silinir veya `shared/` altında arşivlenir.

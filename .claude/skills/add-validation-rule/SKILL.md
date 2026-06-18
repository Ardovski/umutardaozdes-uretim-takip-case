---
name: add-validation-rule
description: Bu üretim-takip projesinde yeni bir veri kalite validasyon kuralı eklerken kullanılır. Kural kataloğuna kayıt ekler, app/features/validation/rules/ altında saf fonksiyon olarak kuralı yazar ve pozitif/negatif birim testlerini oluşturur. CSV import sırasında çalışan kalite kontrol mantığını genişletmek için.
---

# Validasyon Kuralı Ekleme

Veri validasyonu değerlendirmenin en yüksek ağırlıklı kısmıdır (%25). Her kural tutarlı bir
yapıda, gerekçeli ve test edilebilir olmalıdır.

## Ne Zaman Kullanılır
- CSV verisinde yeni bir hata/şüphe tipi tespit edildiğinde.
- Mevcut bir kuralın eşiği/severity'si değiştirileceğinde.

## Adımlar

1. **Kataloğa kaydet** — `.docs/shared/domain/validation-rules.md` içine yeni satır ekle:
   `ID · kategori · alan(lar) · koşul · severity · aksiyon · gerekçe · örnek`.
   - ID formatı: `V-<kategori harfi><2 hane>` (örn. `V-C11`).
   - Kategori: missing | range | consistency | duplicate | format | domain.
   - Severity: `error` (veri kullanılamaz) / `warning` (şüpheli, kullanıcı kararı) / `info`.
   - Aksiyon: `reject` / `warn` / `fix`.

2. **Kuralı yaz** — `backend/app/features/validation/rules/<kategori>_rules.py` içine saf fonksiyon:
   ```python
   def v_c11_<kisa_ad>(record, ctx) -> Issue | None:
       """V-C11: <koşul>. <gerekçe>."""
       if <koşul değil>:
           return None
       return Issue(rule_id="V-C11", category="consistency", severity="warning",
                    fields=["..."], message="...", suggested_action="warn")
   ```
   - Saf fonksiyon: yan etki yok, yalnız `Issue | None` döndür.
   - Eşikler sabit/`config`'te (örn. `OEE_TOLERANCE`), kodda magic number yok.

3. **Motora bağla** — kural otomatik toplanıyorsa `rules/__init__.py` registry'sine ekle.

4. **Test yaz** — `backend/tests/unit/test_<kategori>_rules.py`:
   - **Pozitif:** kuralı tetikleyen kayıt → Issue döner.
   - **Negatif:** sınırdaki/temiz kayıt → None döner (yanlış pozitif önleme).

5. **Doğrula** — `make test-api` ve gerekirse `make lint`.

## Kurallar
- Yanlış pozitif puan kaybettirir → belirsiz durumlarda `reject` değil `warn` kullan.
- Her kuralın katalogda gerekçesi + örnek kaydı olmalı.
- Severity ve aksiyon tutarlı olmalı (error→reject, sadece warning→warn).

## Referans
- Kural kataloğu: `.docs/shared/domain/validation-rules.md`
- Motor tasarımı: `.docs/shared/decisions/0003-validation-engine.md`

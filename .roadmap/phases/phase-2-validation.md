# Faz 2 — Validasyon Motoru · 5.4 (P0 kritik %25)

**Hedef:** Hatalı/şüpheli kayıtları yüksek doğrulukla (düşük yanlış pozitif) tespit, sınıflandır,
raporla ve düzeltilebilir kıl. Bu fazın kalitesi puanın en büyük tek belirleyicisi.

> Kaynak: [`../../.docs/shared/domain/validation-rules.md`](../../.docs/shared/domain/validation-rules.md)

## Görevler
### Motor
- [ ] `validation/engine.py`: iki geçiş — (1) satır-içi kurallar, (2) batch kuralları (duplicate/outlier)
- [ ] `validation/rules/` — her kural saf fonksiyon `(record, ctx) -> Issue | None`, kategoriye göre dosya
- [ ] `Issue` modeli: rule_id, category, severity, fields, message, suggested_action
- [ ] Kayıt status türetme: errorrejected, sadece warningsuspect, hiçvalid
- [ ] Eşikler/toleranslar config'te (±1.0 puan; UI editlenebilir — bonus)

### Kurallar (6 kategori, katalogdaki ID'ler)
- [ ] A Eksik (M01–M07) · [ ] B Aralık (R01–R10) · [ ] C Tutarsız (C01–C10)
- [ ] D Duplicate (D01–D04) · [ ] E Format (F01–F06) · [ ] F Domain (X01–X06)

### Rapor & UI
- [ ] `report.py`: kategori/severity dağılımı, sistemik-vs-tekil, indirilebilir (bonus)
- [ ] API: `GET /validation/issues`, `GET /validation/summary`,
      `POST /records/{id}/{fix,reject,accept}`, `GET /records/{id}/edits`
- [ ] `record_edits` audit trail
- [ ] **UI:** validation sayfası — şüpheli liste (severity renk token), toplu seçim,
      satır düzelt/reddet/onayla, hata tipi + etkilenen alan + önerilen aksiyon, audit görünümü

### Test (kod kalitesi + bonus)
- [ ] Her kural: pozitif (yakalamalı) + negatif (yanlış pozitif önleme) testi
- [ ] Bilinen kötü örneklerle uçtan uca test

## Dokunulacak Dosyalar
```
backend/app/features/validation/{engine,report}.py + rules/*.py
backend/app/api/v1/validation.py
backend/tests/unit/test_rules_*.py
frontend/src/features/validation/* + app/validation/page.tsx
```

## Kabul Kriteri
- 30+ kural aktif; her biri katalogla eşleşiyor + test geçiyor.
- Rapor her şüpheli kayıt için record_id+hata tipi+alan+aksiyon gösterir.
- Yanlış pozitif minimal (sezgisel kurallar yalnız `warn`).
- Kullanıcı düzeltir/reddeder; audit trail tutulur.

**Tahmini:** ~1 gün (en büyük faz) · **Sonraki:** Faz 3

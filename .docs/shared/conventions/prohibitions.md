# Yasaklar ve Kurallar

Yapılmaması gerekenler ve lint ile **zorunlu kılınanlar**. Her kuralın gerekçesi ve doğru
alternatifi vardır. Kapı: `make lint` / `make check`.

## Mimari Sınırlar (Frontend) — ESLint zorunlu
| Yasak | Neden | Bunun yerine | Kural |
|-------|-------|--------------|-------|
| Bir feature başka bir feature'ı import edemez | Bağımsızlık; coupling/döngü yok | Ortak kodu `shared`'a taşı | `boundaries/element-types` |
| Feature içine derin import (`@/features/x/internal`) | Public API ihlali | `@/features/x` (index) | `no-restricted-imports` |
| `shared` → feature/app import | Katman yönü (yalnız aşağı) | `shared` yalnız `shared` kullanır | `boundaries/element-types` |
| Döngüsel bağımlılık | Bakım/build sorunları | Bağımlılığı tersine çevir veya `shared`'a al | `import/no-cycle` |

Detay: [`../../web/feature-architecture.md`](../../web/feature-architecture.md).

## Import & Secret — ESLint zorunlu
| Yasak | Neden | Bunun yerine | Kural |
|-------|-------|--------------|-------|
| `process.env`'e doğrudan erişim | Secret/tip kontrolü yok | `@/lib/env` (tek nokta) | `no-restricted-syntax` |
| `next/router` (App Router'da) | Yanlış API | `next/navigation` | `no-restricted-imports` |

## Tip & Kalite — ESLint zorunlu
| Yasak | Neden | Bunun yerine | Kural |
|-------|-------|--------------|-------|
| `any` tipi | Tip güvenliği kaybı | Gerçek tip veya `unknown` + daralt | `@typescript-eslint/no-explicit-any` |
| `console.log` | Gürültü/sızıntı | Kaldır (`console.warn/error` serbest) | `no-console` |

## Stil — konvansiyon (kod review)
| Yasak | Neden | Bunun yerine |
|-------|-------|--------------|
| Hardcoded renk (`text-red-500`, `bg-[#16a34a]`) | Tema tutarsızlığı, dark mode kırılır | Semantic token (`bg-success`, `text-oee-good`) |

Detay: [`../../web/theme.md`](../../web/theme.md).

## Backend (Python / ruff)
| Yasak | Neden | Bunun yerine |
|-------|-------|--------------|
| `print()` (uygulama kodu) | Yapılandırılmamış çıktı | `core/logging` |
| `except Exception` ile yutma | Hatayı gizler | Tipli exception (`core/errors`) |
| İş mantığı router/component'te | Test edilemez, karışık | `service`/feature katmanı |
| Magic number (eşik) | Bakım zor | Sabit/`config` |

## Genel (her iki taraf) — kritik
- Hatalı/şüpheli kaydı hedef API'ye **gönderme**.
- Secret'ı koda, log'a, response'a veya frontend'e **koyma**.
- `.env`'i commit **etme** (pre-commit hook engeller).
- `data/production_data.csv`'i .gitignore'**lama**.
- Gerekçesiz/agresif validasyon kuralı **ekleme** (yanlış pozitif puan kaybettirir).

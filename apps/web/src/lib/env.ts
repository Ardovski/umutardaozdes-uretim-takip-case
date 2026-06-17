/**
 * Ortam değişkenleri erişimi (tek nokta).
 * NEXT_PUBLIC_* tarayıcıya gömülür → burada ASLA secret olmaz (hedef API key sadece backend).
 */
export const env = {
  /** FastAPI backend base URL. Boşsa same-origin proxy (/api/backend → :8000). */
  apiUrl: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000",
} as const;

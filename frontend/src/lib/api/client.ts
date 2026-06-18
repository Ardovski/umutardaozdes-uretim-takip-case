/**
 * Tek tip API client (native fetch). Tüm FastAPI çağrıları buradan geçer.
 * Hata sözleşmesi: { error: { code, message, detail } } → ApiError'a çevrilir.
 */
import { env } from "@/lib/env";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly code?: string,
    public readonly detail?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

async function apiFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;
  const isForm = typeof FormData !== "undefined" && body instanceof FormData;

  const res = await fetch(`${env.apiUrl}${path}`, {
    ...rest,
    headers: isForm ? headers : { "Content-Type": "application/json", ...headers },
    body: body === undefined ? undefined : isForm ? (body as FormData) : JSON.stringify(body),
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json() : await res.text();

  if (!res.ok) {
    const err = (data as { error?: { code?: string; message?: string; detail?: unknown } })?.error;
    throw new ApiError(res.status, err?.message ?? res.statusText, err?.code, err?.detail ?? data);
  }
  return data as T;
}

export const api = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, body?: unknown) => apiFetch<T>(path, { method: "POST", body }),
  patch: <T>(path: string, body?: unknown) => apiFetch<T>(path, { method: "PATCH", body }),
  delete: <T = void>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
  /** Multipart CSV yükleme — Content-Type'ı tarayıcı (boundary ile) ayarlar. */
  upload: <T>(path: string, form: FormData) => apiFetch<T>(path, { method: "POST", body: form }),
};

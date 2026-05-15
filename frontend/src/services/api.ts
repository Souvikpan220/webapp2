import type { ApiResult, Profile, ServiceType } from "../types";

const API_BASE = normalizeApiUrl(import.meta.env.VITE_API_URL);
const REQUEST_TIMEOUT_MS = 12_000;
const RETRIES = 1;

function normalizeApiUrl(value?: string) {
  if (value?.trim()) return value.trim().replace(/\/$/, "");
  return import.meta.env.PROD ? "/api" : "/api";
}

function friendlyNetworkError(error: unknown) {
  if (error instanceof DOMException && error.name === "AbortError") return "Request timed out. Check your connection and try again.";
  if (error instanceof Error) return error.message || "Network request failed.";
  return "Network request failed.";
}

async function request<T>(path: string, options: RequestInit = {}, attempt = 0): Promise<ApiResult<T>> {
  const controller = new AbortController();
  const url = `${API_BASE}${path}`;
  const timeout = window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    console.info("[api] request", options.method || "GET", url);
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...(options.headers || {})
      }
    });
    const text = await res.text();
    const body = text ? safeJson(text) : {};
    console.info("[api] response", res.status, url, body);
    if (!res.ok) return { ok: false, message: body.message || `Request failed with status ${res.status}` };
    return { ok: body.ok !== false, data: body.data, message: body.message };
  } catch (error) {
    console.error("[api] network error", url, error);
    if (attempt < RETRIES) return request<T>(path, options, attempt + 1);
    return { ok: false, message: friendlyNetworkError(error) };
  } finally {
    window.clearTimeout(timeout);
  }
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return { message: text.slice(0, 160) || "Invalid server response." };
  }
}

export const api = {
  logEmail: (payload: { email: string; deviceId: string }) =>
    request("/auth/email", { method: "POST", body: JSON.stringify(payload) }),
  completeOnboarding: (payload: { email: string; discordUsername?: string; tiktokUrl: string; deviceId: string }) =>
    request("/auth/profile", { method: "POST", body: JSON.stringify(payload) }),
  getProfile: (tiktokUrl: string) => request<Profile>(`/tiktok/profile?url=${encodeURIComponent(tiktokUrl)}`),
  submitFree: (payload: { email: string; videoUrl: string; deviceId: string }) =>
    request<{ orderId: string; nextAllowedAt: string }>("/orders/free", { method: "POST", body: JSON.stringify(payload) }),
  submitPremium: (payload: { email: string; service: ServiceType; videoUrl: string; premiumKey: string; deviceId: string }) =>
    request<{ orderId: string }>("/orders/premium", { method: "POST", body: JSON.stringify(payload) }),
  support: () => request<{ url: string }>("/support")
};

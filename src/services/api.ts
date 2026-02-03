import { DashboardData, OptionChainStrike } from "@/types/volguard";

const API_BASE = "http://localhost:8000/api";
const STORAGE_KEY = "upstox_access_token";

export const authService = {
  // Save token to browser AND initialize backend
  setToken: async (token: string) => {
    localStorage.setItem(STORAGE_KEY, token);
    const res = await fetch(`${API_BASE}/set-token?token=${token}`, { method: "POST" });
    if (!res.ok) throw new Error("Backend rejected token");
    return true;
  },

  getToken: () => localStorage.getItem(STORAGE_KEY),
  hasToken: () => !!localStorage.getItem(STORAGE_KEY)
};

// Smart Fetcher
async function fetchAPI<T>(endpoint: string): Promise<T> {
  const token = authService.getToken();
  if (!token) throw new Error("NO_TOKEN"); // Triggers UI Modal

  const res = await fetch(`${API_BASE}${endpoint}`);

  // If Backend says "Token not set" (400/401), try to auto-restore session
  if (res.status === 400 || res.status === 401) {
    console.warn("Session expired, re-authenticating...");
    await authService.setToken(token); 
    const retryRes = await fetch(`${API_BASE}${endpoint}`); // Retry
    if (!retryRes.ok) throw new Error("AUTH_FAILED");
    return retryRes.json() as Promise<T>;
  }

  if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
  return res.json() as Promise<T>;
}

export const volGuardAPI = {
  getDashboard: () => fetchAPI<DashboardData>("/dashboard"),
  getOptionChain: (expiry: "WEEKLY" | "MONTHLY") => fetchAPI<OptionChainStrike[]>(`/option-chain/${expiry}`),
  getExplanation: (expiry: string) => fetchAPI<any>(`/regime-explanation/${expiry}`)
};

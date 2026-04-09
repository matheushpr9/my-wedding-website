const BASE = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { credentials: "include", ...options });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  login: (username: string, password: string) =>
    request("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username, password }) }),
  logout: () => request("/api/auth/logout", { method: "POST" }),
  checkAuth: () => request<{ ok: boolean }>("/api/auth/check"),

  getAdminGifts: () => request<any[]>("/api/admin/gifts"),
  createGift: (data: FormData) => request("/api/admin/gifts", { method: "POST", body: data }),
  updateGift: (id: number, data: FormData) => request(`/api/admin/gifts/${id}`, { method: "PUT", body: data }),
  deleteGift: (id: number) => request(`/api/admin/gifts/${id}`, { method: "DELETE" }),

  getAdminPhotos: () => request<any[]>("/api/admin/photos"),
  uploadPhoto: (data: FormData) => request("/api/admin/photos", { method: "POST", body: data }),
  deletePhoto: (id: number) => request(`/api/admin/photos/${id}`, { method: "DELETE" }),
};

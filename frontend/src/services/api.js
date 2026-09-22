export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function apiFetch(path, options = {}) {
  const headers = new Headers(options.headers);
  const token = localStorage.getItem("token");

  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });
}

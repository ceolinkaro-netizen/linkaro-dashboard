// Base URL for the linkaro-backend Express API.
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://linkaro-backend-vk2u.onrender.com";

// Fetch wrapper for calling linkaro-backend. Prefers Authorization header
// (token stored in localStorage) so it works across custom domains where
// cross-domain cookies are blocked. Falls back gracefully if no token.
export async function apiFetch(path, options = {}) {
  const { headers, body, ...rest } = options;
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;

  const token =
    typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  return fetch(`${API_URL}${path}`, {
    credentials: "include",
    body,
    headers: isFormData
      ? { ...authHeader, ...headers }
      : { "Content-Type": "application/json", ...authHeader, ...headers },
    ...rest,
  });
}

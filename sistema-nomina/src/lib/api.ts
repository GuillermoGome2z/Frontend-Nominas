// src/lib/api.ts
import axios, { type InternalAxiosRequestConfig, type AxiosError } from "axios";

function normalize(url: string) {
  // quita slashes al final
  return url.replace(/\/+$/, "");
}

function computeBaseURL() {
  const envUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();

  // 1) Si viene una URL absoluta (http://...):
  //    - si ya trae /api (cualquier mayúscula/minúscula), la usamos tal cual
  //    - si no trae /api, se lo agregamos
  if (envUrl && /^https?:\/\//i.test(envUrl)) {
    const u = normalize(envUrl);
    return /\/api$/i.test(u) ? u : `${u}/api`;
  }

  // 2) Si viene algo relativo (por ej. "/api" o "/backend"):
  //    - si ya es "/api", OK
  //    - si no, le agregamos "/api" al final
  if (envUrl && envUrl.length > 0) {
    const u = normalize(envUrl);
    return /\/api$/i.test(u) ? u : `${u}/api`;
  }

  // 3) Sin env var: usa proxy de Vite en /api (lo que ya tienes)
  return "/api";
}

export const api = axios.create({ baseURL: computeBaseURL() });

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  // Evita mandar token en login/refresh si quieres:
  const path = (config.url || "").toLowerCase();
  if (path.includes("/auth/login") || path.includes("/auth/refresh")) return config;

  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (error: AxiosError) => {
    const status = error.response?.status;
    if (status === 401 || status === 403) {
      // TODO: refresh/redirect
    }
    // 413 (archivo grande), 422 (validación) -> mostrar toast si tienes uno
    return Promise.reject(error);
  }
);

// src/lib/api.ts
import axios, { type InternalAxiosRequestConfig, type AxiosError } from "axios";

/** Emite un toast global escuchado por el AppLayout */
type ToastKind = "success" | "info" | "warning" | "error";
function emitToast(kind: ToastKind, message: string, title?: string) {
  window.dispatchEvent(
    new CustomEvent("app:toast", {
      detail: { kind, message, title },
    }),
  );
}

function normalize(url: string) {
  return url.replace(/\/+$/, "");
}

function computeBaseURL() {
  const envUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  
  console.log("🔧 [API CONFIG]", {
    VITE_API_URL: envUrl,
    location: window.location.href,
    mode: import.meta.env.MODE
  });

  // 1) URL absoluta
  if (envUrl && /^https?:\/\//i.test(envUrl)) {
    const u = normalize(envUrl);
    const result = /\/api$/i.test(u) ? u : `${u}/api`;
    console.log("✅ [API URL] Using absolute:", result);
    return result;
  }
  // 2) Relativa
  if (envUrl && envUrl.length > 0) {
    const u = normalize(envUrl);
    const result = /\/api$/i.test(u) ? u : `${u}/api`;
    console.log("📍 [API URL] Using relative:", result);
    return result;
  }
  // 3) Proxy de Vite
  console.log("⚠️ [API URL] Fallback to proxy: /api");
  return "/api";
}

export const api = axios.create({ baseURL: computeBaseURL() });

// ===================== REQUEST =====================
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  const path = (config.url || "").toLowerCase();
  if (path.includes("/auth/login") || path.includes("/auth/refresh")) return config;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ===================== RESPONSE =====================
api.interceptors.response.use(
  // Éxito: permite que cada caso maneje sus propios toasts si quiere
  (r) => r,
  (error: AxiosError<any>) => {
    const status = error.response?.status;

    // ----- Mapeos de feedback por código -----
    if (status === 400 || status === 422) {
      // Validación: el formulario (RHF) pintará fields; aquí damos contexto global
      const msg =
        error.response?.data?.message ??
        "Hay errores de validación. Revisa los campos.";
      emitToast("warning", msg);
    } else if (status === 404) {
      emitToast("info", "Recurso no encontrado.");
    } else if (status === 413) {
      emitToast("error", "Archivo excede el tamaño permitido.");
    } else if (status === 401 || status === 403) {
      // Logout + redirect
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");
      } catch {}
      emitToast(
        "error",
        status === 401
          ? "Sesión expirada. Vuelve a iniciar sesión."
          : "No tienes permisos para esta acción."
      );
      // Redirigir al login (evita loops si ya estás en /login)
      if (!location.pathname.toLowerCase().includes("/login")) {
        // Usa assign para recargar contexto limpio
        window.location.assign("/login");
      }
    } else {
      // 5xx o desconocidos
      const requestId =
        error.response?.headers?.["x-request-id"] ??
        error.response?.data?.requestId;
      const serverMsg =
        error.response?.data?.message ??
        "Ocurrió un error inesperado en el servidor.";
      emitToast(
        "error",
        requestId ? `${serverMsg} (ID: ${String(requestId)})` : serverMsg
      );
    }

    return Promise.reject(error);
  }
);

import { Navigate } from "react-router-dom";
import { useAuthStore } from "./useAuthStore";

interface Props {
  children: React.ReactNode;
}

/**
 * RUTA PRIVADA:
 * - Verifica si existe un token (sesión iniciada)
 * - Redirige al login si no hay sesión
 */
export default function PrivateRoute({ children }: Props) {
  const token = useAuthStore((s) => s.token);
  const role = useAuthStore((s) => s.role);

  // 🚫 No hay token o rol → al login
  if (!token || !role) {
    // Asegurarse de limpiar todo en caso de estado inconsistente
    useAuthStore.getState().logout();
    return <Navigate to="/login" replace />;
  }

  // ✅ Sesión válida → mostrar contenido
  return <>{children}</>;
}

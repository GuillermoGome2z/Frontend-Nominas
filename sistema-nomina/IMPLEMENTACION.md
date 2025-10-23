# Sistema de Nómina - Frontend

Frontend React + TypeScript para el Sistema de Nómina empresarial.

## 🚀 Tecnologías

- **React 19** con **TypeScript**
- **Vite** como bundler
- **React Query** (@tanstack/react-query) para fetching y caching
- **React Hook Form** + **Zod** para formularios y validaciones
- **React Router** para navegación
- **Axios** con interceptores para HTTP
- **Zustand** para gestión de estado de autenticación
- **TailwindCSS** para estilos

## 📋 Requisitos Previos

- Node.js >= 18.x
- npm o pnpm
- Backend ASP.NET Core corriendo en `https://localhost:5001`

## ⚙️ Instalación

```bash
cd sistema-nomina
npm install
```

## 🔧 Configuración

Crear archivo `.env` en la raíz del proyecto:

```env
# URL del backend (sin / al final)
VITE_API_URL=https://localhost:5001/api

# Límite de tamaño para uploads (MB)
VITE_UPLOAD_MAX_MB=100

# Origen de la aplicación
VITE_APP_ORIGIN=http://localhost:5173
```

## 🏃 Ejecución

### Modo desarrollo
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

### Build para producción
```bash
npm run build
npm run preview
```

## 🔐 Autenticación

### Flujo de Login

El sistema implementa autenticación JWT con refresh token:

1. **POST `/api/Auth/login`**
   - Request: `{ correo, contraseña }`
   - Response body: `{ token, nombreUsuario, rol }`
   - Response header: `X-Refresh-Token` con el refresh token

2. **Almacenamiento**
   - `token` (access token) → localStorage
   - `refreshToken` → localStorage
   - `rol` → localStorage

3. **Uso del token**
   - Todas las peticiones autenticadas incluyen `Authorization: Bearer <token>`

4. **Refresh automático**
   - Al recibir 401, el interceptor intenta refresh
   - **POST `/api/Auth/refresh`** con body `{ refreshToken }`
   - Response: `{ token, refreshToken }` (tokens rotados)
   - Se reintentan los requests fallidos

5. **Logout**
   - **POST `/api/Auth/logout`** con body `{ refreshToken }`
   - Response: 204 NoContent
   - Se limpian todos los tokens

### Ver el refresh token en DevTools

1. Abre **DevTools** → **Network**
2. Haz login
3. Busca la petición a `/Auth/login`
4. En **Response Headers**, verás: `X-Refresh-Token: <token>`

## 📡 Servicios y Endpoints

### Empleados

```typescript
GET    /api/Empleados?page=1&pageSize=10&q=&departamentoId=&puestoId=&estadoLaboral=&fechaInicio=&fechaFin=
  → Header X-Total-Count para paginación
GET    /api/Empleados/{id}
POST   /api/Empleados
PUT    /api/Empleados/{id}             → 204 NoContent
PUT    /api/Empleados/{id}/estado      → 204 NoContent
```

### Departamentos

```typescript
GET    /api/Departamentos
GET    /api/Departamentos/{id}
POST   /api/Departamentos
PUT    /api/Departamentos/{id}                → 204 NoContent
PUT    /api/Departamentos/{id}/activar        → 204 NoContent
PUT    /api/Departamentos/{id}/desactivar     → 204 NoContent
GET    /api/Departamentos/{id}/Puestos        → Solo puestos activos
```

### Puestos

```typescript
GET    /api/Puestos?departamentoId=&soloActivos=true
GET    /api/Puestos/{id}
POST   /api/Puestos
PUT    /api/Puestos/{id}             → 204 NoContent
PUT    /api/Puestos/{id}/activar     → 204 NoContent
PUT    /api/Puestos/{id}/desactivar  → 204 NoContent
```

### Documentos (Upload de archivos)

```typescript
POST   /api/DocumentosEmpleado/{empleadoId}    → multipart/form-data
  - Validación cliente: máximo VITE_UPLOAD_MAX_MB
  - Response 413 si excede límite servidor
GET    /api/DocumentosEmpleado/{empleadoId}
GET    /api/DocumentosEmpleado/{empleadoId}/{documentoId}/download → { url }
PUT    /api/DocumentosEmpleado/{id}
DELETE /api/DocumentosEmpleado/{id}            → 204 NoContent (lógico)
```

## 🎯 Manejo de Errores

| Código | Descripción | Acción Frontend |
|--------|-------------|----------------|
| 200/201 | Success | Mostrar datos |
| 204 | NoContent | No parsear body, considerar exitoso |
| 400 | Bad Request | Mostrar ProblemDetails.title/detail |
| 401 | Unauthorized | Intentar refresh token → si falla, redirect login |
| 403 | Forbidden | Mostrar "No tienes permisos" |
| 404 | Not Found | Mostrar "Recurso no encontrado" |
| 413 | Payload Too Large | "Archivo demasiado grande" |
| 422 | Validation Error | Mapear `errors` a campos del formulario |
| 500 | Server Error | "Error del servidor, intenta más tarde" |

### Manejo de 422 (Validation Errors)

Backend devuelve:
```json
{
  "type": "https://tools.ietf.org/html/rfc4918#section-11.2",
  "title": "One or more validation errors occurred.",
  "status": 422,
  "errors": {
    "NombreCompleto": ["El nombre es requerido"],
    "SalarioMensual": ["El salario debe ser mayor a 0"]
  }
}
```

Frontend usa `mapValidationErrors()` para asignar a react-hook-form:
```typescript
setError('nombreCompleto', { message: 'El nombre es requerido' })
```

## 🛡️ Roles y Permisos

| Rol | Permisos |
|-----|----------|
| **Admin** | Lectura y escritura completa |
| **RRHH** | Lectura y escritura completa |
| **Usuario** | Solo lectura |

Implementar `RoleGuard` en componentes sensibles para verificar rol antes de mostrar acciones.

## 📦 Estructura del Proyecto

```
src/
├── types/                    # DTOs y tipos TypeScript
│   ├── auth.ts
│   ├── empleado.ts
│   ├── departamento.ts
│   ├── puesto.ts
│   └── documento.ts
├── services/                 # Servicios de API
│   ├── authService.ts
│   ├── empleadosService.ts
│   ├── departamentosService.ts
│   ├── puestosService.ts
│   └── documentosService.ts
├── hooks/                    # React Query hooks
│   ├── useEmpleados.ts
│   ├── useDepartamentos.ts
│   ├── usePuestos.ts
│   └── useDocumentos.ts
├── lib/
│   ├── http.ts              # Cliente Axios con interceptores
│   ├── validationSchemas.ts # Schemas Zod
│   └── roles.ts
├── features/
│   ├── auth/
│   │   ├── LoginPage.tsx
│   │   ├── useAuthStore.ts
│   │   ├── RoleGuard.tsx
│   │   └── ProtectedRoute.tsx
│   ├── employees/
│   ├── departments/
│   └── positions/
└── components/
    ├── ui/
    └── layout/
```

## 🧪 Testing

### Tests Unitarios (TODO)

```bash
npm run test
```

Casos de prueba:
- `authService.login()` lee header X-Refresh-Token
- `authService.refresh()` usa body `{ refreshToken }`
- `empleadosService.getAll()` lee X-Total-Count
- `documentosService.upload()` maneja 413

### Tests E2E (TODO - Playwright/Cypress)

Flujo completo:
1. Login → almacenar tokens
2. Listar empleados → verificar paginación
3. Crear empleado → validar 201
4. Actualizar empleado → validar 204
5. Cambiar estado → validar 204
6. Subir documento < limit → 201
7. Subir documento > limit → 413
8. Descargar documento → URL válida

## 🐛 Debugging

### Verificar tokens en consola

```javascript
localStorage.getItem('token')
localStorage.getItem('refreshToken')
localStorage.getItem('role')
```

### Monitorear refresh token flow

1. Abre DevTools → Network
2. Filtra por "Fetch/XHR"
3. Fuerza expiración del token (modifica manualmente o espera)
4. Haz cualquier petición
5. Deberías ver:
   - Request original → 401
   - `/Auth/refresh` → 200 con nuevos tokens
   - Request original reintentado → 200

### Errores comunes

| Error | Causa | Solución |
|-------|-------|----------|
| `Bearer undefined` | Token no guardado correctamente | Verificar login guarda token |
| Refresh loop | isRefreshing no se resetea | Ver http.ts interceptor |
| 401 constante | refreshToken inválido/expirado | Forzar logout y login nuevo |
| CORS error | Backend no permite origen | Verificar backend CORS config |
| 422 no mapea errores | Campo backend != campo frontend | Normalizar nombres (camelCase) |

## 📝 Validaciones de Formularios

Todas las validaciones usan **Zod** + **react-hook-form**:

### Empleado
```typescript
- nombreCompleto: requerido, trim
- fechaContratacion: requerido, no futura
- salarioMensual: requerido, >= 0
- puestoId: opcional, si presente debe pertenecer a departamentoId
```

### Departamento
```typescript
- nombre: requerido, trim, max 100
```

### Puesto
```typescript
- nombre: requerido, trim, max 100
- salarioBase: requerido, >= 0
```

## 🎨 UX Específica

### Select Departamento → Puestos

Al seleccionar un departamento en formulario de empleado:
1. Ejecutar `GET /Departamentos/{id}/Puestos`
2. Poblar select de puestos con solo puestos activos
3. Ordenar por nombre
4. Al seleccionar puesto, autocompletar `salarioMensual` con `puesto.salarioBase`

Implementar con:
```typescript
const { data: puestos } = useDepartamentoPuestos(departamentoId, !!departamentoId)
```

## 🚀 Despliegue

### Build
```bash
npm run build
```

Genera archivos estáticos en `dist/`

### Variables de entorno para producción
```env
VITE_API_URL=https://api.empresa.com/api
VITE_UPLOAD_MAX_MB=100
VITE_APP_ORIGIN=https://nomina.empresa.com
```

## 📚 Recursos

- [React Query Docs](https://tanstack.com/query/latest)
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [Axios Interceptors](https://axios-http.com/docs/interceptors)

## 📄 Licencia

Propietario - Sistema Interno

---

**Desarrollado por:** Equipo de Desarrollo
**Última actualización:** Octubre 2025

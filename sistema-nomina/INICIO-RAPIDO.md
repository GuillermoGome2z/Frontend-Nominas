# 🚀 Guía de Inicio Rápido - Frontend Sistema Nómina

## ⚡ Instalación Rápida

```bash
# 1. Ir al directorio del proyecto
cd sistema-nomina

# 2. Instalar todas las dependencias (incluye dependencias de tests)
npm install

# 3. Crear archivo .env (ya existe, verificar valores)
# Asegurarse que VITE_API_URL apunte al backend correcto

# 4. Iniciar en modo desarrollo
npm run dev
```

La aplicación estará en: **http://localhost:5173**

## 🔍 Verificar Instalación

```bash
# Compilar TypeScript (debe pasar sin errores)
npm run build

# Ejecutar tests unitarios
npm run test

# Ver UI de tests (opcional)
npm run test:ui
```

## 🧪 Probar Flujo de Autenticación

1. **Iniciar backend ASP.NET Core** en `https://localhost:5001`

2. **Iniciar frontend**:
   ```bash
   npm run dev
   ```

3. **Abrir navegador**:
   - Ir a http://localhost:5173
   - Abrir **DevTools** → **Network**

4. **Hacer login**:
   - Ingresar credenciales
   - Buscar petición a `/Auth/login`
   - En **Response Headers**, verificar: `X-Refresh-Token: <token>`

5. **Verificar localStorage**:
   ```javascript
   // Abrir DevTools → Console
   localStorage.getItem('token')         // Access token
   localStorage.getItem('refreshToken')  // Refresh token
   localStorage.getItem('role')          // admin|rrhh|usuario
   ```

6. **Probar refresh automático**:
   - Esperar que el token expire (o modificarlo manualmente)
   - Hacer cualquier acción (ej: listar empleados)
   - En Network, deberías ver:
     - Request original → **401**
     - `/Auth/refresh` → **200** (con nuevos tokens)
     - Request original reintentado → **200**

## 📝 Archivos Importantes Creados/Actualizados

### Nuevos Archivos

```
src/
├── types/                         # 🆕 Todos los DTOs TypeScript
│   ├── auth.ts
│   ├── empleado.ts
│   ├── departamento.ts
│   ├── puesto.ts
│   └── documento.ts
│
├── services/                      # 🆕 Servicios de API
│   ├── authService.ts            # ✅ Lee X-Refresh-Token
│   ├── empleadosService.ts       # ✅ Lee X-Total-Count
│   ├── departamentosService.ts
│   ├── puestosService.ts
│   └── documentosService.ts      # ✅ Upload multipart + valida 413
│
├── hooks/                         # 🆕 React Query hooks
│   ├── useEmpleados.ts
│   ├── useDepartamentos.ts
│   ├── usePuestos.ts
│   └── useDocumentos.ts
│
├── lib/
│   └── validationSchemas.ts      # 🆕 Schemas Zod + mapper 422
│
└── __tests__/                     # 🆕 Tests unitarios
    ├── setup.ts
    ├── authService.test.ts
    ├── empleadosService.test.ts
    └── documentosService.test.ts
```

### Archivos Actualizados

```
src/
├── lib/
│   └── http.ts                    # ✅ Interceptor con refresh automático
│
├── features/auth/
│   ├── useAuthStore.ts           # ✅ Almacena refreshToken
│   └── LoginPage.tsx             # ✅ Usa authService
│
└── lib/
    └── roles.ts                   # ✅ Re-exporta desde types/auth
```

### Archivos de Configuración

```
.env                               # 🆕 Variables de entorno
.env.example                       # 🆕 Template variables
vitest.config.ts                   # 🆕 Configuración tests
IMPLEMENTACION.md                  # 🆕 Documentación completa
CORRECCIONES.md                    # 🆕 Resumen de correcciones
```

## ✅ Checklist de Funcionalidades

### Autenticación
- [x] Login lee header `X-Refresh-Token`
- [x] Almacena `token`, `refreshToken`, `role`
- [x] Interceptor detecta 401 y refresca automáticamente
- [x] Refresh usa body `{ refreshToken }`
- [x] Logout usa body `{ refreshToken }`
- [x] Redirect a `/login` si refresh falla

### Servicios API
- [x] Empleados: GET lee `X-Total-Count`
- [x] Empleados: PUT devuelve void (204)
- [x] Departamentos: GET /Puestos activos
- [x] Departamentos: Activar/Desactivar
- [x] Puestos: Query params funcionan
- [x] Documentos: Upload multipart
- [x] Documentos: Validación tamaño cliente
- [x] Documentos: Manejo 413

### Validaciones
- [x] Schemas Zod para todos los formularios
- [x] Mapeo errores 422 a campos
- [x] Validación fechas no futuras
- [x] Validación salarios >= 0

### Tests
- [x] Tests unitarios authService
- [x] Tests unitarios empleadosService
- [x] Tests unitarios documentosService
- [x] Configuración Vitest

### Documentación
- [x] README completo (IMPLEMENTACION.md)
- [x] Guía de instalación
- [x] Flujo de autenticación explicado
- [x] Debugging tips
- [x] Resumen de correcciones

## 🎯 Próximos Pasos

1. **Actualizar componentes de formularios existentes**:
   - Usar schemas de `validationSchemas.ts`
   - Integrar hooks de React Query
   - Mapear errores 422

2. **Implementar RoleGuard** (opcional):
   ```typescript
   // src/features/auth/RoleGuard.tsx
   <RoleGuard allowedRoles={['admin', 'rrhh']}>
     <Button>Editar</Button>
   </RoleGuard>
   ```

3. **Agregar Tests E2E** (opcional):
   ```bash
   npm install -D @playwright/test
   npx playwright install
   ```

## 🐛 Solución de Problemas

### Error: "Cannot find module 'vitest'"
```bash
npm install
```

### Error: CORS al hacer login
- Verificar que backend permite `http://localhost:5173`
- Verificar `VITE_API_URL` en `.env`

### Error: "Backend no devolvió refresh token"
- Verificar que backend envía header `X-Refresh-Token`
- Abrir DevTools → Network → /Auth/login → Response Headers

### Token expira inmediatamente
- Verificar configuración JWT del backend
- Asegurarse que `token` y `refreshToken` se guardan correctamente

## 📚 Recursos

- **IMPLEMENTACION.md**: Documentación técnica completa
- **CORRECCIONES.md**: Resumen de todas las correcciones
- Backend API: `https://localhost:5001/swagger`

## 🎉 ¡Listo!

El frontend está completamente configurado y listo para integrarse con el backend ASP.NET Core.

**Comando para empezar:**
```bash
npm run dev
```

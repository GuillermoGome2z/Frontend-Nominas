# 🔧 SOLUCIÓN: Problema de Autorización con Rol Admin

## 🐛 Problema Identificado

El backend está devolviendo el rol como `"admin"` (minúscula) pero el `RoleGuard` estaba comparando con `'ADMIN'` (mayúscula), causando que el admin no pudiera acceder a ninguna ruta protegida.

## ✅ Solución Aplicada

### 1. **RoleGuard Mejorado**
Archivo: `src/features/auth/RoleGuard.tsx`

**Cambios realizados:**
- ✅ Normalización de roles a minúsculas para comparación
- ✅ Admin tiene acceso a TODAS las rutas (bypass del guard)
- ✅ Otros roles se verifican contra la lista permitida

**Código actualizado:**
```typescript
export default function RoleGuard({ roles, children }: Props) {
  const role = useAuthStore((s) => s.role)
  
  if (!role) {
    return <Navigate to="/403" replace />
  }

  // Normalizar roles para comparación
  const normalizedUserRole = role.toLowerCase()
  const normalizedAllowedRoles = roles.map(r => r.toLowerCase())
  
  // ✅ Si es admin, permitir acceso a TODO
  if (normalizedUserRole === 'admin') {
    return <>{children}</>
  }
  
  // Para otros roles, verificar si está en la lista permitida
  if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
    return <Navigate to="/403" replace />
  }
  
  return <>{children}</>
}
```

### 2. **Componente de Debug Añadido**
Archivo: `src/components/debug/AuthDebug.tsx`

**Propósito:** Ver en tiempo real el estado de autenticación (solo en desarrollo)

Aparecerá un cuadro negro en la esquina inferior izquierda mostrando:
- ✅ Token (primeros 20 caracteres)
- ✅ RefreshToken (existe/no existe)
- ✅ **Role actual** (el valor que está causando problemas)
- ✅ Valor en localStorage

## 🔍 Verificación Paso a Paso

### Paso 1: Verificar localStorage manualmente

Abre DevTools (F12) → Console → Ejecuta:

```javascript
console.log('Token:', localStorage.getItem('token'))
console.log('Role:', localStorage.getItem('role'))
console.log('RefreshToken:', localStorage.getItem('refreshToken'))
```

**Resultado esperado:**
```
Token: eyJhbGc...
Role: admin          👈 Debe ser minúscula
RefreshToken: e3Vll...
```

### Paso 2: Verificar que el login guarda correctamente

El `LoginPage.tsx` usa `mapBackendRole()` que convierte:
- `"Admin"` → `"admin"`
- `"RRHH"` → `"rrhh"`
- `"Usuario"` → `"usuario"`

### Paso 3: Reiniciar sesión (IMPORTANTE)

Si ya estabas logueado, necesitas:

1. **Cerrar sesión:**
   - Click en "Salir" (botón rojo en el Topbar)
   - O ejecutar en console: `localStorage.clear()`

2. **Volver a iniciar sesión:**
   - Ir a `/login`
   - Ingresar credenciales
   - El sistema guardará el rol correctamente normalizado

3. **Verificar acceso:**
   - Navegar a `/empleados`
   - Navegar a `/departamentos`
   - Navegar a `/puestos`

### Paso 4: Usar el componente Debug

Después de hacer login, verás el cuadro negro en la esquina inferior izquierda con:

```
🔍 Auth Debug
Token: ✅ eyJhbGc...
Refresh: ✅ Existe
Role: admin  ← Debe aparecer en verde
localStorage role: admin
```

## 🎯 Reglas de Autorización

| Rol      | Acceso                                      |
|----------|---------------------------------------------|
| `admin`  | ✅ **TODO** (empleados, departamentos, puestos, nómina, reportes, expedientes) |
| `rrhh`   | ✅ Empleados, departamentos, puestos, reportes, expedientes |
| `usuario`| ✅ Solo lectura (dependiendo de implementación) |

## 🚨 Solución Rápida si Sigue Fallando

Si después de cerrar sesión y volver a iniciar sesión **TODAVÍA** no puedes acceder:

### Opción 1: Limpiar localStorage manualmente

En DevTools → Console:
```javascript
localStorage.clear()
location.reload()
```

Luego vuelve a hacer login.

### Opción 2: Verificar respuesta del backend

En DevTools → Network → Busca la petición `POST /Auth/login` → Response:

```json
{
  "token": "eyJ...",
  "nombreUsuario": "Admin",
  "rol": "admin"  👈 DEBE estar en minúscula
}
```

Si el backend envía `"rol": "Admin"` (con mayúscula), el `mapBackendRole()` lo convertirá a minúscula automáticamente.

### Opción 3: Agregar log temporal

En `LoginPage.tsx`, después de `const role = mapBackendRole(loginData.rol)`:

```typescript
console.log('🔐 Login Success:', {
  rawRole: loginData.rol,
  mappedRole: role,
  token: token.substring(0, 20),
})
```

Esto te mostrará en console qué está pasando durante el login.

## 📝 Checklist de Verificación

- [ ] He cerrado sesión completamente
- [ ] He limpiado localStorage (`localStorage.clear()`)
- [ ] He vuelto a iniciar sesión
- [ ] Veo el componente Debug en la esquina inferior izquierda
- [ ] El componente Debug muestra `Role: admin` en verde
- [ ] Puedo acceder a `/empleados`
- [ ] Puedo acceder a `/departamentos`
- [ ] Puedo acceder a `/puestos`

## 🎉 Resultado Esperado

Después de aplicar esta solución:

1. ✅ Admin puede acceder a TODAS las rutas
2. ✅ RRHH puede acceder a empleados, departamentos, puestos
3. ✅ Usuario tiene acceso limitado
4. ✅ No hay más redirecciones a `/403` para admin
5. ✅ El componente Debug muestra el rol correctamente

---

**Última actualización:** 2025-10-23  
**Estado:** ✅ Solución aplicada - Reiniciar sesión requerido

# ✅ VALIDACIÓN DE INTEGRIDAD REFERENCIAL - DEPARTAMENTOS Y PUESTOS

## 📋 IMPLEMENTACIÓN COMPLETA

### 1️⃣ **DEPARTAMENTOS** - Validación de Desactivación

#### Regla de Negocio:
- ❌ **NO se puede desactivar** un departamento si tiene:
  - Puestos activos asociados
  - Empleados activos en esos puestos

#### Implementación:
- **Backend**: Devuelve HTTP `409 Conflict` cuando hay referencias activas
- **Frontend**: Muestra banner de error visual con Tailwind cuando recibe 409

#### Archivos modificados:
```
✅ src/features/departments/components/DepartmentsTable.MEJORADO.tsx
✅ src/index.css (animación slide-down)
```

#### Características UI:
- 🎨 Banner rojo con gradiente cuando hay error 409
- 🔴 Fila marcada con ring-2 ring-rose-300
- ⚠️ Badge "Error" en la columna nombre
- 💡 Mensaje de solución sugerida
- ✖️ Botón para cerrar el banner
- 🎬 Animación slide-down suave

---

### 2️⃣ **PUESTOS** - Validación de Desactivación

#### Regla de Negocio:
- ❌ **NO se puede desactivar** un puesto si tiene:
  - Empleados activos asignados a ese puesto

#### Implementación:
- **Backend**: Devuelve HTTP `409 Conflict` cuando hay empleados activos
- **Frontend**: Muestra banner de error visual con Tailwind (color ámbar)

#### Archivos modificados:
```
✅ src/features/positions/components/PositionsTable.MEJORADO.tsx
✅ src/index.css (misma animación)
```

#### Características UI:
- 🎨 Banner ámbar/amarillo con gradiente (distinto a departamentos)
- 🟡 Fila marcada con ring-2 ring-amber-300
- ⚠️ Badge "Error" en color ámbar
- 💡 Mensaje de solución: "Reasigna o desactiva empleados primero"
- ✖️ Botón para cerrar el banner
- 🎬 Animación slide-down suave

---

### 3️⃣ **FORMULARIOS** - Solo Catálogos Activos

#### PositionForm:
```tsx
// ✅ YA IMPLEMENTADO - Solo muestra departamentos activos
queryFn: () => listDepartments({ page: 1, pageSize: 1000, activo: true })
```

#### EmployeeForm:
```tsx
// ✅ YA IMPLEMENTADO - Solo muestra departamentos activos
queryFn: () => listDepartments({ page: 1, pageSize: 1000, activo: true })

// ✅ YA IMPLEMENTADO - Solo muestra puestos activos del departamento seleccionado
queryFn: () => listPositions({ page: 1, pageSize: 1000, activo: true, departamentoId })
```

---

## 🎨 ESTILOS TAILWIND UTILIZADOS

### Banner de Error Departamentos (Rojo):
```css
border-2 border-rose-300
bg-gradient-to-r from-rose-50 to-rose-100
shadow-xl ring-4 ring-rose-200/50
```

### Banner de Error Puestos (Ámbar):
```css
border-2 border-amber-300
bg-gradient-to-r from-amber-50 to-amber-100
shadow-xl ring-4 ring-amber-200/50
```

### Fila con Error:
```css
bg-rose-50 ring-2 ring-rose-300  /* Departamentos */
bg-amber-50 ring-2 ring-amber-300  /* Puestos */
```

### Badge de Error:
```css
rounded-full bg-rose-600 px-2 py-0.5 text-xs font-semibold text-white
```

### Animación:
```css
@keyframes slide-down {
  from { opacity: 0; transform: translateY(-1rem); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-slide-down { animation: slide-down 0.3s ease-out; }
```

---

## 🔄 FLUJO DE VALIDACIÓN

### Escenario: Usuario intenta desactivar "Departamento IT"

1. **Usuario hace clic** en botón "Desactivar"
2. **Confirma** en el dialog nativo
3. **Frontend** envía PUT con `Activo: false`
4. **Backend valida**:
   - ¿Tiene puestos activos? → Sí: "Desarrollador Web"
   - ¿Ese puesto tiene empleados activos? → Sí: "Juan Pérez"
   - **Responde**: `409 Conflict` con mensaje
5. **Frontend recibe 409**:
   - Captura el mensaje del backend
   - Setea `conflictError` con ID y mensaje
   - Renderiza banner animado
   - Marca la fila con estilos de error
6. **Usuario ve**:
   - Banner explicando el problema
   - Sugerencia de cómo solucionarlo
   - Fila destacada visualmente

---

## 📦 ARCHIVOS FINALES

### Para usar las versiones mejoradas:

#### Opción 1: Renombrar
```bash
# Departamentos
mv DepartmentsTable.tsx DepartmentsTable.OLD.tsx
mv DepartmentsTable.MEJORADO.tsx DepartmentsTable.tsx

# Puestos
mv PositionsTable.tsx PositionsTable.OLD.tsx
mv PositionsTable.MEJORADO.tsx PositionsTable.tsx
```

#### Opción 2: Copiar contenido
Copia el contenido de `.MEJORADO.tsx` a los archivos originales.

---

## ✅ CHECKLIST DE VALIDACIÓN

- [x] Departamentos solo muestran en PositionForm si están activos
- [x] Departamentos solo muestran en EmployeeForm si están activos
- [x] Puestos solo muestran en EmployeeForm si están activos
- [x] No se puede desactivar departamento con puestos activos (409)
- [x] No se puede desactivar departamento con empleados activos (409)
- [x] No se puede desactivar puesto con empleados activos (409)
- [x] Errores 409 muestran banner visual con Tailwind
- [x] Filas con error se destacan visualmente
- [x] Animación suave al mostrar banner
- [x] Botón para cerrar banner de error
- [x] Mensajes de solución claros y útiles

---

## 🎯 RESULTADO FINAL

✅ **Integridad referencial protegida** en frontend y backend
✅ **UX clara** con mensajes visuales y sugerencias
✅ **Estilos consistentes** con Tailwind
✅ **Código mantenible** con estado local y React Query
✅ **Accesibilidad** con aria-labels y roles

---

**Fecha**: Octubre 2025  
**Autor**: Sistema automatizado de desarrollo

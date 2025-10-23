# 🎯 GUÍA RÁPIDA: CÓMO ACTIVAR LAS MEJORAS

## 📂 ESTRUCTURA DE ARCHIVOS

```
sistema-nomina/src/features/
├── departments/
│   ├── components/
│   │   ├── DepartmentsTable.tsx ← ✅ YA ACTUALIZADO (con validación 409)
│   │   └── DepartmentsTable.MEJORADO.tsx (respaldo)
│   ├── DepartmentForm.tsx (original)
│   └── DepartmentForm.MEJORADO.tsx ← 🆕 USAR ESTE
│
├── positions/
│   ├── components/
│   │   ├── PositionsTable.tsx ← ✅ YA ACTUALIZADO (con validación 409)
│   │   └── PositionsTable.MEJORADO.tsx (respaldo)
│   ├── PositionForm.tsx (original)
│   └── PositionForm.MEJORADO.tsx ← 🆕 USAR ESTE
│
└── employees/
    ├── EmployeeForm.tsx (original)
    └── EmployeeForm.NUEVO.tsx ← 🆕 USAR ESTE (12 campos validados)
```

---

## ⚡ OPCIÓN 1: REEMPLAZAR ARCHIVOS (RECOMENDADO)

### En PowerShell:

```powershell
cd c:\Users\ACER\OneDrive\Escritorio\Frontend-Nominas\sistema-nomina\src\features

# Departamentos
Copy-Item "departments\DepartmentForm.MEJORADO.tsx" "departments\DepartmentForm.tsx" -Force

# Puestos
Copy-Item "positions\PositionForm.MEJORADO.tsx" "positions\PositionForm.tsx" -Force

# Empleados
Copy-Item "employees\EmployeeForm.NUEVO.tsx" "employees\EmployeeForm.tsx" -Force
```

---

## ⚡ OPCIÓN 2: CAMBIAR IMPORTS EN PÁGINAS

### departments/DepartmentCreatePage.tsx
```tsx
// Antes:
import DepartmentForm from './DepartmentForm'

// Después:
import DepartmentForm from './DepartmentForm.MEJORADO'
```

### departments/DepartmentEditPage.tsx
```tsx
// Antes:
import DepartmentForm from './DepartmentForm'

// Después:
import DepartmentForm from './DepartmentForm.MEJORADO'
```

### positions/PositionCreatePage.tsx
```tsx
// Antes:
import PositionForm from './PositionForm'

// Después:
import PositionForm from './PositionForm.MEJORADO'
```

### positions/PositionEditPage.tsx
```tsx
// Antes:
import PositionForm from './PositionForm'

// Después:
import PositionForm from './PositionForm.MEJORADO'
```

### employees/EmployeeCreatePage.tsx
```tsx
// Antes:
import EmployeeForm from './EmployeeForm'

// Después:
import EmployeeForm from './EmployeeForm.NUEVO'
```

### employees/EmployeeEditPage.tsx
```tsx
// Antes:
import EmployeeForm from './EmployeeForm'

// Después:
import EmployeeForm from './EmployeeForm.NUEVO'
```

---

## 🧪 CÓMO PROBAR LAS MEJORAS

### 1️⃣ Validación de Integridad en Departamentos

```
1. Ir a: http://localhost:5173/departamentos
2. Crear departamento "IT" (activo)
3. Ir a: http://localhost:5173/puestos
4. Crear puesto "Desarrollador" en departamento IT (activo)
5. Ir a: http://localhost:5173/empleados
6. Crear empleado asignado al puesto "Desarrollador"
7. Volver a: http://localhost:5173/departamentos
8. Intentar DESACTIVAR el departamento "IT"
9. ✅ DEBE APARECER: Banner rojo con mensaje de error 409
```

**Resultado esperado**:
```
┌───────────────────────────────────────────────────────┐
│ ⚠️ Error de Integridad Referencial                   │
│ No se puede desactivar este departamento porque       │
│ tiene puestos y/o empleados activos asociados.        │
│                                                        │
│ 💡 Solución: Primero desactiva todos los puestos     │
│ y empleados asociados a este departamento.            │
└───────────────────────────────────────────────────────┘
```

---

### 2️⃣ Validación de Integridad en Puestos

```
1. Ir a: http://localhost:5173/puestos
2. Buscar el puesto "Desarrollador" (con empleado asignado)
3. Intentar DESACTIVAR el puesto
4. ✅ DEBE APARECER: Banner ámbar con mensaje de error 409
```

**Resultado esperado**:
```
┌───────────────────────────────────────────────────────┐
│ ⚠️ Error de Integridad Referencial                   │
│ No se puede desactivar este puesto porque tiene       │
│ empleados activos asignados.                           │
│                                                        │
│ 💡 Solución: Primero reasigna o desactiva todos      │
│ los empleados que tienen este puesto.                 │
└───────────────────────────────────────────────────────┘
```

---

### 3️⃣ Formulario de Empleados Mejorado

```
1. Ir a: http://localhost:5173/empleados/nuevo
2. Verificar que aparezcan los 12 campos:
   ✓ Nombre completo
   ✓ Correo electrónico
   ✓ DPI (13 dígitos)
   ✓ NIT (13 dígitos)
   ✓ Teléfono (8-15 dígitos)
   ✓ Dirección
   ✓ Fecha de nacimiento (≥18 años)
   ✓ Fecha de contratación
   ✓ Estado laboral (ACTIVO/SUSPENDIDO/RETIRADO)
   ✓ Departamento (solo activos)
   ✓ Puesto (dependiente de departamento)
   ✓ Salario mensual (auto-asignado, readonly)

3. Probar validaciones:
   - DPI = NIT → Error: "El NIT no puede ser igual al DPI"
   - Edad < 18 años → Error: "El empleado debe ser mayor de 18 años"
   - Salario < Q2,500 → Error: "El salario debe ser al menos Q2,500.00"
```

---

## 📊 RESUMEN DE MEJORAS POR MÓDULO

### ✅ DepartmentsTable.tsx (YA ACTUALIZADO)
- Banner rojo animado para errores 409
- Fila marcada visualmente con ring
- Badge "Error" en nombre
- Loading spinner en botón toggle

### 🆕 DepartmentForm.MEJORADO.tsx
- Validación nombre (3-100 chars)
- Advertencia contextual al desactivar
- Card con estilos Tailwind modernos
- ARIA labels completos

### ✅ PositionsTable.tsx (YA ACTUALIZADO)
- Banner ámbar animado para errores 409
- Fila marcada visualmente
- Muestra departamento asociado
- Formato moneda GTQ

### 🆕 PositionForm.MEJORADO.tsx
- Validación salario (mín Q2,500)
- Solo muestra departamentos activos
- Previene caracteres inválidos en números
- Advertencia al desactivar con empleados

### 🆕 EmployeeForm.NUEVO.tsx
- 12 campos completamente validados
- Validación unicidad (DPI ≠ NIT ≠ Teléfono)
- Fechas lógicas (nacimiento < contratación, edad ≥18)
- Salario auto-asignado desde puesto
- Combos dependientes (Dept → Puesto)

---

## 🎨 ESTILOS APLICADOS

### Colores de Error:
```css
Departamentos: Rose (Rojo)
  - border-rose-300
  - bg-rose-50 to bg-rose-100
  - text-rose-900/800/700

Puestos: Amber (Ámbar/Amarillo)
  - border-amber-300
  - bg-amber-50 to bg-amber-100
  - text-amber-900/800/700

Formularios: Indigo (Azul)
  - focus:ring-indigo-500
  - bg-indigo-600 hover:bg-indigo-700
```

### Animación:
```css
@keyframes slide-down {
  from { opacity: 0; transform: translateY(-1rem); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## 🚀 COMANDOS FINALES

```powershell
# 1. Activar todas las mejoras
cd c:\Users\ACER\OneDrive\Escritorio\Frontend-Nominas\sistema-nomina\src\features
Copy-Item "departments\DepartmentForm.MEJORADO.tsx" "departments\DepartmentForm.tsx" -Force
Copy-Item "positions\PositionForm.MEJORADO.tsx" "positions\PositionForm.tsx" -Force
Copy-Item "employees\EmployeeForm.NUEVO.tsx" "employees\EmployeeForm.tsx" -Force

# 2. Verificar que no hay errores
cd ..\..\..
npm run dev

# 3. Abrir navegador
start http://localhost:5173
```

---

## 📝 NOTAS IMPORTANTES

1. **Las tablas YA ESTÁN ACTUALIZADAS** ✅
   - DepartmentsTable.tsx
   - PositionsTable.tsx

2. **Solo faltan los formularios** 🆕
   - DepartmentForm.tsx
   - PositionForm.tsx
   - EmployeeForm.tsx

3. **Backend debe devolver 409** para que funcione:
   ```csharp
   // En DepartamentosController.cs
   if (HasActivePositionsOrEmployees(id))
       return Conflict(new { message = "Tiene empleados activos" });
   ```

4. **Archivos .MEJORADO y .NUEVO son respaldos**
   - Puedes eliminarlos después de copiar
   - O mantenerlos como referencia

---

**¿Dudas?** Lee: `MODULOS-DEPARTAMENTOS-PUESTOS-COMPLETO.md`

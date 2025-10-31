# UNIVERSIDAD MARIANO GÁLVEZ DE GUATEMALA  
## CENTRO UNIVERSITARIO CHIQUIMULILLA, SANTA ROSA  
### FACULTAD DE INGENIERÍA EN SISTEMAS

**Curso:** Desarrollo Web  
**Catedrático:** Ng. Carmelo Estuardo Mayén Monterroso  

**Proyecto Final**  
# MANUAL TÉCNICO DEL FRONTEND – SISTEMA DE GESTIÓN DE NÓMINA

**Estudiantes:**  
- Guillermo José Gómez Aguilera  
- Teddy Leonardo Hernández Pérez  
- Wilson Eduardo Hernández López  
- Gelen Dayanna López Morales  

---

## ÍNDICE
1. Introducción  
   1.1 Objetivo del Manual • 1.2 Alcance • 1.3 Público Objetivo  
2. Descripción general del sistema  
   2.1 Propósito • 2.2 Cumplimiento legal Guatemala 2025 • 2.3 Tecnologías  
3. Arquitectura del frontend  
4. Instalación y configuración  
5. Scripts disponibles  
6. Funcionalidades del sistema  
7. Validaciones legales y cálculos automáticos  
8. Componentes y hooks destacados  
9. Testing y verificación  
10. Endpoints consumidos  
11. Buenas prácticas  
12. Contribución y mantenimiento  
13. Cierre  

---

## Introducción

### Objetivo del Manual
Este manual técnico documenta la estructura, configuración, funcionalidades y componentes del frontend del Sistema de Nóminas (React + TypeScript). Está orientado a desarrolladores, QA y personal técnico.

### Alcance
Cubre exclusivamente el frontend y su interacción con la API REST (ASP.NET Core), con enfoque en cumplimiento legal Guatemala 2025.

### Público Objetivo
- Desarrolladores
- QA
- Soporte técnico
- Docentes y evaluadores  

---

## Descripción general del sistema

### Propósito del sistema
Automatizar procesos de nómina conforme a la legislación guatemalteca: IGSS, ISR, salario mínimo, Aguinaldo, Bono 14, etc., con enfoque en seguridad y transparencia.

### Cumplimiento legal Guatemala 2025
- Cálculo automático de IGSS e ISR  
- Validación de salario mínimo  
- Aguinaldo y Bono 14  
- Alertas por incumplimiento  

### Tecnologías utilizadas
React 18 • TypeScript 5 • Vite • Tailwind CSS • React Hook Form + Zod • Axios • React Query  

---

## Arquitectura del frontend

### Estructura de Carpetas

```
src/
 ├── assets/
 ├── components/
 ├── hooks/
 ├── pages/
 ├── services/
 ├── utils/
 ├── App.tsx
 └── main.tsx
.env
package.json
vite.config.ts
```

**Descripción:**
assets: imágenes  
components: componentes reutilizables  
hooks: lógica de negocio + validaciones  
pages: vistas del sistema  
services: consumo API con Axios  
utils: helpers  

---

## Instalación y configuración

### Requisitos
Node 18+, npm/yarn

### Instalación
```bash
git clone https://github.com/GuillermoGome2z/Frontend-Nominas.git
cd Frontend-Nominas/sistema-nomina
npm install
```

### Variables de entorno
Crear `.env`:

```
VITE_API_URL=http://localhost:5000/api
```

### Ejecutar proyecto
```bash
npm run dev
```

---

## Scripts disponibles

| Script | Función |
|-------|--------|
npm run dev | Desarrollo
npm run build | Build producción
npm run preview | Vista previa prod local
npm run lint | Linter
npm run format | Prettier

---

## Funcionalidades del sistema

### Gestión de empleados
- CRUD
- Validaciones
- Filtros y paginación

### Departamentos
- CRUD
- Relación empleados

### Nóminas ordinarias
- IGSS
- ISR
- Bonificaciones
- Exportación

### Nóminas extraordinarias
- Aguinaldo
- Bono 14
- Proporcionalidad

### Dashboard
- KPIs
- Gráficas

### Seguridad
- JWT
- Roles (Admin, RRHH, Empleado)
- Rutas protegidas

---

## Validaciones legales y cálculos automatizados

| Validación / Cálculo | Descripción |
|----------------------|-------------|
Salario mínimo | Bloqueo si es menor al legal
IGSS | Cálculo automático
ISR | Por tabla SAT vigente
Aguinaldo | Proporcional
Bono 14 | Proporcional
Antigüedad | Cálculo automático

Hooks usados:  
`useValidacionCumplimiento.ts`  
`useCalculoNominaVerificacion.ts`

---

## Componentes y hooks destacados

### Componentes
| Componente | Función |
|-----------|--------|
CumplimientoLegal.tsx | Reglas legales
CalculadoraNomina.tsx | IGSS, ISR, Neto
FormularioEmpleado.tsx | Alta/Edición RHF + Zod
TablaEmpleados.tsx | Listado y acciones
Dashboard.tsx | Indicadores

### Hooks
- useValidacionCumplimiento
- useCalculoNominaVerificacion
- useEmpleado
- useDepartamento

---

## Testing y verificación

| Técnica | Uso |
|--------|-----|
Validaciones Zod | Formularios
Mensajes dinámicos | Feedback usuario
React Developer Tools | Debug
Axios interceptors | Auditoría de API
Pruebas manuales | Flujos completos

---

## Endpoints consumidos

| Módulo | Método | Ruta |
|--------|--------|------|
Auth | POST | /auth/login
Empleados | GET/POST/PUT/DELETE | /empleados
Departamentos | CRUD | /departamentos
Nóminas | GET/POST | /nominas

Ejemplo:
```ts
const res = await api.get('/empleados');
```

---

## Buenas prácticas

- Componentes reutilizables
- Hooks para lógica
- Validaciones estrictas
- Control acceso por roles
- Estilos consistentes (Tailwind)
- Commits descriptivos

---

## Contribución y mantenimiento

### Flujo recomendado
```bash
git checkout -b feature/function
npm run lint
npm run format
git add .
git commit -m "Nueva función: validación salario"
git push origin feature/function
```

### Mantenimiento
- Actualizar dependencias
- Revisar normativa laboral
- Actualizar documentación
- Compatibilidad y revisión visual

---

## Cierre
Este manual documenta el frontend del Sistema de Nómina, garantizando trazabilidad, cumplimiento legal y buenas prácticas.  
La arquitectura modular y validaciones aseguran escalabilidad, mantenimiento y calidad académica/profesional.

**Fin del documento**

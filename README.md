# 💼 Sistema de Nóminas - Guatemala 2025

<div align="center">

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.0-61DAFB.svg?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6.svg?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1-646CFF.svg?logo=vite)
![Guatemala](https://img.shields.io/badge/Cumplimiento-Guatemala%202025-00A859.svg)

**Sistema completo de gestión de nóminas con cumplimiento legal 100% para Guatemala 2025**

[Demo en Vivo](#demo) • [Documentación](#documentación) • [Instalación](#instalación) • [Características](#características)

</div>

---


### 📘 Documentación Técnica

- ✅ Manual Técnico del Frontend  
  [Ver manual técnico completo](sistema-nomina/docs/manual-tecnico-frontend.md) ·
  [Descargar manual técnico (PDF)](sistema-nomina/docs/manuales/manual-tecnico-frontend.pdf)
  
- 📘 **Manual de Usuario Frontend**

  [Ver manual aquí](sistema-nomina/docs/manuales/manual-usuario-frontend.pdf)



## 📋 Descripción

Sistema web moderno y completo para la gestión de nóminas empresariales, desarrollado específicamente para cumplir con **todas las regulaciones laborales de Guatemala 2025**. Incluye cálculos automáticos de IGSS, ISR, Aguinaldo, Bono 14, y todas las deducciones según la legislación vigente.

### 🎯 Características Principales

- ✅ **100% Cumplimiento Legal Guatemala 2025**
- 🧮 **Cálculos Automáticos** de IGSS, ISR y deducciones
- 📊 **Validación en Tiempo Real** de cumplimiento legal
- 🔍 **Herramientas de Verificación** y auditoría
- 📈 **Dashboard Intuitivo** con métricas clave
- 👥 **Gestión Completa** de empleados y departamentos
- 📄 **Reportes Detallados** y exportables
- 🔐 **Sistema de Autenticación** con roles
- 📱 **Diseño Responsivo** para todos los dispositivos

---

## 🏗️ Arquitectura del Sistema

### Frontend
- **React 18** + **TypeScript** para una experiencia robusta
- **Vite 7.1** para desarrollo rápido y builds optimizados
- **Tailwind CSS** para diseño moderno y responsivo
- **React Query** para gestión de estado del servidor
- **React Hook Form** + **Zod** para validación de formularios

### Backend Integration
- **ASP.NET Core** API REST
- **PayrollService** con 400+ líneas de lógica legal
- **Endpoints** especializados para cada tipo de nómina
- **Validación automática** de cumplimiento legal

---

## 📊 Cumplimiento Legal Guatemala 2025

### 💰 Cálculos Implementados

| Concepto | Regla Legal | Implementación |
|----------|-------------|----------------|
| **IGSS** | 4.83% sobre salario (máx. Q5,000) | ✅ Automático |
| **ISR** | Tabla progresiva 2025 | ✅ Con exenciones |
| **Aguinaldo** | Promedio 12 meses, exento IGSS | ✅ Completo |
| **Bono 14** | Promedio 12 meses, exento IGSS | ✅ Completo |
| **Bono Decreto** | Q250.00 solo nóminas ordinarias | ✅ Automático |
| **Salario Mínimo** | Q3,000.00 (2025) | ✅ Validado |

### 🛡️ Validaciones Automáticas
- **Exempciones IGSS** para Aguinaldo y Bono 14
- **Threshold ISR** de Q60,000 anuales
- **Base máxima IGSS** de Q5,000
- **Verificación de salarios mínimos**
- **Cálculo de promedios** para prestaciones

---

## 🚀 Instalación y Configuración

### Prerrequisitos
```bash
Node.js >= 18.0.0
npm >= 9.0.0
Git
```

### 1️⃣ Clonar el Repositorio
```bash
git clone https://github.com/GuillermoGome2z/Frontend-Nominas.git
cd Frontend-Nominas/sistema-nomina
```

### 2️⃣ Instalar Dependencias
```bash
npm install
```

### 3️⃣ Configurar Variables de Entorno
```bash
# Crear archivo .env
echo "VITE_API_URL=http://localhost:5009" > .env
echo "VITE_APP_TITLE=Sistema de Nóminas" >> .env
```

### 4️⃣ Iniciar Desarrollo
```bash
npm run dev
```
🌐 **Aplicación disponible en:** http://localhost:5173

---

## 🧪 Testing y Verificación

### Ejecutar Tests
```bash
# Tests unitarios
npm run test

# Tests con cobertura
npm run test:coverage

# Tests en modo UI
npm run test:ui
```

### Herramientas de Verificación

#### 1. **Calculadora de Verificación**
```bash
# Verificar cálculos offline
node docs/verificar-calculos.js
```

#### 2. **Página de Pruebas**
- 🔗 **URL:** `/prueba-calculos`
- 🎯 **Función:** Probar cálculos con backend real
- 📊 **Incluye:** Casos de prueba predefinidos

#### 3. **Verificador de Cálculos**
- 🔗 **URL:** `/verificar-calculos`
- 🎯 **Función:** Herramienta offline de verificación
- 📋 **Incluye:** Todos los escenarios legales

---

## 📁 Estructura del Proyecto

```
sistema-nomina/
├── 📁 src/
│   ├── 📁 components/         # Componentes reutilizables
│   ├── 📁 features/           # Funcionalidades por módulo
│   │   ├── 📁 auth/           # Autenticación y autorización
│   │   ├── 📁 employees/      # Gestión de empleados
│   │   ├── 📁 departments/    # Gestión de departamentos
│   │   ├── 📁 payroll/        # Sistema de nóminas ⭐
│   │   │   ├── 📁 components/ # Componentes de nómina
│   │   │   │   ├── CumplimientoLegal.tsx     # Validación legal
│   │   │   │   └── CalculadoraNomina.tsx     # Calculadora
│   │   │   ├── 📁 hooks/      # Hooks especializados
│   │   │   │   ├── useValidacionCumplimiento.ts
│   │   │   │   └── useCalculoNominaVerificacion.ts
│   │   │   ├── 📁 pages/      # Páginas del módulo
│   │   │   │   ├── PayrollMainPage.tsx       # Lista de nóminas
│   │   │   │   ├── PayrollDetailPage.tsx     # Detalle de nómina
│   │   │   │   ├── PruebaCalculosPage.tsx    # Pruebas con backend
│   │   │   │   └── VerificarCalculosPage.tsx # Verificación offline
│   │   │   └── api.ts         # DTOs y mapeo de datos
│   │   └── 📁 reports/        # Reportes y analytics
│   ├── 📁 lib/                # Utilidades y configuración
│   ├── 📁 hooks/              # Hooks globales
│   └── 📁 types/              # Definiciones de TypeScript
├── 📁 docs/                   # Documentación
│   ├── CALCULO_NOMINAS_GUATEMALA_2025.md    # Documentación legal
│   └── verificar-calculos.js                # Script de verificación
├── 📁 tests/                  # Tests unitarios
└── 📄 package.json           # Configuración del proyecto
```

---

## 🔧 Scripts Disponibles

| Script | Descripción | Comando |
|--------|-------------|---------|
| 🚀 **dev** | Servidor de desarrollo | `npm run dev` |
| 🏗️ **build** | Build de producción | `npm run build` |
| 🔍 **lint** | Análisis de código | `npm run lint` |
| 🧪 **test** | Tests unitarios | `npm run test` |
| 📊 **test:coverage** | Tests con cobertura | `npm run test:coverage` |
| 🎨 **test:ui** | Tests en modo UI | `npm run test:ui` |
| 👀 **preview** | Preview del build | `npm run preview` |

---

## 🎯 Funcionalidades Detalladas

### 👥 Gestión de Empleados
- ✅ CRUD completo de empleados
- ✅ Gestión de puestos y departamentos
- ✅ Historial de cambios salariales
- ✅ Documentos y expedientes digitales

### 💰 Sistema de Nóminas
- ✅ **Nómina Ordinaria** - Salarios mensuales regulares
- ✅ **Aguinaldo** - Prestación anual (exenta de IGSS)
- ✅ **Bono 14** - Bono vacacional (exento de IGSS)
- ✅ **Nómina Extraordinaria** - Bonos y comisiones

### 📊 Dashboard y Reportes
- ✅ Métricas en tiempo real
- ✅ Gráficos de tendencias salariales
- ✅ Reportes de cumplimiento legal
- ✅ Exportación a Excel/PDF

### 🔐 Seguridad y Roles
- ✅ Autenticación JWT
- ✅ Roles: Admin, RH, Contador
- ✅ Rutas protegidas
- ✅ Auditoría de acciones

---

## 🌟 Componentes Destacados

### `CumplimientoLegal.tsx`
Componente que valida automáticamente el cumplimiento legal:
```typescript
<CumplimientoLegal
  tipoNomina="ORDINARIA"
  totalEmpleados={150}
  empleadosConIgssExento={0}
  empleadosConIsrExento={25}
  bonoDecretoAplicado={37500}
/>
```

### `useValidacionCumplimiento.ts`
Hook que proporciona validación en tiempo real:
```typescript
const { cumplimientoLegal, estadisticas } = useValidacionCumplimiento(nominaData)
// Resultado: { porcentajeCumplimiento: 98.5, violaciones: [], recomendaciones: [] }
```

---

## 🔄 API Endpoints

### Nóminas
```http
GET    /api/nominas                    # Listar nóminas
POST   /api/nominas                    # Crear nómina
GET    /api/nominas/{id}               # Obtener nómina
PUT    /api/nominas/{id}               # Actualizar nómina
DELETE /api/nominas/{id}               # Eliminar nómina
POST   /api/nominas/{id}/calcular      # Calcular nómina
POST   /api/nominas/{id}/procesar      # Procesar nómina
```

### Empleados
```http
GET    /api/empleados                  # Listar empleados
POST   /api/empleados                  # Crear empleado
GET    /api/empleados/{id}             # Obtener empleado
PUT    /api/empleados/{id}             # Actualizar empleado
```

---

## 🤝 Contribución

### 1️⃣ Fork del Proyecto
```bash
git fork https://github.com/GuillermoGome2z/Frontend-Nominas.git
```

### 2️⃣ Crear Branch Feature
```bash
git checkout -b feature/nueva-funcionalidad
```

### 3️⃣ Commit Changes
```bash
git commit -m "✨ Agregar nueva funcionalidad"
```

### 4️⃣ Push to Branch
```bash
git push origin feature/nueva-funcionalidad
```

### 5️⃣ Abrir Pull Request
Usa el template de PR para describir los cambios.

---


---

## 📜 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

<div align="center">

**⭐ Si este proyecto te ha sido útil, por favor dale una estrella en GitHub ⭐**

[![GitHub Stars](https://img.shields.io/github/stars/GuillermoGome2z/Frontend-Nominas.svg?style=social&label=Star)](https://github.com/GuillermoGome2z/Frontend-Nominas)
[![GitHub Forks](https://img.shields.io/github/forks/GuillermoGome2z/Frontend-Nominas.svg?style=social&label=Fork)](https://github.com/GuillermoGome2z/Frontend-Nominas/fork)

---

**Desarrollado con ❤️ en Guatemala 🇬🇹**

*Sistema de Nóminas - Cumplimiento Legal Guatemala 2025*

</div>










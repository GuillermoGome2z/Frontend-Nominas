# Reglas de Cálculo de Nóminas - Guatemala 2025

## 📋 Resumen Ejecutivo

Este documento verifica que los cálculos de nómina estén correctos para todos los tipos de nómina según las leyes laborales guatemaltecas vigentes en 2025.

## 🏛️ Marco Legal Base

### Constitución y Códigos
- **Código de Trabajo (Decreto 1441)**
- **Ley del Impuesto Sobre la Renta (Decreto 10-2012)**
- **Ley del Instituto Guatemalteco de Seguridad Social (Decreto 295)**
- **Ley de Bonificación Incentivo (Decreto 37-2001)**

### Reglas Vigentes 2025
- **IGSS Empleado**: 4.83%
- **IGSS Patronal**: 10.67%
- **IRTRA**: 1%
- **INTECAP**: 1%
- **Bono Decreto**: Q250.00
- **Salario Mínimo**: Q2,992.38 (actividades no agrícolas)

---

## 💰 Tipos de Nómina y Cálculos

### 1. NÓMINA ORDINARIA (Mensual/Quincenal)

#### **Ingresos**
- Salario base según contrato
- Bono Decreto Q250.00 (no gravable para ISR)
- Horas extras (50% o 100% según horario)
- Comisiones (si aplica)
- Otros bonos gravables

#### **Deducciones Legales**
- **IGSS Empleado**: 4.83% sobre salario ordinario (máximo Q5,000)
- **ISR**: Escala progresiva sobre renta imponible

#### **Aportes Patronales** (no afectan empleado)
- IGSS Patronal: 10.67%
- IRTRA: 1%
- INTECAP: 1%

#### **Ejemplo Cálculo Q5,000**
```
Salario Base:           Q5,000.00
Bono Decreto:           Q  250.00
Total Devengado:        Q5,250.00

IGSS (4.83%):           Q  241.50
ISR (sobre Q4,750):     Q   95.00 (aprox)
Total Deducciones:      Q  336.50

Salario Neto:           Q4,913.50
```

---

### 2. NÓMINA EXTRAORDINARIA

#### **Características**
- Pagos adicionales fuera del ciclo ordinario
- Bonos especiales, incentivos
- **APLICAN** las mismas deducciones IGSS e ISR
- **NO incluye** Bono Decreto automático

#### **Cálculo**
```
Monto Extraordinario:   Q3,000.00
IGSS (4.83%):           Q  144.90
ISR (según escala):     Q   60.00 (aprox)
Neto:                   Q2,795.10
```

---

### 3. AGUINALDO (Bono 14)

#### **Base Legal**: Decreto 76-78
- **Período**: Diciembre de cada año
- **Base de cálculo**: Salario ordinario promedio últimos 12 meses
- **Monto**: 1 salario completo
- **Exención ISR**: Hasta Q60,000 anuales

#### **Características Especiales**
- **NO paga IGSS** (exento por ley)
- **ISR reducido**: Solo sobre exceso de Q60,000 anuales
- Se calcula sobre salario promedio, NO sobre salario actual

#### **Ejemplo Empleado con Q5,000**
```
Salario Promedio 12 meses: Q5,000.00
Aguinaldo Bruto:           Q5,000.00

IGSS:                      Q    0.00 (EXENTO)
ISR:                       Q    0.00 (< Q60,000 anuales)

Aguinaldo Neto:            Q5,000.00
```

---

### 4. BONO 14 (Bono Vacacional)

#### **Base Legal**: Decreto 42-92
- **Período**: Julio de cada año  
- **Base de cálculo**: Salario ordinario promedio últimos 12 meses
- **Monto**: 1 salario completo
- **Exención ISR**: Hasta Q60,000 anuales

#### **Características Especiales**
- **NO paga IGSS** (exento por ley)
- **ISR reducido**: Solo sobre exceso de Q60,000 anuales
- Se calcula sobre salario promedio, NO sobre salario actual

#### **Ejemplo Empleado con Q5,000**
```
Salario Promedio 12 meses: Q5,000.00
Bono 14 Bruto:             Q5,000.00

IGSS:                      Q    0.00 (EXENTO)
ISR:                       Q    0.00 (< Q60,000 anuales)

Bono 14 Neto:              Q5,000.00
```

---

## ⚠️ Verificación de Implementación Actual

### ✅ Elementos Correctos Identificados
1. **Bono Decreto**: Q250.00 hardcodeado correctamente
2. **Tipos de nómina**: ORDINARIA, EXTRAORDINARIA, AGUINALDO, BONO14
3. **Campos IGSS e ISR**: Mapeados en DTOs

### 🔍 Elementos a Verificar en Backend

#### **CRÍTICO: Diferenciación por Tipo de Nómina**
```typescript
// ¿El backend aplica estas reglas?
if (tipoNomina === 'AGUINALDO' || tipoNomina === 'BONO14') {
  igssEmpleado = 0.00; // EXENTO
  // ISR solo si > Q60,000 anuales
} else {
  igssEmpleado = salarioBase * 0.0483; // 4.83%
  // ISR según escala normal
}
```

#### **Base de Cálculo Correcta**
- **ORDINARIA/EXTRAORDINARIA**: Salario actual
- **AGUINALDO/BONO14**: Promedio últimos 12 meses

### 📊 Escala ISR 2025 (Verificar en Backend)
```json
[
  { "desde": 0, "hasta": 300000, "tasa": 0.05 },
  { "desde": 300000, "hasta": 500000, "tasa": 0.07 },
  { "desde": 500000 "tasa": 0.10 }
]
```

---

## 🚨 Recomendaciones Urgentes

### 1. **Verificar Lógica de Cálculo por Tipo**
Confirmar que el backend C# aplica las exenciones correctas:
- Aguinaldo: Sin IGSS, ISR limitado
- Bono 14: Sin IGSS, ISR limitado

### 2. **Validar Escala ISR**
Verificar que los porcentajes y tramos ISR estén actualizados para 2025.

### 3. **Base de Cálculo Promedio**
Para Aguinaldo/Bono14, debe usar promedio 12 meses, no salario actual.

### 4. **Límites IGSS**
Confirmar límite máximo IGSS (normalmente Q5,000 base).

---

## 📝 Pruebas Recomendadas

### Caso 1: Empleado Q3,000 - Nómina Ordinaria
- **Esperado**: IGSS Q144.90, ISR Q0, Neto Q3,105.10

### Caso 2: Empleado Q8,000 - Nómina Ordinaria  
- **Esperado**: IGSS Q241.50 (máximo), ISR según escala

### Caso 3: Empleado Q5,000 - Aguinaldo
- **Esperado**: IGSS Q0, ISR Q0, Neto Q5,000

### Caso 4: Empleado Q10,000 - Bono 14
- **Esperado**: IGSS Q0, ISR solo si excede Q60K anuales

---

**Conclusión**: Es necesario verificar que el backend implemente correctamente las exenciones especiales para Aguinaldo y Bono 14, así como los cálculos base promedio correspondientes.
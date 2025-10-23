# 📋 Comandos Útiles - Sistema Nómina Frontend

## 🔧 Setup Inicial

```bash
# Instalar todas las dependencias
npm install

# Verificar instalación
npm list react react-dom axios @tanstack/react-query zod

# Crear archivo .env si no existe (ya debería existir)
cp .env.example .env
```

---

## 🚀 Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev
# → http://localhost:5173

# Build para producción
npm run build

# Preview del build
npm run preview

# Linter
npm run lint
```

---

## 🧪 Testing

```bash
# Ejecutar todos los tests
npm run test

# Tests con UI interactiva
npm run test:ui

# Tests con coverage
npm run test:coverage

# Watch mode (re-ejecutar al guardar)
npm run test -- --watch
```

---

## 🔍 Debugging

### Ver tokens en localStorage
```javascript
// Abrir DevTools → Console
localStorage.getItem('token')
localStorage.getItem('refreshToken')
localStorage.getItem('role')

// Limpiar todos los tokens
localStorage.clear()
```

### Monitorear Network
```bash
# 1. Abrir DevTools → Network
# 2. Filtrar por "Fetch/XHR"
# 3. Hacer login
# 4. Buscar petición /Auth/login
# 5. Ver Response Headers → X-Refresh-Token
```

### Ver refresh automático
```javascript
// 1. Hacer login
// 2. En Console, modificar token para que expire:
localStorage.setItem('token', 'token_invalido')

// 3. Hacer cualquier petición (ej: listar empleados)
// 4. En Network verás:
//    - Request original → 401
//    - /Auth/refresh → 200
//    - Request original reintentado → 200
```

### Verificar interceptor
```javascript
// En Console, verificar que el interceptor está activo:
console.log(api.interceptors.request.handlers.length) // > 0
console.log(api.interceptors.response.handlers.length) // > 0
```

---

## 📦 Gestión de Dependencias

```bash
# Actualizar todas las dependencias
npm update

# Ver dependencias desactualizadas
npm outdated

# Instalar dependencia específica
npm install <paquete>

# Desinstalar dependencia
npm uninstall <paquete>

# Limpiar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

---

## 🐛 Solución de Problemas Comunes

### Error: "Cannot find module 'vitest'"
```bash
npm install
```

### Error: CORS al hacer peticiones
```bash
# Verificar que backend permite http://localhost:5173
# Verificar VITE_API_URL en .env
cat .env | grep VITE_API_URL
```

### Error: "Network Error"
```bash
# Verificar que backend está corriendo
curl https://localhost:5001/api/Auth/login

# O en PowerShell:
Invoke-WebRequest -Uri "https://localhost:5001/api" -Method GET
```

### Error: TypeScript compilation failed
```bash
# Limpiar cache y reinstalar
npm run build -- --force
```

### Error: Port 5173 already in use
```bash
# Cambiar puerto en vite.config.ts:
# server: { port: 5174 }

# O matar proceso que usa el puerto:
# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process

# Linux/Mac:
lsof -ti:5173 | xargs kill -9
```

---

## 📊 Análisis del Bundle

```bash
# Ver tamaño del bundle
npm run build

# Analizar con herramienta visual
npm install -D rollup-plugin-visualizer
# Agregar a vite.config.ts y rebuild
```

---

## 🔐 Variables de Entorno

### Desarrollo
```bash
# .env (local)
VITE_API_URL=https://localhost:5001/api
VITE_UPLOAD_MAX_MB=100
VITE_APP_ORIGIN=http://localhost:5173
```

### Producción
```bash
# .env.production
VITE_API_URL=https://api.empresa.com/api
VITE_UPLOAD_MAX_MB=100
VITE_APP_ORIGIN=https://nomina.empresa.com
```

### Verificar variables
```javascript
// En el navegador Console:
console.log(import.meta.env.VITE_API_URL)
console.log(import.meta.env.VITE_UPLOAD_MAX_MB)
```

---

## 📝 Git Workflow

```bash
# Ver estado
git status

# Agregar cambios
git add .

# Commit
git commit -m "feat: implementar refresh token automático"

# Push
git push origin main

# Ver logs
git log --oneline --graph --all

# Ver diferencias
git diff
```

---

## 🚀 Deploy

### Build optimizado
```bash
npm run build
# Archivos generados en: dist/
```

### Preview antes de deploy
```bash
npm run preview
```

### Deploy a Vercel (ejemplo)
```bash
npm install -g vercel
vercel
```

### Deploy a Netlify (ejemplo)
```bash
npm install -g netlify-cli
netlify deploy --prod
```

---

## 📚 Comandos de Documentación

```bash
# Ver estructura del proyecto
tree src/

# En Windows PowerShell:
Get-ChildItem -Recurse src/ | Select-Object FullName

# Contar líneas de código
find src/ -name "*.ts" -o -name "*.tsx" | xargs wc -l
```

---

## 🔄 Actualizar después de cambios en Backend

```bash
# 1. Actualizar tipos si backend cambió DTOs
# Editar src/types/*.ts

# 2. Actualizar servicios si endpoints cambiaron
# Editar src/services/*.ts

# 3. Re-ejecutar tests
npm run test

# 4. Verificar compilación
npm run build
```

---

## 🎯 Comandos para Testing Específico

```bash
# Test solo authService
npm run test -- authService

# Test solo empleadosService
npm run test -- empleadosService

# Test con verbose output
npm run test -- --reporter=verbose

# Test un archivo específico
npm run test src/__tests__/authService.test.ts
```

---

## 🆘 Resetear Proyecto a Estado Limpio

```bash
# ⚠️ CUIDADO: Esto borrará todos los cambios locales

# 1. Limpiar node_modules
rm -rf node_modules package-lock.json

# 2. Limpiar dist
rm -rf dist

# 3. Limpiar cache
npm cache clean --force

# 4. Reinstalar
npm install

# 5. Rebuild
npm run build
```

---

## 📞 Soporte

Si encuentras problemas:

1. Ver **IMPLEMENTACION.md** sección "Debugging"
2. Ver **CORRECCIONES.md** sección "Errores Comunes"
3. Verificar DevTools Console para errores
4. Verificar DevTools Network para peticiones fallidas

---

**Última actualización**: Octubre 2025

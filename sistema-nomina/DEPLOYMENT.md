# 🚀 Guía de Deployment - Netlify + Railway

## 📋 Configuración Completada

### ✅ 1. Base de API Centralizada
- **Archivo principal:** `src/lib/http.ts` y `src/lib/api.ts`
- **Variable de entorno:** `VITE_API_URL`
- **Timeout configurado:** 30 segundos para producción
- **Interceptores:** Authorization Bearer automático cuando existe token

### ✅ 2. Variables de Entorno
- **Desarrollo:** `.env` → `http://localhost:5009/api`
- **Producción:** `.env.production` → `https://tu-backend.railway.app/api`

### ✅ 3. SPA Routing
- **Archivo creado:** `public/_redirects`
- **Contenido:** `/*    /index.html   200`

### ✅ 4. Build Verificado
- ✅ `npm run build` exitoso
- ✅ TypeScript compilation OK
- ✅ Vite build OK

---

## 🌐 Instrucciones para Netlify

### Paso 1: Variables de Entorno en Netlify
Ve a **Site settings → Environment variables** y agrega:

```
VITE_API_URL = https://tu-backend.railway.app/api
VITE_UPLOAD_MAX_MB = 100
VITE_APP_ORIGIN = https://tu-app.netlify.app
```

### Paso 2: Build Settings
- **Build command:** `npm run build`
- **Publish directory:** `dist`
- **Node version:** 18+ (recomendado)

### Paso 3: Deploy
1. Conecta tu repo de GitHub
2. Configura las variables de entorno
3. Deploy automático desde la rama `main` o `Guillermo`

---

## 🚄 Instrucciones para Railway (Backend)

### CORS Configuration
Asegúrate de que tu backend tenga CORS configurado para:

```csharp
// Program.cs o Startup.cs
app.UseCors(policy => policy
    .WithOrigins("https://tu-app.netlify.app") 
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials(false)
);
```

---

## ✅ Checklist de Deployment

### Pre-Deploy
- [x] `npm ci && npm run build` local OK
- [x] Variables de entorno configuradas
- [x] `public/_redirects` creado
- [x] Clientes HTTP optimizados para producción

### Post-Deploy Netlify
- [ ] Deploy en Netlify OK
- [ ] URL de la app funcionando
- [ ] Peticiones van a `VITE_API_URL` (sin CORS errors)
- [ ] Flujo de login funciona
- [ ] Endpoints protegidos funcionan
- [ ] Exportación de nóminas funciona
- [ ] Routing de SPA funciona (refresh en cualquier ruta)

### Verificación Final
- [ ] Login/logout completo
- [ ] CRUD de empleados, departamentos, puestos
- [ ] Generación de nóminas
- [ ] Exportación PDF/Excel
- [ ] Subida de archivos
- [ ] Reportes y expedientes

---

## 🔧 Troubleshooting

### Error de CORS
- Verificar que `VITE_API_URL` apunta al backend correcto
- Verificar CORS en Railway backend
- Verificar que no hay trailing slashes extra

### Error 404 en rutas
- Verificar que `public/_redirects` existe
- Verificar que el archivo contiene: `/*    /index.html   200`

### Variables de entorno no funcionan
- En Netlify: Site settings → Environment variables
- Nombres deben empezar con `VITE_`
- Hacer redeploy después de cambiar variables

### Build errors
- Verificar Node version >= 18
- Ejecutar `npm ci` (no `npm install`)
- Verificar que no hay TypeScript errors
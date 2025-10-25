# 🔧 Requerimientos para el Backend - Módulo de Expedientes

## 📋 Resumen
El módulo de expedientes del frontend necesita que el backend agregue **2 campos adicionales** en la respuesta del endpoint de listado de documentos, y corrija la ruta del endpoint de descarga.

---

## 🚨 Problemas Actuales

### 1. ❌ Campo `nombreOriginal` no se devuelve
**Endpoint afectado:** `GET /api/DocumentosEmpleado?empleadoId={id}`

**Problema:** El backend NO está devolviendo el campo `nombreOriginal` (nombre original del archivo subido).

**Respuesta actual:**
```json
[
  {
    "id": 8,
    "empleadoId": 1,
    "tipoDocumentoId": 1,
    "rutaArchivo": "documentos/1/77873979998b40938b8bfe1094f359b2_Proyecto Final Redes.pdf",
    "fechaSubida": "2025-10-25T02:18:08.7536469",
    "nombreTipo": "DPI",
    "nombreEmpleado": "Wilson Eduardo"
  }
]
```

**Respuesta esperada:**
```json
[
  {
    "id": 8,
    "empleadoId": 1,
    "tipoDocumentoId": 1,
    "rutaArchivo": "documentos/1/77873979998b40938b8bfe1094f359b2_Proyecto Final Redes.pdf",
    "nombreOriginal": "Proyecto Final Redes.pdf",  // ⬅️ AGREGAR ESTE CAMPO
    "fechaSubida": "2025-10-25T02:18:08.7536469",
    "nombreTipo": "DPI",
    "nombreEmpleado": "Wilson Eduardo"
  }
]
```

**Solución:**
Agregar el campo `nombreOriginal` al DTO de respuesta. Este campo debe contener el nombre original del archivo que el usuario subió.

**Código sugerido (C#):**
```csharp
public class DocumentoEmpleadoDto
{
    public int Id { get; set; }
    public int EmpleadoId { get; set; }
    public int TipoDocumentoId { get; set; }
    public string RutaArchivo { get; set; }
    public string NombreOriginal { get; set; }  // ⬅️ AGREGAR ESTE CAMPO
    public DateTime FechaSubida { get; set; }
    public string NombreTipo { get; set; }
    public string NombreEmpleado { get; set; }
}
```

---

### 2. ❌ Campo `tamano` (tamaño del archivo) no se devuelve
**Endpoint afectado:** `GET /api/DocumentosEmpleado?empleadoId={id}`

**Problema:** El backend NO está devolviendo el tamaño del archivo en bytes.

**Respuesta esperada:**
```json
[
  {
    "id": 8,
    "empleadoId": 1,
    "tipoDocumentoId": 1,
    "rutaArchivo": "documentos/1/77873979998b40938b8bfe1094f359b2_Proyecto Final Redes.pdf",
    "nombreOriginal": "Proyecto Final Redes.pdf",
    "tamano": 2547896,  // ⬅️ AGREGAR ESTE CAMPO (tamaño en bytes)
    "fechaSubida": "2025-10-25T02:18:08.7536469",
    "nombreTipo": "DPI",
    "nombreEmpleado": "Wilson Eduardo"
  }
]
```

**Solución:**
1. Agregar el campo `tamano` (o `Tamano`) al DTO de respuesta
2. El valor debe ser el tamaño del archivo **en bytes**
3. Si usan Azure Blob Storage, pueden obtenerlo desde `BlobProperties.ContentLength`

**Código sugerido (C#):**
```csharp
public class DocumentoEmpleadoDto
{
    public int Id { get; set; }
    public int EmpleadoId { get; set; }
    public int TipoDocumentoId { get; set; }
    public string RutaArchivo { get; set; }
    public string NombreOriginal { get; set; }
    public long Tamano { get; set; }  // ⬅️ AGREGAR ESTE CAMPO (long para archivos grandes)
    public DateTime FechaSubida { get; set; }
    public string NombreTipo { get; set; }
    public string NombreEmpleado { get; set; }
}
```

**Cómo obtener el tamaño desde Azure Blob:**
```csharp
var blobClient = containerClient.GetBlobClient(rutaArchivo);
var properties = await blobClient.GetPropertiesAsync();
long tamano = properties.Value.ContentLength;
```

---

### 3. ❌ Error 404 al visualizar documentos
**Endpoint afectado:** `GET /api/DocumentosEmpleado/{empleadoId}/{documentoId}/download`

**Problema:** Cuando el frontend intenta visualizar un documento, recibe un error **404 Not Found**.

**Request actual del frontend:**
```
GET http://localhost:5009/api/DocumentosEmpleado/1/7/download?minutes=10&download=false
```

**Posibles causas:**
1. ✅ El endpoint NO existe o está en una ruta diferente
2. ✅ El backend NO está generando correctamente la URL SAS de Azure Blob
3. ✅ El archivo NO existe en Azure Blob Storage
4. ✅ Problemas de permisos o CORS en Azure Storage

**Respuesta esperada del endpoint:**
```json
{
  "url": "https://mystorageaccount.blob.core.windows.net/documentos/1/77873979998b40938b8bfe1094f359b2_Proyecto%20Final%20Redes.pdf?sv=2021-06-08&se=2025-10-25T03%3A00%3A00Z&sr=b&sp=r&sig=ABC123...",
  "path": "documentos/1/77873979998b40938b8bfe1094f359b2_Proyecto Final Redes.pdf",
  "expiresAt": "2025-10-25T03:00:00Z"
}
```

**Solución:**
1. **Verificar que el endpoint existe** con la ruta: `/api/DocumentosEmpleado/{empleadoId}/{documentoId}/download`
2. **Implementar la generación de URL SAS** si no existe:

```csharp
[HttpGet("{empleadoId}/{documentoId}/download")]
public async Task<IActionResult> GetDocumentSignedUrl(
    int empleadoId, 
    int documentoId, 
    [FromQuery] int minutes = 10, 
    [FromQuery] bool download = false)
{
    try
    {
        // 1. Buscar el documento en la base de datos
        var documento = await _context.DocumentosEmpleado
            .FirstOrDefaultAsync(d => d.Id == documentoId && d.EmpleadoId == empleadoId);
        
        if (documento == null)
            return NotFound(new { message = "Documento no encontrado" });

        // 2. Generar URL SAS de Azure Blob
        var blobClient = _blobContainerClient.GetBlobClient(documento.RutaArchivo);
        
        // Verificar que el blob existe
        if (!await blobClient.ExistsAsync())
            return NotFound(new { message = "Archivo no encontrado en el almacenamiento" });

        // 3. Generar token SAS
        var sasBuilder = new BlobSasBuilder
        {
            BlobContainerName = _blobContainerClient.Name,
            BlobName = documento.RutaArchivo,
            Resource = "b", // "b" para blob
            ExpiresOn = DateTimeOffset.UtcNow.AddMinutes(minutes)
        };

        if (download)
            sasBuilder.ContentDisposition = $"attachment; filename=\"{documento.NombreOriginal}\"";
        else
            sasBuilder.ContentDisposition = "inline";

        sasBuilder.SetPermissions(BlobSasPermissions.Read);

        // 4. Crear la URL con el token SAS
        var sasToken = blobClient.GenerateSasUri(sasBuilder);

        return Ok(new
        {
            url = sasToken.ToString(),
            path = documento.RutaArchivo,
            expiresAt = sasBuilder.ExpiresOn
        });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error al generar URL SAS para documento {DocumentoId}", documentoId);
        return StatusCode(500, new { message = "Error al generar la URL de descarga" });
    }
}
```

**Configuración de CORS en Azure Blob Storage:**
Si el error persiste, verificar la configuración de CORS en Azure Storage:
```json
{
  "CorsRules": [
    {
      "AllowedOrigins": ["http://localhost:5173", "http://localhost:5174", "https://tu-dominio.com"],
      "AllowedMethods": ["GET", "HEAD"],
      "AllowedHeaders": ["*"],
      "ExposedHeaders": ["*"],
      "MaxAgeInSeconds": 3600
    }
  ]
}
```

---

## ✅ Checklist de Implementación

### Backend debe implementar:
- [ ] Agregar campo `nombreOriginal` al DTO de `DocumentosEmpleado`
- [ ] Agregar campo `tamano` (long) al DTO de `DocumentosEmpleado`
- [ ] Mapear estos campos desde la entidad/Azure Blob al DTO
- [ ] Verificar que el endpoint `/download` existe y funciona
- [ ] Implementar generación de URL SAS si no existe
- [ ] Configurar CORS en Azure Blob Storage
- [ ] Probar el endpoint con Postman/Swagger

### Endpoints que deben modificarse:
1. **`GET /api/DocumentosEmpleado?empleadoId={id}`**
   - Agregar `nombreOriginal` y `tamano` a la respuesta

2. **`GET /api/DocumentosEmpleado/{empleadoId}/{documentoId}/download`**
   - Verificar que existe
   - Debe generar URL SAS válida de Azure Blob
   - Debe devolver: `{ url, path, expiresAt }`

---

## 🧪 Pruebas

### Probar listado de documentos:
```bash
GET http://localhost:5009/api/DocumentosEmpleado?empleadoId=1

# Respuesta esperada:
[
  {
    "id": 7,
    "empleadoId": 1,
    "tipoDocumentoId": 1,
    "rutaArchivo": "documentos/1/0d142c5e5fc5454db919734ab789ea50_Proyecto Final Redes.pdf",
    "nombreOriginal": "Proyecto Final Redes.pdf",  ✅
    "tamano": 2547896,  ✅
    "fechaSubida": "2025-10-25T02:10:31.9343527",
    "nombreTipo": "DPI",
    "nombreEmpleado": "Wilson Eduardo"
  }
]
```

### Probar descarga/visualización:
```bash
GET http://localhost:5009/api/DocumentosEmpleado/1/7/download?minutes=10&download=false

# Respuesta esperada (200 OK):
{
  "url": "https://mystorageaccount.blob.core.windows.net/...",  ✅
  "path": "documentos/1/0d142c5e5fc5454db919734ab789ea50_Proyecto Final Redes.pdf",
  "expiresAt": "2025-10-25T03:00:00Z"
}
```

---

## 📞 Contacto
Si tienen dudas sobre estos requerimientos, revisar:
- Frontend repo: `Frontend-Nominas` branch `Guillermo`
- Archivo de referencia: `src/features/employees/api.ts` (líneas 277-349)
- Commit: `6e09146` - "Fix: Extraer nombreOriginal desde rutaArchivo y mejorar logs de debug"

---

## 🎯 Resultado Esperado
Una vez implementados estos cambios:
1. ✅ El nombre del archivo se mostrará correctamente en la tabla
2. ✅ El tamaño del archivo se mostrará formateado (ej: "2.43 MB")
3. ✅ El botón "Abrir" abrirá el documento en una nueva pestaña sin errores 404
4. ✅ El tipo de documento se mostrará según lo seleccionado al subir

**Prioridad:** 🔴 **ALTA** - El módulo de expedientes no funciona correctamente sin estos cambios.

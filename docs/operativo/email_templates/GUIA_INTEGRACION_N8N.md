# Guía de integración en n8n — Correos proveedores Vive al Ándalus

---

## Qué contiene este sistema

| Archivo | Uso |
|---|---|
| `email_hoteles.html` | Plantilla HTML para contacto con hoteles |
| `email_transporte.html` | Plantilla HTML para empresas de transporte |
| `email_restaurantes_halal.html` | Plantilla HTML para restaurantes halal |
| `email_agencias.html` | Plantilla HTML para agencias / touroperadores |
| `n8n_variables_estado.json` | Referencia de variables y campos de estado |
| `asuntos_y_fallbacks.md` | Líneas de asunto y textos plain text |
| `GUIA_INTEGRACION_N8N.md` | Este documento |

---

## Flujo del workflow en n8n

```
[TRIGGER: Manual / Schedule]
        ↓
[Read Google Sheet / Notion — lista de proveedores]
        ↓
[Filter: estado_envio = "pendiente"]
        ↓
[Switch: tipo_proveedor]
    ├── Hotel      → cargar email_hoteles.html
    ├── Transporte → cargar email_transporte.html
    ├── Restaurante→ cargar email_restaurantes_halal.html
    └── Agencia    → cargar email_agencias.html
        ↓
[Set: reemplazar variables {{...}} en el HTML]
        ↓
[IF: modo_prueba = true]
    ├── true  → enviar a reservas@vivealandalus.com
    └── false → enviar a {{email_destino}}
        ↓
[Gmail / SMTP: enviar email]
        ↓
[Update Sheet/Notion: estado_envio="enviado", fecha_ultimo_contacto=hoy, proximo_seguimiento=+7días]
```

---

## Paso a paso en n8n

### 1. Crear las credenciales

En n8n → Settings → Credentials:
- **Gmail OAuth2**: usar cuenta reservas@vivealandalus.com
- **Google Sheets** (si los proveedores están en Sheets): OAuth2 con la misma cuenta
- **Notion** (si se usa): API key de la integración Notion

### 2. Subir las plantillas HTML

Opción A — Almacenar en Google Drive:
- Subir los 4 archivos `.html` a una carpeta en Drive
- En n8n usar nodo **Google Drive** → Read File para obtener el contenido

Opción B — Pegar directamente en el nodo Set:
- En el nodo Set de n8n, crear un campo `html_content` con el HTML pegado como string
- Reemplazar `{{variable}}` con expresiones n8n: `{{ $json.nombre_proveedor }}`

### 3. Sustitución de variables

En n8n, las variables `{{variable}}` del HTML se sustituyen así en un nodo **Code**:

```javascript
// Nodo Code en n8n
const html = $input.first().json.html_content;
const data = $input.first().json;

const resultado = html
  .replace(/\{\{nombre_proveedor\}\}/g, data.nombre_proveedor || '')
  .replace(/\{\{persona_contacto\}\}/g, data.persona_contacto || 'responsable')
  .replace(/\{\{ciudad\}\}/g, data.ciudad || '')
  .replace(/\{\{referencia_contacto\}\}/g, data.referencia_contacto || '')
  .replace(/\{\{fecha_envio\}\}/g, new Date().toLocaleDateString('es-ES', {
    day: 'numeric', month: 'long', year: 'numeric'
  }));

return [{ json: { html_final: resultado, ...data } }];
```

### 4. Generar la referencia automáticamente

```javascript
// En nodo Code o Set
const prefijos = { Hotel: 'HOT', Transporte: 'TRP', Restaurante: 'RST', Agencia: 'AGN' };
const prefijo = prefijos[$json.tipo_proveedor] || 'GEN';
const fecha = new Date().toISOString().slice(0,10).replace(/-/g,'');
const numero = String($runIndex + 1).padStart(3, '0');
const referencia = `VAA-${prefijo}-${fecha}-${numero}`;
```

### 5. Configurar el nodo Gmail

```
Nodo: Gmail → Send Email
- To: {{ $json.modo_prueba ? 'reservas@vivealandalus.com' : $json.email_destino }}
- From Name: Abdulah Jiménez Contreras — Vive al Ándalus
- Subject: [usar líneas de asunto de asuntos_y_fallbacks.md]
- Email Type: HTML
- Message: {{ $json.html_final }}
- Reply To: reservas@vivealandalus.com
```

### 6. Actualizar estado después del envío

Tras el nodo Gmail, añadir nodo para actualizar la hoja/base:
- `estado_envio` → `"enviado"`
- `fecha_ultimo_contacto` → fecha de hoy
- `proximo_seguimiento` → fecha de hoy + 7 días

---

## Control modo prueba

**ANTES de activar envíos reales:**

1. En `n8n_variables_estado.json`, campo `modo_prueba.activo` debe ser `true`
2. En el workflow n8n, el nodo IF redirige todo a `reservas@vivealandalus.com`
3. Verificar que llegan correctamente los emails de prueba
4. Abdulah aprueba visualmente cada plantilla
5. Solo entonces cambiar `modo_prueba.activo` a `false` y reactivar el workflow

**No activar envíos masivos sin esta aprobación.**

---

## Seguimiento de respuestas

Cuando un proveedor responde:
1. Cambiar `estado_envio` a `"respondio"`
2. Anotar en `notas_respuesta` lo que dijeron
3. Si hay interés: crear proveedor en Notion base PROVEEDORES con estado `"En negociación"`
4. Si no hay interés: marcar `"descartado"` y no volver a contactar

Recordatorio automático (opcional):
- Añadir workflow secundario que se ejecuta cada día
- Filtra proveedores donde `proximo_seguimiento` = hoy y `estado_envio` = `"enviado"`
- Genera tarea en Notion o envía Telegram a Abdu con la lista

---

*Guía operativa · Vive al Ándalus · Bin Firnas Travel SL · Junio 2026*

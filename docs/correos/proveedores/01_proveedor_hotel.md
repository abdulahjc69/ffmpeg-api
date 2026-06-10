# P01 — Solicitud de disponibilidad y tarifa a hotel

**Código:** P01  
**Tipo:** Proveedor externo — hotel  
**Trigger:** Fase de cotización (manual — requiere aprobación de Abdu antes de enviar)  
**Envío:** Manual por Abdu o agente autorizado  
**Idioma:** Español (ES) por defecto  
**Desde:** reservas@vivealandalus.com  
**Para:** [Email del hotel — completar manualmente]  
**Asunto:** Solicitud de disponibilidad y tarifa — Grupo `{{total_viajeros}}` pax — `{{fecha_inicio}}` / `{{fecha_fin}}` — Ref. `{{ref}}`

> ⚠️ **REVISIÓN OBLIGATORIA antes de enviar.** No enviar automáticamente.  
> Nunca incluir: márgenes, costes internos, datos de otros proveedores, ni notas internas.

---

## Plantilla

---

Estimado/a equipo de [NOMBRE DEL HOTEL],

Me pongo en contacto con ustedes en nombre de **Vive al Ándalus** (Bin Firnas Travel SL) para solicitar disponibilidad y tarifas para un grupo familiar.

**DATOS DE LA SOLICITUD**

| Campo | Detalle |
|-------|---------|
| Referencia interna | `{{ref}}` |
| Ciudad | [CIUDAD] |
| Fecha de entrada | `{{fecha_entrada_ciudad}}` |
| Fecha de salida | `{{fecha_salida_ciudad}}` |
| Noches | `{{noches_ciudad}}` |
| Total viajeros | `{{total_viajeros}}` (`{{adultos}}` adultos, `{{menores}}` menores de `{{edades_menores}}` años) |

**HABITACIONES SOLICITADAS**

| Tipo | Cantidad |
|------|----------|
| Doble | `{{hab_dobles}}` |
| Triple | `{{hab_triples}}` |
| Individual | `{{hab_individuales}}` |
| Familiar | `{{hab_familiares}}` |
| Operativa (staff) | 1 |
| **TOTAL** | `{{total_hab_solicitar}}` |

**RÉGIMEN:** `{{regimen}}`  
**CATEGORÍA SOLICITADA:** `{{categoria_hotel}}` estrellas (o superior)

**REQUISITOS ESPECIALES**

- ✅ **Alimentación halal certificada:** obligatorio. Se requiere confirmación de certificación y proveedor halal.
- ✅ **Sin alcohol en mesa** durante el servicio al grupo.
- `{{requisito_planta_baja}}` Habitación en planta baja (solicitud del cliente — accesibilidad relativa, no estricta).
- `{{requisito_piscina}}` Preferencia de hotel con piscina para los menores.
- El servicio de maletas (porter) es valorado positivamente.

**INFORMACIÓN ADICIONAL DEL GRUPO**

- Grupo familiar: adultos y menores (edades: `{{edades_menores}}` años).
- El grupo llegará con transfer privado. Se coordinará hora de check-in.
- Idioma principal del grupo: árabe.

**SOLICITUD DE INFORMACIÓN**

Por favor, indíquennos:
1. Disponibilidad para las fechas solicitadas.
2. Tarifa neta por habitación y noche (régimen indicado).
3. Condiciones de reserva: depósito, plazo de cancelación y política de no-show.
4. Confirmación de certificación halal y proveedor.
5. Disponibilidad de habitación en planta baja.
6. Disponibilidad de piscina (si aplica).
7. Cualquier suplemento aplicable (festivos, temporada alta, etc.).

Quedamos a su disposición para cualquier aclaración.

Un cordial saludo,

---

Vive al Ándalus  
BIN FIRNAS TRAVEL SL

Abdulah Jiménez Contreras  
Teléfono: 633 30 59 09  
Correo: reservas@vivealandalus.com  
Web: www.vivealandalus.com

Puede consultar nuestras condiciones generales, aviso legal y política de privacidad en www.vivealandalus.com.

---

## Notas operativas

- **Envío:** MANUAL. Abdu revisa y aprueba antes de enviar.
- Completar manualmente: nombre del hotel, ciudad, fechas específicas por ciudad, hab. planta baja si aplica, piscina si aplica.
- Variables `{{requisito_planta_baja}}` y `{{requisito_piscina}}`: incluir o eliminar la línea según notas internas del expediente.
- Si hay notas internas relevantes del cliente para el hotel, incluirlas en lenguaje neutro externo (sin revelar las notas literales).
- Enviar una solicitud por ciudad / por hotel. No mezclar ciudades en un mismo correo.
- Archivar respuesta del proveedor en el expediente (`operacion_interna.proveedores.hoteles`).

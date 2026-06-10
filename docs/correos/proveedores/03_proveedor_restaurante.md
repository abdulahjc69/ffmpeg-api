# P03 — Solicitud a restaurante halal

**Código:** P03  
**Tipo:** Proveedor externo — restaurante halal  
**Trigger:** Fase de cotización (manual — requiere aprobación de Abdu antes de enviar)  
**Envío:** Manual por Abdu o agente autorizado  
**Idioma:** Español (ES)  
**Desde:** reservas@vivealandalus.com  
**Para:** [Email del restaurante — completar manualmente]  
**Asunto:** Solicitud de menú grupal halal — `{{total_viajeros}}` pax — [CIUDAD] — `{{fecha_comida}}` — Ref. `{{ref}}`

> ⚠️ **REVISIÓN OBLIGATORIA antes de enviar.** No enviar automáticamente.  
> Nunca incluir: márgenes, costes internos ni datos de otros proveedores.

---

## Plantilla

---

Estimado/a equipo de [NOMBRE DEL RESTAURANTE],

Me pongo en contacto con ustedes en nombre de **Vive al Ándalus** (Bin Firnas Travel SL) para solicitar disponibilidad y tarifa para un servicio de almuerzo grupal.

**DATOS DE LA SOLICITUD**

| Campo | Detalle |
|-------|---------|
| Referencia interna | `{{ref}}` |
| Ciudad | [CIUDAD] |
| Fecha | `{{fecha_comida}}` |
| Hora prevista | [HH:MM] |
| Número de comensales | `{{total_viajeros}}` (`{{adultos}}` adultos, `{{menores}}` menores de `{{edades_menores}}` años) |
| Tipo de servicio | Almuerzo grupal (menú cerrado) |

**REQUISITOS ALIMENTARIOS — OBLIGATORIOS**

- ✅ **Cocina 100% halal certificada.** Este requisito es innegociable.
- ✅ **Sin alcohol** en mesa durante todo el servicio al grupo.
- ✅ Se solicita **documento acreditativo de certificación halal** (sello, certificado o carta del proveedor).
- El grupo proviene de Arabia Saudí — familiarizados con estándares halal internacionales.

**PROPUESTA DE MENÚ**

Solicitamos un menú representativo de la cocina andaluza tradicional adaptado a los requisitos halal, con:
- Entrada: producto local (gazpacho, salmorejo, berenjenas, etc.) — versión sin jamón ni tocino.
- Principal: carne o pescado halal (pollo, ternera, merluza, etc.).
- Postre: dulce local o fruta.
- Bebidas: agua, refrescos, zumos. Sin alcohol.
- Pan: incluido.

*Si tienen un menú grupal cerrado con estas características, pueden enviarlo directamente.*

**NIÑOS**

- `{{menores}}` menores de `{{edades_menores}}` años.
- Solicitar si disponen de menú infantil halal o si el menú estándar es adecuado.

**SOLICITUD DE INFORMACIÓN**

Por favor, indíquenos:
1. Disponibilidad para la fecha y hora indicadas.
2. Tarifa neta por comensal (menú cerrado adulto / menú infantil si aplica).
3. Propuesta de menú halal disponible.
4. Certificación halal: sello o documento acreditativo.
5. Política sin alcohol en mesa confirmada.
6. Condiciones: depósito, cancelación, no-show.
7. Accesibilidad del local para grupo con menores.

Quedamos a su disposición para cualquier consulta.

Un cordial saludo,

---

Vive al Ándalus  
BIN FIRNAS TRAVEL SL

Abdulah Jiménez Contreras  
Teléfono: 633 30 59 06  
Correo: reservas@vivealandalus.com  
Web: www.vivealandalus.com

Puede consultar nuestras condiciones generales, aviso legal y política de privacidad en www.vivealandalus.com.

---

## Notas operativas

- **Envío:** MANUAL. Abdu revisa y aprueba antes de enviar.
- Enviar una solicitud por ciudad / por fecha de comida. Total de solicitudes: `{{dias_restaurante}}` según expediente.
- Completar manualmente: nombre del restaurante, ciudad, fecha específica, hora prevista.
- Si el cliente solicitó certificación halal documentada (`servicios.halal.certificacion_documentada = true`), remarcarlo y solicitar el documento explícitamente.
- Archivar la confirmación de certificación halal en el expediente (`operacion_interna`).
- Si el restaurante no puede garantizar halal certificado: descartar y buscar alternativa. No aceptar "cocina sin cerdo" como sustituto de halal certificado.

# P04 — Solicitud a guía local

**Código:** P04  
**Tipo:** Proveedor externo — guía local  
**Trigger:** Fase de cotización (manual — requiere aprobación de Abdu antes de enviar)  
**Envío:** Manual por Abdu o agente autorizado  
**Idioma:** Español (ES)  
**Desde:** reservas@vivealandalus.com  
**Para:** [Email del guía / agencia de guías — completar manualmente]  
**Asunto:** Solicitud de guía local en árabe — [CIUDAD] — `{{fecha_visita}}` — `{{total_viajeros}}` pax — Ref. `{{ref}}`

> ⚠️ **REVISIÓN OBLIGATORIA antes de enviar.** No enviar automáticamente.  
> Nunca incluir: márgenes, costes internos ni datos de otros proveedores.

---

## Plantilla

---

Estimado/a [NOMBRE DEL GUÍA / AGENCIA],

Me pongo en contacto con ustedes en nombre de **Vive al Ándalus** (Bin Firnas Travel SL) para solicitar la disponibilidad de un guía local en [CIUDAD].

**DATOS DE LA SOLICITUD**

| Campo | Detalle |
|-------|---------|
| Referencia interna | `{{ref}}` |
| Ciudad | [CIUDAD] |
| Fecha | `{{fecha_visita}}` |
| Hora de inicio prevista | [HH:MM] |
| Duración del servicio | `{{duracion_guia}}` (medio día / día completo) |
| Número de viajeros | `{{total_viajeros}}` (`{{adultos}}` adultos, `{{menores}}` menores) |
| Idioma del grupo | Árabe |
| **Idioma requerido del guía** | **Árabe (obligatorio)** |

**PERFIL REQUERIDO DEL GUÍA**

- Árabe fluido (imprescindible — grupo arabófono).
- Titulación oficial de guía turístico en [COMUNIDAD AUTÓNOMA].
- Experiencia con grupos familiares de turismo halal / turismo islámico.
- Conocimiento profundo del patrimonio andalusí e islámico de la ciudad.
- Familiarizado con necesidades de grupos con menores (ritmo adecuado, paradas).

**VISITAS PREVISTAS EN [CIUDAD]**

*Completar según la ciudad:*

**Córdoba:**
- Mezquita-Catedral de Córdoba (entradas a gestionar — confirmar si el guía las gestiona o las gestionamos nosotros)
- Judería y barrio histórico
- Posible visita a Medina Azahara (confirmar disponibilidad)

**Sevilla:**
- Catedral y Giralda
- Real Alcázar (entradas a gestionar)
- Barrio de Santa Cruz
- Triana (opcional)

**Granada:**
- Alhambra y Generalife (entradas — OBLIGATORIO reservar con mínimo 60 días de antelación)
- Albaicín y Sacromonte
- Barrio árabe (Calle Calderería)

*Adaptar según ciudad real del servicio.*

**SOLICITUD DE INFORMACIÓN**

Por favor, indíquenos:
1. Disponibilidad para la fecha y hora indicadas.
2. Tarifa neta por el servicio (medio día / día completo, según solicitado).
3. Confirmación de dominio del árabe (nivel y experiencia con grupos arabófonos).
4. Si gestiona entradas a monumentos o si las gestionamos nosotros.
5. Experiencia previa con turismo islámico / familias del Golfo Pérsico.
6. Condiciones: depósito, cancelación, no-show.

Quedamos a su disposición para cualquier consulta.

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
- Ciudades con guía local según expediente: `{{ciudades_guia}}` — enviar una solicitud por ciudad.
- **Alhambra:** coordinar con guía si gestiona las entradas. Si no, Abdu debe reservar directamente con mínimo 60 días de antelación. Prioridad máxima.
- Si el guía no habla árabe: descartar inmediatamente. No aceptar inglés como sustituto sin consultar con Abdu.
- Archivar respuesta en `operacion_interna.proveedores.guias_locales`.

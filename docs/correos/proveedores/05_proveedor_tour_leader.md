# P05 — Solicitud a tour leader

**Código:** P05  
**Tipo:** Proveedor externo / colaborador — tour leader  
**Trigger:** Fase de cotización (manual — requiere aprobación de Abdu antes de enviar)  
**Envío:** Manual por Abdu o agente autorizado  
**Idioma:** Español (ES)  
**Desde:** reservas@vivealandalus.com  
**Para:** [Email del tour leader / agencia — completar manualmente]  
**Asunto:** Disponibilidad tour leader en árabe — `{{fecha_inicio}}` al `{{fecha_fin}}` — Ruta Andalucía — Ref. `{{ref}}`

> ⚠️ **REVISIÓN OBLIGATORIA antes de enviar.** No enviar automáticamente.  
> Nunca incluir: márgenes, costes internos ni datos de otros proveedores.

---

## Plantilla

---

Estimado/a [NOMBRE DEL TOUR LEADER / AGENCIA],

Me pongo en contacto con ustedes en nombre de **Vive al Ándalus** (Bin Firnas Travel SL) para solicitar disponibilidad de tour leader para un viaje de grupo por Al-Ándalus.

**DATOS DEL SERVICIO**

| Campo | Detalle |
|-------|---------|
| Referencia interna | `{{ref}}` |
| Fecha de inicio | `{{fecha_inicio}}` |
| Fecha de fin | `{{fecha_fin}}` |
| Duración | `{{duracion_noches}}` noches / `{{duracion_dias}}` días |
| Cobertura | Toda la ruta (acompañamiento continuo) |
| Total viajeros | `{{total_viajeros}}` (`{{adultos}}` adultos, `{{menores}}` menores) |
| Tipo de grupo | Familia — turismo halal |
| **Idioma requerido** | **Árabe (obligatorio)** |

**RUTA**

`{{ciudad_inicio}}` → `{{ciudades_ruta}}` → `{{ciudad_final}}`

| Ciudad | Noches |
|--------|--------|
| `{{ciudad_1}}` | `{{noches_1}}` |
| `{{ciudad_2}}` | `{{noches_2}}` |
| `{{ciudad_3}}` | `{{noches_3}}` |
| `{{ciudad_4}}` | `{{noches_4}}` |
| `{{ciudad_5}}` | `{{noches_5}}` |
| `{{ciudad_6}}` | `{{noches_6}}` |

*Ajustar tabla según ciudades reales del expediente.*

**PERFIL REQUERIDO**

- Árabe fluido — nativo o nivel equivalente (imprescindible).
- Experiencia en turismo halal y con grupos familiares del Golfo Pérsico.
- Conocimiento de Al-Ándalus y su legado islámico.
- Capacidad para coordinar grupo con menores (edades: `{{edades_menores}}` años).
- Disponible para pernoctar con el grupo durante toda la ruta.
- Actitud proactiva en gestión de incidencias y necesidades del grupo en destino.

**ALOJAMIENTO Y MANUTENCIÓN DEL TOUR LEADER**

- Alojamiento: incluido en los mismos hoteles del grupo (habitación operativa compartida con conductor).
- Manutención: a negociar (indicar sus condiciones habituales).
- Desplazamientos: en el mismo vehículo del grupo.

**RESPONSABILIDADES PRINCIPALES**

- Acompañar al grupo desde el aeropuerto de llegada (`{{llegada_aeropuerto}}` — `{{llegada_fecha}}`) hasta el aeropuerto de salida (`{{salida_aeropuerto}}` — `{{salida_fecha}}`).
- Coordinar con guías locales en Córdoba, Sevilla y Granada.
- Gestionar incidencias de alojamiento, restauración y transporte.
- Asegurar cumplimiento de requisitos halal en cada servicio.
- Comunicación directa con el grupo en árabe.
- Reportar a Abdu (reservas@vivealandalus.com) ante cualquier incidencia relevante.

**SOLICITUD DE INFORMACIÓN**

Por favor, indíquenos:
1. Disponibilidad para las fechas indicadas.
2. Tarifa neta por el servicio completo (ruta completa, acompañamiento continuo).
3. Condiciones de alojamiento y manutención (qué necesita el tour leader).
4. Referencias o experiencia previa con grupos similares (turismo halal, familias del Golfo).
5. Condiciones: depósito, cancelación, no-show.
6. Si dispone de seguro de responsabilidad civil profesional (valorable).

Quedamos a su disposición para cualquier consulta o para una llamada si lo prefiere.

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
- Completar manualmente: nombre del tour leader / agencia, tabla de ciudades con noches reales, fechas de aeropuerto.
- El tour leader comparte habitación operativa con el conductor — clarificarlo si el candidato pone objeciones.
- Si el candidato no habla árabe: descartar. No negociable.
- Una vez seleccionado, actualizar `servicios.tour_leader.nombre_asignado` en el expediente.
- Archivar respuesta en `operacion_interna.proveedores.otros` (o campo específico si se crea).

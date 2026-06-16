# Proveedores Seleccionados VAA — v1.0

**Empresa:** Bin Firnas Travel SL  
**Marca:** Vive al Ándalus  
**Versión:** 1.0  
**Fecha creación:** 2026-06-10  
**Responsable:** Abdulah Jiménez Contreras  
**Documento paralelo:** `proveedores_seleccionados_v1.json`

---

## Finalidad

El registro de proveedores seleccionados es el puente operativo entre el expediente y el proveedor. Responde a la pregunta: *¿quién hace qué, en qué ciudad, en qué fecha, a qué precio, y por qué se eligió a ese proveedor sobre los demás?*

Cada registro de selección conecta exactamente tres entidades ya existentes:
- Un **expediente** (`VAA-AAAA-NNNN`) del Expediente Maestro VAA
- Un **proveedor** (`PRV-AAAA-NNNN`) del Maestro de Proveedores
- Un **presupuesto** (`PRS-AAAA-NNNN`) del registro de Presupuestos

Sin estas tres referencias, un registro de selección no es válido.

---

## Filosofía de uso

### Un presupuesto previo es obligatorio

No puede seleccionarse un proveedor sin que exista un presupuesto suyo guardado en `presupuestos_proveedores_v1`. Seleccionar sin presupuesto registrado significa perder para siempre la información económica que justifica la decisión.

### El proveedor sustituido nunca se borra

Si se cambia de proveedor para un servicio, el registro original pasa a estado `sustituido` con su historial intacto. El nuevo proveedor crea un registro nuevo. En cualquier momento futuro es posible saber qué proveedor había sido elegido originalmente, por qué se cambió, y quién tomó la decisión.

### La selección documenta la justificación

Cada selección debe incluir `motivo_seleccion`: por qué se eligió este proveedor sobre los demás. No es un campo opcional. Es el conocimiento comercial de VAA.

---

## Regla de unicidad

Por cada combinación `[id_expediente + tipo_servicio + ciudad + fecha_inicio_servicio]` solo puede existir **una selección con estado `activo` o superior**. Antes de activar una nueva selección para la misma combinación, la anterior debe marcarse como `sustituido` o `cancelado_vaa`.

---

## Tipos de servicio

| Código | Descripción | Ciudad aplica |
|--------|-------------|:---:|
| `alojamiento` | Hotel por ciudad | ✅ |
| `transporte_ruta` | Transporte de ruta completa | ❌ |
| `transfer_llegada` | Transfer aeropuerto de llegada | ✅ (aeropuerto) |
| `transfer_salida` | Transfer aeropuerto de salida | ✅ (aeropuerto) |
| `restauracion` | Restaurante por ciudad y fecha | ✅ |
| `guia_local` | Guía por ciudad | ✅ |
| `tour_leader` | Tour leader ruta completa | ❌ |
| `entrada_monumento` | Entradas: Alhambra, Alcázar, Mezquita, etc. | ✅ |
| `actividad` | Experiencia, taller, excursión | ✅ |
| `seguro` | Póliza de viaje | ❌ |
| `otro` | Otro servicio | Opcional |

---

## Estados de la selección

| Estado | Descripción |
|--------|-------------|
| `pendiente_confirmar` | VAA ha seleccionado el proveedor pero aún no ha recibido confirmación de disponibilidad. |
| `activo` | Proveedor seleccionado y disponibilidad confirmada por el proveedor. |
| `confirmado_deposito` | Depósito pagado al proveedor. Servicio asegurado. |
| `servicio_completado` | El servicio se prestó. Sin incidencias relevantes. |
| `servicio_con_incidencia` | El servicio se prestó pero con incidencia registrada en `incidencias_proveedores_v1`. |
| `sustituido` | Este proveedor fue reemplazado por otro. Historial conservado. Nunca borrar. |
| `cancelado_vaa` | VAA canceló el servicio (expediente cancelado o cambio de planificación). |
| `cancelado_proveedor` | El proveedor retiró su confirmación o disponibilidad. |

---

## Definición completa de campos

### Bloque `_meta`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `id_seleccion` | string | ✅ | Identificador único. Formato: `SEL-AAAA-NNNN` |
| `fecha_creacion` | datetime | ✅ | Cuándo se creó el registro |
| `fecha_actualizacion` | datetime | ✅ | Última modificación |
| `creado_por` | string | ✅ | Quién creó el registro (normalmente "Abdu") |
| `version_esquema` | string | ✅ | Versión del esquema |

### Bloque `referencias`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `id_expediente` | string | ✅ | `VAA-AAAA-NNNN` — expediente al que pertenece este servicio |
| `id_proveedor` | string | ✅ | `PRV-AAAA-NNNN` — proveedor seleccionado |
| `id_presupuesto` | string | ✅ | `PRS-AAAA-NNNN` — presupuesto sobre el que se basa la selección |

### Bloque `servicio`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `tipo_servicio` | enum | ✅ | Ver tabla de tipos |
| `ciudad` | string | Condicional | Obligatorio si el servicio es por ciudad. Null para ruta completa o seguro. |
| `descripcion` | string | ✅ | Descripción operativa del servicio. Ej: "Alojamiento 4 noches Sevilla, 3 hab + 1 operativa, con desayuno" |
| `fecha_inicio` | date | ✅ | Inicio del servicio |
| `fecha_fin` | date | Condicional | Fin del servicio. Obligatorio para alojamiento. |
| `noches` | int | ❌ | Número de noches (para alojamiento) |
| `dias` | int | ❌ | Número de días (para servicios diarios) |

### Bloque `contacto_operativo`

Contacto rápido para el día del servicio. Puede diferir del contacto general del proveedor.

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `nombre` | string | ✅ | Nombre de la persona de contacto operativo |
| `cargo` | string | ❌ | Cargo |
| `telefono` | string | ✅ | Teléfono directo |
| `whatsapp` | string | ❌ | WhatsApp si disponible |
| `email` | string | ❌ | Email operativo |
| `disponibilidad` | string | ❌ | Horario o condiciones. Ej: "24h durante el servicio", "L–V 9:00–18:00" |
| `nota` | string | ❌ | Observaciones de contacto. Ej: "Llamar a Juan, no a la oficina general" |

### Bloque `deadlines`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `deadline_respuesta` | datetime | ✅ | Fecha límite para que el proveedor confirme disponibilidad. Si no responde antes, buscar alternativa. |
| `deadline_confirmacion` | datetime | ✅ | Fecha límite para confirmar y pagar depósito. Pasada esta fecha el proveedor puede liberar disponibilidad. |
| `deadline_documentacion` | datetime | ❌ | Fecha límite para recibir documentación del proveedor (certificación halal, licencias, etc.) |
| `alerta_deadline_activa` | bool | ✅ | Si true, requiere seguimiento activo. |
| `notas_deadlines` | string | ❌ | Observaciones sobre plazos |

### Bloque `decision`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `estado` | enum | ✅ | Estado actual de la selección |
| `motivo_seleccion` | string | ✅ | Por qué se eligió este proveedor. Campo obligatorio — sin justificación la selección no es válida. |
| `seleccionado_por` | string | ✅ | Quién tomó la decisión (normalmente "Abdu") |
| `fecha_decision` | datetime | ✅ | Cuándo se tomó la decisión |
| `alternativas_evaluadas` | array | ❌ | IDs de presupuestos (`PRS-AAAA-NNNN`) que se descartaron en favor de este |
| `_nota_alternativas` | — | — | El motivo de rechazo de cada alternativa se documenta en su propio registro PRS |

### Bloque `economico`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `coste_confirmado` | decimal | ✅ | Importe acordado con el proveedor en EUR |
| `coste_base_presupuesto` | decimal | ✅ | Importe del presupuesto original (foto fija — no modificar) |
| `variacion_importe` | decimal | ❌ | `coste_confirmado - coste_base_presupuesto`. Positivo = subió, negativo = bajó. |
| `variacion_motivo` | string | Condicional | Obligatorio si `variacion_importe != 0` |
| `moneda` | string | ✅ | Siempre "EUR" |
| `iva_incluido` | bool | ✅ | Si el IVA está incluido en el coste confirmado |

### Bloque `condiciones_confirmadas`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `deposito_requerido` | bool | |
| `deposito_pct` | decimal | |
| `deposito_importe` | decimal | |
| `deposito_pagado` | bool | |
| `deposito_fecha_pago` | date | |
| `deposito_referencia` | string | Referencia o justificante de pago |
| `plazo_cancelacion` | string | Texto libre con la política |
| `politica_noshow` | string | |
| `notas_condiciones` | string | |

### Bloque `confirmacion_proveedor`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `confirmado` | bool | El proveedor confirmó disponibilidad |
| `fecha_confirmacion` | datetime | |
| `localizador` | string | Número de reserva / localizador del proveedor |
| `metodo_confirmacion` | enum | `email`, `whatsapp`, `telefono`, `web`, `otro` |
| `documento_confirmacion` | string | Ruta al documento de confirmación |
| `notas_operativas` | string | |

### Bloque `historial_cambios`

Array inmutable de todos los cambios de estado. Cada cambio añade una nueva entrada.

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `fecha` | datetime | ✅ | Cuándo ocurrió el cambio |
| `tipo_cambio` | enum | ✅ | `creacion`, `activacion`, `sustitucion`, `cancelacion`, `modificacion_estado`, `deposito_pagado` |
| `estado_anterior` | enum | ✅ | Estado antes del cambio |
| `estado_nuevo` | enum | ✅ | Estado después del cambio |
| `motivo` | string | ✅ (en sustitución/cancelación) | Por qué se realizó el cambio |
| `realizado_por` | string | ✅ | Quién hizo el cambio |
| `id_seleccion_nueva` | string | Condicional | Si es sustitución: ID del nuevo registro SEL que reemplaza a este |

**Regla del historial:** El historial es inmutable. No se modifica ni se borra ninguna entrada. Solo se añaden entradas nuevas.

---

## Proceso operativo

### Al seleccionar un proveedor

1. Verificar que existe `PRS-AAAA-NNNN` del proveedor para este expediente.
2. Crear registro `SEL-AAAA-NNNN` con estado `pendiente_confirmar`.
3. Registrar `deadline_respuesta` y `deadline_confirmacion`.
4. Registrar `contacto_operativo` del responsable de este servicio.
5. Documentar `motivo_seleccion` y `alternativas_evaluadas`.

### Al recibir confirmación del proveedor

1. Cambiar estado a `activo`.
2. Registrar `confirmacion_proveedor.localizador`.
3. Añadir entrada al `historial_cambios`.

### Al pagar depósito

1. Cambiar estado a `confirmado_deposito`.
2. Registrar `deposito_pagado = true`, `deposito_fecha_pago`, `deposito_referencia`.

### Al cambiar de proveedor (sustitución)

1. En el SEL existente: cambiar estado a `sustituido`. Añadir entrada en `historial_cambios` con motivo y `id_seleccion_nueva`.
2. Crear nuevo SEL para el nuevo proveedor.
3. En el PRS del proveedor sustituido: cambiar estado a `rechazado` con `motivo_rechazo`.

**Nunca borrar el SEL original. Su historial debe permanecer.**

### Al completar el servicio

1. Si no hubo incidencias: estado → `servicio_completado`.
2. Si hubo incidencias: estado → `servicio_con_incidencia`. Registrar incidencia en `incidencias_proveedores_v1`.

---

## Riesgos específicos

| Riesgo | Mitigación |
|--------|-----------|
| Seleccionar sin presupuesto guardado | `id_presupuesto` es OBLIGATORIO en el esquema |
| Dos selecciones activas para el mismo servicio | Validar unicidad antes de activar una nueva selección |
| Sustitución sin historial | `motivo` obligatorio en `historial_cambios` para tipo `sustitucion` |
| `deadline_confirmacion` vencido sin acción | `alerta_deadline_activa = true` mientras no se confirme depósito |
| Servicio completado sin actualizar estado | Al cerrar expediente, revisar que todos los SEL estén en estado final |

---

*Documento interno. No distribuir fuera de Bin Firnas Travel SL.*

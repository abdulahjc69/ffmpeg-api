# Presupuestos de Proveedores VAA — v1.0

**Empresa:** Bin Firnas Travel SL  
**Marca:** Vive al Ándalus  
**Versión:** 1.0  
**Fecha creación:** 2026-06-10  
**Responsable:** Abdulah Jiménez Contreras  
**Documento paralelo:** `presupuestos_proveedores_v1.json`

---

## Finalidad

El registro de presupuestos de proveedores es la memoria económica de Vive al Ándalus. Cada presupuesto recibido —sea de un hotel, un transportista, un restaurante o cualquier otro proveedor— queda registrado de forma permanente.

Este registro permite:
- Conocer en todo momento qué proveedor ofrece qué precio y en qué condiciones.
- Comparar precios entre proveedores para un mismo servicio.
- Analizar la evolución histórica de precios por proveedor y por ciudad.
- Documentar por qué se eligió un proveedor sobre otro.
- Conservar los presupuestos rechazados como inteligencia comercial para futuras negociaciones.

---

## Filosofía de uso

### Ley fundamental: ningún presupuesto se elimina

Un presupuesto recibido es un hecho histórico. Independientemente de si fue aceptado, rechazado, caducado, cancelado, o si el proveedor dejó de responder: el registro permanece para siempre.

Un proveedor puede ser rechazado. Su presupuesto no.

### Separación estricta presupuesto ↔ proveedor ↔ expediente

- Un presupuesto es de un **proveedor** (referenciado por `id_proveedor`).
- Un presupuesto puede estar asociado a un **expediente** (referenciado por `id_expediente`), pero también puede existir sin expediente (consulta libre, comparativa de mercado, cotización especulativa).
- El expediente solo guarda el ID del presupuesto seleccionado. Nunca duplica los datos del presupuesto.

### Moneda operativa oficial

Todos los importes se registran en **EUR (euros)**.  
En v1.0 no se implementan conversiones de divisas. Si un proveedor cotiza en otra moneda, registrar el equivalente en EUR al tipo de cambio del día de recepción, anotando en `nota_conversion` la moneda original, el importe original y el tipo de cambio aplicado.

### Un presupuesto por proveedor por ciudad por expediente

Si el mismo proveedor cotiza dos veces para el mismo servicio (precio actualizado, condiciones mejoradas), ambos registros se conservan como presupuestos independientes con fechas distintas. Nunca se sobreescribe un presupuesto.

---

## Estados del presupuesto

| Estado | Descripción |
|--------|-------------|
| `recibido` | El presupuesto ha llegado. Pendiente de revisar por Abdu. |
| `en_revision` | Abdu está evaluando este presupuesto activamente. |
| `seleccionado` | Este proveedor fue elegido para el servicio en este expediente. |
| `reserva_confirmada` | El servicio fue confirmado y el depósito fue pagado al proveedor. |
| `rechazado` | No fue seleccionado. Motivo obligatoriamente documentado. |
| `caducado` | La fecha de validez venció sin que se tomara una decisión. |
| `cancelado_proveedor` | El proveedor retiró el presupuesto o dejó de responder. |
| `anulado` | El expediente fue cancelado antes de confirmar este servicio. |

### Regla de unicidad del estado `seleccionado`

Por cada combinación de `[id_expediente + tipo_servicio + ciudad]`, solo puede haber **un presupuesto** con `estado = seleccionado`. Si se cambia de proveedor seleccionado, el anterior pasa a `rechazado` (con motivo documentado), y el nuevo pasa a `seleccionado`.

---

## Definición completa de campos

### Bloque `_meta`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `id_presupuesto` | string | ✅ | Identificador único. Formato: `PRS-AAAA-NNNN` |
| `fecha_recepcion` | datetime | ✅ | Cuándo llegó el presupuesto a VAA |
| `fecha_validez` | date | ❌ | Hasta cuándo es válido según el proveedor |
| `registrado_por` | string | ✅ | Quién lo registró (normalmente "Abdu") |
| `fuente` | enum | ✅ | Canal por el que llegó |
| `version_esquema` | string | ✅ | Versión del esquema |

**Fuentes posibles:** `email`, `whatsapp`, `telefono`, `web_proveedor`, `en_persona`, `otro`

### Bloque `proveedor`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `id_proveedor` | string | ✅ | Referencia al maestro de proveedores. Formato: `PRV-AAAA-NNNN` |
| `nombre_comercial` | string | ✅ | Desnormalizado. Foto fija del nombre en el momento de recepción. |
| `tipo` | enum | ✅ | Tipo de proveedor al momento del presupuesto. |

**Nota sobre desnormalización:** `nombre_comercial` se copia en el presupuesto para que el registro histórico sea inmutable incluso si el nombre del proveedor cambia en el futuro.

### Bloque `expediente`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `id_expediente` | string | ❌ | Referencia al expediente VAA. Puede ser null en cotizaciones libres. |
| `ciudad` | string | ✅ | Ciudad del servicio |
| `servicio` | string | ✅ | Descripción breve del servicio cotizado |
| `tipo_servicio` | enum | ✅ | Categoría del servicio |

**Tipos de servicio posibles:** `alojamiento`, `transporte_ruta`, `transfer_llegada`, `transfer_salida`, `restauracion`, `guia_local`, `tour_leader`, `entrada_monumento`, `actividad`, `otro`

### Bloque `fechas_servicio`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `fecha_entrada` | date | ✅ | Inicio del servicio |
| `fecha_salida` | date | ❌ | Fin del servicio (si aplica) |
| `noches` | int | ❌ | Número de noches (para alojamiento) |
| `dias` | int | ❌ | Número de días (para servicios diarios) |

### Bloque `grupo`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `adultos` | int | ✅ | Número de adultos |
| `menores` | int | ✅ | Número de menores |
| `total_pax` | int | ✅ | Total viajeros |

### Bloque `importe`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `moneda` | string | ✅ | Siempre "EUR" en v1.0 |
| `importe_total` | decimal | ✅ | Importe total cotizado en EUR |
| `importe_por_pax` | decimal | ❌ | Calculado: importe_total / total_pax |
| `importe_por_noche` | decimal | ❌ | Calculado: importe_total / noches (si aplica) |
| `importe_por_hab_noche` | decimal | ❌ | Calculado: para alojamiento |
| `base_calculo` | string | ✅ | Descripción de qué incluye. Ej: "por hab/noche con desayuno incluido" |
| `iva_incluido` | bool | ✅ | Si el IVA está incluido en el importe |
| `nota_conversion` | string | ❌ | Si el proveedor cotizó en otra moneda: moneda original, importe original, tipo de cambio aplicado |

### Bloque `detalle_lineas`

Array de líneas de presupuesto detalladas. Opcional pero muy recomendable cuando el proveedor envía desglose.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `concepto` | string | Descripción de la línea |
| `cantidad` | decimal | Cantidad (noches, pax, unidades) |
| `precio_unitario` | decimal | Precio por unidad |
| `subtotal` | decimal | cantidad × precio_unitario |
| `nota` | string | Observaciones de la línea |

### Bloque `condiciones`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `deposito_requerido` | bool | Si se requiere depósito para reservar |
| `deposito_pct` | decimal | Porcentaje del depósito (ej: 30 para 30%) |
| `deposito_importe` | decimal | Importe del depósito en EUR |
| `plazo_cancelacion` | string | Política de cancelación en texto libre |
| `politica_noshow` | string | Política de no-show |
| `vigencia_presupuesto` | string | Hasta cuándo es válido según el proveedor |
| `notas_condiciones` | string | Cualquier otra condición relevante |

### Bloque `estado_presupuesto`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `estado_actual` | enum | Estado actual del presupuesto |
| `seleccionado` | bool | Si este fue el presupuesto elegido |
| `motivo_rechazo` | string | Obligatorio si estado = rechazado o cancelado_proveedor |
| `fecha_decision` | date | Cuándo se tomó la decisión |
| `decision_tomada_por` | string | Quién decidió (normalmente "Abdu") |

### Bloque `archivos_adjuntos`

Array de archivos asociados al presupuesto (PDF, emails, etc.).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `nombre` | string | Nombre del archivo |
| `tipo` | string | "pdf", "email", "imagen", "otro" |
| `ruta` | string | Ruta de almacenamiento interno |
| `fecha_adjunto` | date | Cuándo se adjuntó |

---

## Cómo usar este sistema en operación real

### Al recibir un presupuesto

1. Abrir nuevo registro con `id_presupuesto` siguiente en secuencia.
2. Registrar `fecha_recepcion` inmediatamente (dato crítico para histórico).
3. Rellenar bloque `proveedor` referenciando `id_proveedor` del maestro.
4. Rellenar `importe_total` y `base_calculo`.
5. Estado inicial: `recibido`.

### Al tomar una decisión

- Si se selecciona: cambiar `estado_actual` a `seleccionado` y `seleccionado = true`.
- Si se rechaza: cambiar a `rechazado` y documentar `motivo_rechazo`.
- Ambas acciones deben realizarse. El presupuesto no seleccionado permanece en el sistema.

### Nunca

- Nunca eliminar un presupuesto.
- Nunca sobreescribir `importe_total` si el proveedor da un precio nuevo: crear un nuevo registro.
- Nunca marcar como `seleccionado = true` sin verificar que no hay otro registro con el mismo estado para el mismo servicio/ciudad/expediente.

---

## Riesgos detectados

| Riesgo | Impacto | Mitigación |
|--------|---------|-----------|
| No registrar el presupuesto inmediatamente al recibirlo | Crítico | Regla de negocio: ningún presupuesto se evalúa sin haberlo registrado primero. |
| `motivo_rechazo` vacío en presupuestos rechazados | Alto | Conocimiento perdido. Campo obligatorio a nivel de protocolo operativo. |
| Dos presupuestos `seleccionado = true` para el mismo servicio | Alto | Validar antes de marcar seleccionado. Desmarcar el anterior explícitamente. |
| Importes en divisas sin nota de conversión | Medio | Protocolo: si llega en divisa no EUR, registrar equivalente EUR + nota de conversión siempre. |
| Presupuestos de cotizaciones libres sin `id_expediente` que luego se pierden | Medio | Etiquetar con `tipo_consulta: libre` y ciudad relevante para que sean recuperables. |

---

## Recomendaciones para v1.1

1. **Métricas de histórico de precios**: Una vez haya ≥5 presupuestos por proveedor, calcular `precio_medio`, `variacion_anual`, `indice_estabilidad`.
2. **Módulo de comparativa**: Dado un expediente, listar todos los presupuestos recibidos para el mismo servicio/ciudad ordenados por `importe_por_pax`.
3. **Alerta de precio atípico**: Si el nuevo presupuesto de un proveedor supera en >20% su media histórica, activar alerta.
4. **Integración con scoring**: Cada presupuesto seleccionado debería alimentar la dimensión `relacion_calidad_precio` del scoring del proveedor.
5. **Archivo digital de PDFs**: Sistema de almacenamiento de los presupuestos en PDF que adjuntan los proveedores.

---

*Documento interno. No distribuir fuera de Bin Firnas Travel SL.*

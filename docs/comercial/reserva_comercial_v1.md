# Reserva Comercial VAA — v1.0

**Empresa:** Bin Firnas Travel SL  
**Marca:** Vive al Ándalus  
**Versión:** 1.1  
**Fecha creación:** 2026-06-10  
**Responsable:** Abdulah Jiménez Contreras  
**Documento paralelo:** `reserva_comercial_v1.json`

---

## Finalidad

La reserva comercial es el contrato interno de VAA. Nace cuando el cliente acepta la propuesta y realiza el primer pago (30%). A partir de ese momento, la reserva es el documento vivo que registra el estado financiero, operativo y documental del viaje hasta su cierre.

Una propuesta aceptada sin reserva abierta es un error operativo grave. Una reserva sin `responsable_actual` actualizado es una reserva ciega.

---

## Principios fundamentales

### Las reservas no se borran

Una reserva permanece en el sistema independientemente de su estado final. Las reservas canceladas, en disputa o cerradas se archivan con su historial completo.

### El dinero manda

El estado financiero (`estado_financiero`) es el indicador más crítico. Sin 30% confirmado, la reserva no activa operativa. Sin 100% confirmado antes del viaje, el viaje no sale.

### Responsable siempre definido

En todo momento debe existir exactamente un `responsable_actual`. Si no hay responsable asignado, el sistema está en fallo. Abdu debe resolver la ambigüedad inmediatamente.

### El historial es inmutable

Cada cambio de estado, cada pago registrado, cada acción relevante se añade al `historial`. Nada se edita; solo se añade. El historial es la memoria legal de la operación.

### Separación de responsabilidades

La reserva referencia proveedores por `id_proveedor` y pagos por `id_pago`. Nunca duplica datos del maestro de proveedores ni del expediente.

---

## Identificadores

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Reserva | `RES-AAAA-NNNN` | `RES-2026-0001` |
| Pago | `PAG-AAAA-NNNN` | `PAG-2026-0001` |
| Propuesta origen | `PRO-AAAA-NNNN-Vn` | `PRO-2026-0087-V2` |
| Expediente | `VAA-AAAA-NNNN` | `VAA-2026-0087` |

---

## Estados de la reserva

| Estado | Descripción |
|--------|-------------|
| `creada` | Reserva abierta. Esperando primer pago (30%). |
| `primer_pago_pendiente` | Primer pago esperado pero no confirmado aún. |
| `primer_pago_confirmado` | 30% recibido. Se activa la operativa con proveedores. |
| `en_operacion` | Proveedores contactados. Confirmaciones en proceso. |
| `proveedores_confirmados` | Todos los servicios clave confirmados con localizador. |
| `pago_completo_pendiente` | Operativa lista. Esperando el 70% restante. |
| `pago_completo_confirmado` | 100% recibido. Documentación en preparación. |
| `documentacion_enviada` | Vouchers y programa enviados al cliente. |
| `en_destino` | Grupo actualmente en viaje. |
| `viaje_completado` | El grupo ha regresado. Pendiente cierre administrativo. |
| `cerrada` | Cierre completo. Toda la documentación y pagos en orden. |
| `cancelada` | Cancelada. Aplicadas las condiciones de cancelación. |
| `en_disputa` | Existe reclamación activa del cliente o proveedor. |

**Regla de activación operativa:** La operativa con proveedores solo se activa al llegar al estado `primer_pago_confirmado`. Nunca antes.

**Regla de viaje:** El viaje solo sale si el estado es `pago_completo_confirmado` o superior, y `estado_financiero.porcentaje_cobrado = 100`.

---

## Responsable actual

El bloque `responsable_actual` resuelve en todo momento quién tiene la pelota.

### Valores posibles

| Valor | Descripción |
|-------|-------------|
| `cliente` | El cliente debe realizar una acción (pagar, confirmar datos, enviar documentos). |
| `abdu` | Abdu debe tomar una acción (contactar proveedor, enviar propuesta, resolver incidencia). |
| `proveedor` | Un proveedor debe confirmar un servicio o responder a una solicitud. |
| `sistema` | Acción automatizada pendiente (recordatorio programado, alerta disparada). |
| `tour_leader` | El tour leader debe actuar (reportar, gestionar en destino). |
| `delegado` | Persona explícitamente designada por Abdu para una acción concreta. |

### Campos del bloque

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `responsable_actual` | enum | ✅ | Quién tiene la acción pendiente |
| `proxima_accion` | string | ✅ | Descripción concreta de qué debe hacer |
| `fecha_limite_accion` | datetime | ✅ | Cuándo debe completarse la acción |
| `prioridad_accion` | enum | ✅ | `baja`, `media`, `alta`, `critica` |

**Regla:** Cada vez que se completa una acción y se registra en el historial, el bloque `responsable_actual` debe actualizarse para reflejar la siguiente acción. Un `responsable_actual` desactualizado es un error operativo.

---

## Definición completa de campos

### Bloque `_meta`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `id_reserva` | string | ✅ | `RES-AAAA-NNNN` |
| `fecha_creacion` | datetime | ✅ | Cuándo se abrió la reserva |
| `creado_por` | string | ✅ | Quién creó la reserva |
| `version_esquema` | string | ✅ | Versión del esquema |
| `ultima_modificacion` | datetime | ✅ | Última vez que se actualizó cualquier campo |

### Bloque `referencias`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `id_expediente` | string | ✅ | Expediente al que pertenece esta reserva |
| `id_propuesta_origen` | string | ✅ | Propuesta que dio origen a esta reserva |
| `version_propuesta` | string | ✅ | Versión de la propuesta aceptada |
| `fecha_aceptacion_propuesta` | date | ✅ | Cuándo el cliente aceptó formalmente |

### Bloque `cliente`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `nombre_completo` | string | ✅ | Desnormalizado. Foto fija en el momento de la reserva. |
| `email` | string | ✅ | Email de contacto del cliente |
| `telefono` | string | ✅ | Teléfono de contacto |
| `pais_residencia` | string | ✅ | País de residencia |
| `idioma_preferido` | enum | ✅ | `es`, `en`, `fr`, `pt`, `ar` |
| `num_pax` | int | ✅ | Número de viajeros total |
| `num_adultos` | int | ✅ | Adultos |
| `num_menores` | int | ✅ | Menores |
| `edades_menores` | array | Condicional | Obligatorio si `num_menores > 0` |
| `necesidades_especiales` | string | ❌ | Movilidad reducida, alergias, etc. |

### Bloque `estado_reserva`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `estado` | enum | ✅ | Estado actual (ver tabla de estados) |
| `fecha_ultimo_cambio_estado` | datetime | ✅ | Cuándo cambió al estado actual |
| `motivo_cambio_estado` | string | ✅ | Por qué cambió el estado |
| `cancelada` | bool | ✅ | Si la reserva fue cancelada |
| `motivo_cancelacion` | string | Condicional | Obligatorio si `cancelada = true` |
| `fecha_cancelacion` | date | Condicional | Obligatorio si `cancelada = true` |
| `penalizacion_cancelacion_eur` | decimal | Condicional | Importe de penalización si aplica |

### Bloque `estado_financiero`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `precio_total_venta_eur` | decimal | ✅ | Precio total acordado con el cliente |
| `coste_total_proveedores_eur` | decimal | ✅ | Coste total de proveedores |
| `margen_bruto_eur` | decimal | ✅ | `precio_total_venta - coste_total_proveedores` |
| `margen_porcentaje` | decimal | ✅ | `margen_bruto / precio_total_venta * 100` |
| `total_cobrado_eur` | decimal | ✅ | Total recibido del cliente hasta la fecha |
| `total_pendiente_cobro_eur` | decimal | ✅ | `precio_total_venta - total_cobrado` |
| `porcentaje_cobrado` | decimal | ✅ | `total_cobrado / precio_total_venta * 100` |
| `total_pagado_proveedores_eur` | decimal | ✅ | Total pagado a proveedores |
| `total_pendiente_pago_proveedores_eur` | decimal | ✅ | Pendiente de pagar a proveedores |
| `fecha_limite_pago_completo` | date | ✅ | Fecha máxima para recibir el 100% del cliente |
| `metodo_pago_cliente` | string | ❌ | Transferencia, Bizum, etc. |

**Regla de margen:** Si `margen_porcentaje < 20`, alerta automática. El margen mínimo operativo de VAA es 20%.

### Bloque `estado_documentacion`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `contrato_firmado` | bool | ✅ | Si el cliente ha firmado el contrato |
| `fecha_firma_contrato` | date | Condicional | Obligatorio si `contrato_firmado = true` |
| `pasaportes_recibidos` | bool | ✅ | Si VAA tiene copia de todos los pasaportes |
| `fecha_recepcion_pasaportes` | date | Condicional | Obligatorio si `pasaportes_recibidos = true` |
| `vouchers_generados` | bool | ✅ | Si los vouchers han sido generados |
| `vouchers_enviados` | bool | ✅ | Si los vouchers han sido enviados al cliente |
| `programa_enviado` | bool | ✅ | Si el programa definitivo fue enviado al cliente (C04 enviado) |
| `programa_definitivo_cerrado` | bool | ✅ | Si el programa definitivo ha sido aprobado por Abdu y está listo para enviar. `false` por defecto. **C04 no puede enviarse si este campo es `false`.** |
| `programa_definitivo_aprobado_por` | string | Condicional | Obligatorio si `programa_definitivo_cerrado = true`. Nombre del aprobador humano. Solo Abdu o aprobador autorizado. |
| `programa_definitivo_fecha_aprobacion` | datetime | Condicional | Obligatorio si `programa_definitivo_cerrado = true`. Fecha y hora exacta de la aprobación. |
| `seguro_viaje` | bool | ✅ | Si el cliente tiene seguro de viaje |
| `notas_documentacion` | string | ❌ | Observaciones sobre documentación |

**Regla de programa definitivo:**
`programa_definitivo_cerrado` solo puede pasar a `true` mediante acción humana explícita de Abdu (o aprobador autorizado). Ninguna automatización puede activar este campo. El aprobador y la fecha de aprobación quedan registrados de forma permanente. Una vez `true`, cualquier cambio al programa obliga a volver a `false` y requerir nueva aprobación antes de poder enviar C04.

**Dependencia con C04:**
C04 (correo de documentación final al cliente) tiene como condición de disparo obligatoria `programa_definitivo_cerrado = true`. Un programa en borrador, provisional o no aprobado por Abdu **nunca puede enviarse al cliente como documentación definitiva**.

### Bloque `estado_proveedores`

Array de servicios con proveedores asociados.

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `id_seleccion` | string | ✅ | `SEL-AAAA-NNNN` del proveedor seleccionado |
| `id_proveedor` | string | ✅ | `PRV-AAAA-NNNN` |
| `nombre_proveedor` | string | ✅ | Desnormalizado |
| `tipo_servicio` | enum | ✅ | Tipo de servicio (alojamiento, transporte, etc.) |
| `descripcion_servicio` | string | ✅ | Qué servicio presta en esta reserva |
| `confirmado` | bool | ✅ | Si el servicio está confirmado por el proveedor |
| `localizador` | string | Condicional | Obligatorio si `confirmado = true` |
| `fecha_confirmacion` | date | Condicional | Obligatorio si `confirmado = true` |
| `coste_eur` | decimal | ✅ | Coste de este servicio |
| `pagado` | bool | ✅ | Si VAA ha pagado al proveedor |
| `importe_pagado_eur` | decimal | Condicional | Obligatorio si `pagado = true` |
| `notas` | string | ❌ | Observaciones del servicio |

### Bloque `estado_operacion`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `fecha_entrada` | date | ✅ | Fecha de llegada del grupo |
| `fecha_salida` | date | ✅ | Fecha de salida del grupo |
| `num_noches` | int | ✅ | Número de noches |
| `destinos` | array | ✅ | Lista de destinos del programa |
| `tour_leader_asignado` | bool | ✅ | Si hay tour leader asignado |
| `id_tour_leader` | string | Condicional | Obligatorio si `tour_leader_asignado = true` |
| `nombre_tour_leader` | string | Condicional | Obligatorio si `tour_leader_asignado = true` |
| `notas_operacion` | string | ❌ | Observaciones operativas |

### Bloque `importes`

Resumen de importes. Complementa `estado_financiero` con desglose por concepto.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `desglose` | array | Array de conceptos con `concepto`, `importe_eur`, `tipo` (`ingreso`/`coste`) |
| `total_ingresos_eur` | decimal | Suma de todos los ingresos |
| `total_costes_eur` | decimal | Suma de todos los costes |
| `resultado_eur` | decimal | `total_ingresos - total_costes` |

### Bloque `pagos`

Array de pagos. Cada pago es un registro inmutable.

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `id_pago` | string | ✅ | `PAG-AAAA-NNNN` |
| `tipo` | enum | ✅ | `cobro_cliente` o `pago_proveedor` |
| `importe_eur` | decimal | ✅ | Importe del pago |
| `porcentaje_sobre_total` | decimal | ❌ | Si es cobro cliente, % sobre el precio total |
| `fecha_pago` | date | ✅ | Fecha del pago o cobro |
| `metodo` | string | ✅ | Método de pago |
| `concepto` | string | ✅ | Qué cubre este pago |
| `confirmado` | bool | ✅ | Si el pago está confirmado |
| `id_proveedor_destinatario` | string | Condicional | Si es pago a proveedor, su `PRV-AAAA-NNNN` |
| `comprobante` | string | ❌ | Referencia o archivo del comprobante |
| `notas` | string | ❌ | Observaciones del pago |

### Bloque `alertas`

Array de alertas activas. Las alertas alertan; no bloquean automáticamente.

| Código | Tipo | Disparador |
|--------|------|-----------|
| `ALT-001` | `pago_pendiente_cliente` | `total_pendiente_cobro > 0` y `fecha_limite_pago_completo - hoy ≤ 15 días` |
| `ALT-002` | `proveedor_sin_confirmar` | Servicio en `estado_proveedores` con `confirmado = false` y viaje en < 30 días |
| `ALT-003` | `margen_bajo` | `margen_porcentaje < 20` |
| `ALT-004` | `pasaportes_pendientes` | `pasaportes_recibidos = false` y viaje en < 21 días |
| `ALT-005` | `contrato_sin_firmar` | `contrato_firmado = false` y `primer_pago_confirmado = true` |
| `ALT-006` | `vouchers_no_enviados` | `vouchers_generados = true` y `vouchers_enviados = false` y viaje en < 7 días |
| `ALT-007` | `tour_leader_sin_asignar` | `tour_leader_asignado = false` y viaje en < 21 días |
| `ALT-008` | `cancelacion_proveedor` | Incidencia activa de tipo `cancelacion_proveedor` para esta reserva |
| `ALT-009` | `disputa_activa` | `estado = en_disputa` |
| `ALT-010` | `primer_pago_no_recibido` | `estado = primer_pago_pendiente` y han pasado 72h desde `fecha_creacion` |
| `ALT-011` | `pago_proveedor_vencido` | Pago a proveedor con fecha de vencimiento superada |
| `ALT-012` | `incidencia_halal` | Incidencia de tipo `incumplimiento_halal` asociada al expediente |
| `ALT-013` | `viaje_sin_seguro` | `seguro_viaje = false` y viaje en < 14 días |
| `ALT-014` | `programa_no_enviado` | `programa_enviado = false` y viaje en < 5 días |
| `ALT-015` | `responsable_no_definido` | `responsable_actual` vacío o nulo |
| `ALT-016` | `precio_modificado_proveedor` | Incidencia de tipo `cambio_condiciones` con impacto económico en esta reserva |
| `ALT-017` | `reserva_inactiva` | Estado `creada` o `primer_pago_pendiente` sin actividad en > 7 días |

### Bloque `responsable_actual`

Ver sección completa de [Responsable actual](#responsable-actual).

### Bloque `historial`

Array inmutable. Solo se añaden entradas; nunca se editan ni eliminan.

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `fecha` | datetime | ✅ | Cuándo ocurrió la acción |
| `accion` | string | ✅ | Descripción factual de la acción |
| `realizado_por` | string | ✅ | Quién realizó la acción |
| `estado_anterior` | enum | ❌ | Estado de la reserva antes (si cambió) |
| `estado_nuevo` | enum | ❌ | Estado de la reserva después (si cambió) |
| `notas` | string | ❌ | Contexto adicional |

---

## Proceso operativo

### Al abrir una reserva

1. Verificar que existe `id_propuesta_origen` con `aprobada = true` en `propuesta_comercial_v1`.
2. Crear la reserva en estado `creada`.
3. Asignar `responsable_actual = cliente`, `proxima_accion = "Realizar primer pago del 30%"`.
4. Registrar entrada en `historial`.

### Al recibir el primer pago (30%)

1. Registrar en bloque `pagos` con `id_pago` nuevo.
2. Actualizar `estado_financiero` (totales, porcentaje).
3. Cambiar estado a `primer_pago_confirmado`.
4. Cambiar `responsable_actual = abdu`, `proxima_accion = "Contactar proveedores y solicitar confirmación"`.
5. Registrar en `historial`.

### Al confirmar proveedores

1. Actualizar `estado_proveedores` con `confirmado = true` y `localizador`.
2. Cuando todos estén confirmados, cambiar estado a `proveedores_confirmados`.
3. Cambiar `responsable_actual = cliente`, `proxima_accion = "Realizar pago final (70% restante)"`.
4. Registrar en `historial`.

### Al recibir el pago completo

1. Registrar pago en `pagos`.
2. Actualizar `estado_financiero.porcentaje_cobrado = 100`.
3. Cambiar estado a `pago_completo_confirmado`.
4. Cambiar `responsable_actual = abdu`, `proxima_accion = "Generar y enviar documentación al cliente"`.
5. Registrar en `historial`.

### Al cancelar una reserva

1. Aplicar condiciones de cancelación de la propuesta original.
2. Documentar `motivo_cancelacion`, `fecha_cancelacion`, `penalizacion_cancelacion_eur`.
3. Cambiar estado a `cancelada`.
4. Gestionar devoluciones o cobros de penalización.
5. Registrar todo en `historial`. La reserva queda archivada, nunca borrada.

---

## Riesgos específicos

| Riesgo | Mitigación |
|--------|-----------|
| Activar operativa sin pago | Regla: `primer_pago_confirmado` antes de contactar proveedores. |
| `responsable_actual` desactualizado | Obligatorio actualizar en cada cambio de estado o acción relevante. |
| Margen inferior al mínimo | ALT-003 alerta. Abdu decide si continuar o renegociar. |
| Viaje sin pago completo | ALT-001 alerta. El viaje no sale sin `porcentaje_cobrado = 100`. |
| Proveedor sin confirmar al vuelo | ALT-002 alerta. Obliga a tener localizador antes de 30 días. |
| Historial editado | El historial es append-only. Nunca se edita una entrada existente. |
| Reserva abierta sin actividad | ALT-017 detecta reservas fantasma. Abdu las cierra o reactiva. |
| Propuesta no aprobada como origen | Verificación obligatoria: `propuesta.aprobada = true` antes de crear la reserva. |

---

*Documento interno. No distribuir fuera de Bin Firnas Travel SL.*

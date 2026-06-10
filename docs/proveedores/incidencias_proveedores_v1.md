# Incidencias de Proveedores VAA — v1.0

**Empresa:** Bin Firnas Travel SL  
**Marca:** Vive al Ándalus  
**Versión:** 1.0  
**Fecha creación:** 2026-06-10  
**Responsable:** Abdulah Jiménez Contreras  
**Documento paralelo:** `incidencias_proveedores_v1.json`

---

## Finalidad

El registro de incidencias es la memoria de fallos del sistema de proveedores de Vive al Ándalus. Cada incidencia documentada protege a VAA, a sus clientes y a futuros expedientes de repetir los mismos errores.

Una incidencia registrada no es un castigo al proveedor. Es el conocimiento institucional que permite a VAA tomar mejores decisiones: seguir trabajando con un proveedor con plena información, cambiar de proveedor con justificación, o bloquear un proveedor con evidencias documentadas.

---

## Filosofía de uso

### Una incidencia resuelta no se borra

Una incidencia documentada permanece en el sistema independientemente de si fue resuelta, compensada o perdonada. El estado cambia a `resuelta`, pero el registro permanece para siempre.

No registrar una incidencia "porque ya se resolvió" es el error más caro que puede cometer VAA.

### Los hechos, no los juicios

La descripción de una incidencia debe ser factual:
- ✅ "El conductor llegó 45 minutos tarde al aeropuerto. El grupo esperó en llegadas."
- ❌ "El conductor es un irresponsable."

Los hechos se documentan. Las valoraciones se reservan para `notas_internas`.

### Impacto sobre el estado del proveedor

Ciertas incidencias tienen efecto automático sobre el nivel estratégico del proveedor. El efecto se documenta en `consecuencias_proveedor` y se ejecuta manualmente por Abdu actualizando la ficha en `proveedores_maestro_v1`.

---

## Tipos de incidencia

| Código | Tipo | Ejemplos |
|--------|------|---------|
| `retraso` | Retraso | Conductor tarde, guía no aparece a la hora, transfer no llega |
| `no_respuesta` | No respuesta | Proveedor deja de contestar sin cancelar, no confirma en el plazo acordado |
| `overbooking` | Overbooking | Hotel sin habitaciones al llegar a pesar de confirmación con localizador |
| `cancelacion_proveedor` | Cancelación | Proveedor cancela confirmado con poco margen de tiempo |
| `cambio_condiciones` | Cambio condiciones | Sube precio ya confirmado, cambia régimen, modifica servicio sin avisar |
| `incumplimiento_halal` | Incumplimiento halal | Alcohol en mesa, carne sin certificar, productos de cerdo en bufé halal |
| `calidad_inferior` | Calidad inferior | Habitación peor que la categoría contratada, guía sin árabe real pese a confirmarlo, menú distinto al acordado |
| `error_documental` | Error documental | Factura incorrecta, falta de certificados prometidos, documentación tardía |
| `disputa_precio` | Disputa precio | Cobro distinto al acordado sin justificación |
| `queja_cliente` | Queja de cliente | Queja documentada del cliente sobre el proveedor durante el viaje |
| `accesibilidad` | Accesibilidad | Promesas de accesibilidad no cumplidas |
| `otro` | Otro | Con descripción obligatoria |

---

## Niveles de gravedad

| Gravedad | Criterio | Efecto sobre proveedor |
|----------|---------|------------------------|
| `baja` | Molestia menor. Resuelto en el momento sin impacto real al cliente. | Sin cambio de estado. Contador de incidencias +1. |
| `media` | Afectó a la operativa. Requirió gestión. Impacto leve al cliente. | Sin cambio de estado automático. Abdu evalúa. |
| `alta` | Perjuicio significativo al cliente o a VAA. Posible compensación económica. | Revisar cambio a `en_observacion`. Abdu decide. |
| `crítica` | Fallo grave: incumplimiento halal verificado, overbooking total, cancelación el día del servicio, conducta inaceptable. | Revisar cambio a `en_observacion` o `bloqueado`. Abdu decide. Alerta inmediata. |

**Regla especial de incumplimiento halal:** Cualquier incidencia de tipo `incumplimiento_halal`, con independencia de su gravedad, incrementa el contador `halal.incumplimientos_halal_count` en la ficha del proveedor. Este contador nunca decrece.

---

## Estados de la incidencia

| Estado | Descripción |
|--------|-------------|
| `abierta` | Registrada. Pendiente de gestión. |
| `en_gestion` | Abdu o el tour leader están gestionando la resolución. |
| `resuelta` | La incidencia fue resuelta. Puede haber habido compensación. |
| `cerrada_sin_resolucion` | No fue posible resolver. Documentado el motivo. |

---

## Definición completa de campos

### Bloque `_meta`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `id_incidencia` | string | ✅ | Identificador único. Formato: `INC-AAAA-NNNN` |
| `fecha_registro` | datetime | ✅ | Cuándo la registró VAA. Puede ser posterior a la fecha de ocurrencia. |
| `registrado_por` | string | ✅ | Quién la registró |
| `version_esquema` | string | ✅ | Versión del esquema |

### Bloque `contexto`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `id_proveedor` | string | ✅ | `PRV-AAAA-NNNN` — proveedor involucrado |
| `nombre_proveedor` | string | ✅ | Desnormalizado. Foto fija del nombre en el momento del registro. |
| `tipo_proveedor` | enum | ✅ | Tipo de proveedor en ese momento |
| `id_expediente` | string | ❌ | `VAA-AAAA-NNNN` — null si es incidencia fuera de expediente |
| `id_seleccion` | string | ❌ | `SEL-AAAA-NNNN` — null si no hay selección asociada |

### Bloque `incidencia`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `tipo` | enum | ✅ | Ver tabla de tipos |
| `fecha_ocurrencia` | datetime | ✅ | Cuándo sucedió la incidencia |
| `descripcion` | string | ✅ | Descripción factual. Hechos objetivos, no valoraciones. |
| `gravedad` | enum | ✅ | `baja`, `media`, `alta`, `critica` |
| `criterio_gravedad` | string | ✅ | Por qué se asignó ese nivel |
| `en_destino` | bool | ✅ | Si ocurrió mientras el grupo estaba en viaje |

### Bloque `impacto`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `impacto_cliente` | bool | ✅ | ¿El cliente lo sufrió directamente? |
| `descripcion_impacto_cliente` | string | Condicional | Obligatorio si `impacto_cliente = true` |
| `impacto_economico` | bool | ✅ | ¿Generó coste adicional para VAA? |
| `coste_adicional_eur` | decimal | Condicional | Si hubo coste económico para VAA |
| `descripcion_coste` | string | ❌ | En qué se materializó el coste |
| `queja_formal_cliente` | bool | ✅ | ¿El cliente presentó queja formal? |

### Bloque `resolucion`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `estado` | enum | Estado actual de la incidencia |
| `resuelta` | bool | Si la incidencia está resuelta |
| `fecha_resolucion` | date | Cuándo se resolvió |
| `como_se_resolvio` | string | Descripción de cómo se resolvió |
| `resuelto_por` | string | Quién gestionó la resolución |
| `compensacion_otorgada` | bool | Si el proveedor ofreció o VAA exigió compensación |
| `compensacion_tipo` | enum | `descuento`, `servicio_extra`, `reembolso`, `disculpa_formal`, `ninguna` |
| `compensacion_importe` | decimal | Si fue monetaria, importe en EUR |
| `compensacion_descripcion` | string | Descripción de la compensación |

### Bloque `consecuencias_proveedor`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `afecta_nivel_estrategico` | bool | Si Abdu decide cambiar el nivel estratégico del proveedor |
| `nivel_anterior` | enum | Nivel antes de la incidencia |
| `nivel_nuevo` | enum | Nivel asignado tras la incidencia |
| `motivo_cambio_nivel` | string | Justificación del cambio |
| `afecta_halal` | bool | Si incrementa `halal.incumplimientos_halal_count` |
| `incremento_halal_count` | int | Cuánto incrementa el contador halal (normalmente 1) |
| `decision_tomada_por` | string | Quién tomó la decisión sobre consecuencias |
| `fecha_decision_consecuencias` | date | |

### Bloque `accion_correctiva`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `aplica` | bool | Si se ha acordado o exigido una acción correctiva al proveedor |
| `descripcion` | string | Qué debe hacer el proveedor para evitar que se repita |
| `responsable` | string | Quién supervisa la acción |
| `fecha_limite` | date | Plazo para implementarla |
| `completada` | bool | Si el proveedor la ha implementado |

### Bloque `evidencias`

Array de archivos asociados a la incidencia.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `nombre` | string | Nombre del archivo |
| `tipo` | string | `foto`, `email`, `captura`, `documento`, `audio`, `otro` |
| `ruta` | string | Ruta de almacenamiento |
| `descripcion` | string | Qué muestra o documenta este archivo |
| `fecha` | date | Cuándo se obtuvo la evidencia |

---

## Efecto de la incidencia sobre el estado del proveedor

El sistema **no cambia automáticamente** el estado del proveedor. Abdu toma la decisión y la ejecuta manualmente en `proveedores_maestro_v1`. La incidencia solo documenta la recomendación.

**Guía de decisión:**

| Tipo incidencia | Gravedad | Recomendación |
|----------------|----------|---------------|
| Cualquier tipo | `baja` | Sin cambio de estado. Registrar y monitorizar. |
| Cualquier tipo | `media` | Sin cambio automático. Si se repite → revisar. |
| `incumplimiento_halal` | Cualquiera | Incrementar `incumplimientos_halal_count`. Si ≥2 → cambio de nivel halal. |
| Cualquier tipo | `alta` | Considerar pasar a `en_observacion`. Abdu decide. |
| `overbooking`, `cancelacion_proveedor` | `alta` o `critica` | Considerar `en_observacion`. Si reincidente → `bloqueado`. |
| `incumplimiento_halal` | `critica` | Considerar `bloqueado` directamente. |
| Cualquier tipo | `critica` | Revisión urgente. Puede llegar a `bloqueado`. |

---

## Proceso operativo

### Al detectar una incidencia

1. Registrar inmediatamente con `fecha_ocurrencia` y `descripcion` factual.
2. No esperar a la resolución para registrar. La incidencia se crea abierta.
3. Documentar evidencias (fotos, capturas, mensajes) en el momento.

### Al resolver la incidencia

1. Actualizar `resolucion.estado` a `resuelta`.
2. Documentar `como_se_resolvio` y compensación si hubo.
3. Evaluar `consecuencias_proveedor` y ejecutar cambios en el maestro si procede.

### Incidencia en destino (durante el viaje)

1. El tour leader reporta a Abdu la incidencia.
2. Abdu registra el INC aunque sea desde el teléfono con datos mínimos.
3. Se completa el registro al volver de la operación.
4. Evidencias: capturas de WhatsApp del tour leader, fotos, etc.

---

## Riesgos específicos

| Riesgo | Mitigación |
|--------|-----------|
| No registrar por "ya se resolvió" | Regla cultura: toda incidencia se registra. La resolución no elimina el registro. |
| Descripción subjetiva o valorativa | Campo `descripcion` debe ser factual. Las valoraciones van en `notas_internas`. |
| `incumplimiento_halal` sin actualizar contador | Al cerrar INC con `afecta_halal = true`, actualizar manualmente el maestro de proveedores. |
| Incidencia abierta olvidada | Campo `estado = abierta` o `en_gestion` requiere seguimiento activo. |
| Consecuencias sin ejecutar | El campo `nivel_nuevo` documenta la intención. Abdu debe ejecutar el cambio en el maestro. |

---

*Documento interno. No distribuir fuera de Bin Firnas Travel SL.*

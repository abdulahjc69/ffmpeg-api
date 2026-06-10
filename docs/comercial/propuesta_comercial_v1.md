# Propuesta Comercial VAA — v1.0

**Empresa:** Bin Firnas Travel SL  
**Marca:** Vive al Ándalus  
**Versión esquema:** 1.0  
**Fecha creación:** 2026-06-10  
**Responsable:** Abdulah Jiménez Contreras  
**Documento paralelo:** `propuesta_comercial_v1.json`

---

## ⚠️ REGLA ABSOLUTA — NUNCA NEGOCIABLE

> **Ninguna propuesta puede enviarse al cliente si `aprobacion_humana.aprobada = false`.**

Esta regla aplica sin excepción:
- Si la IA preparó la propuesta → `aprobada = false` hasta que Abdu o delegado autorizado la firme.
- Si el modo ausencia está activo → `aprobada = false` hasta que el delegado la apruebe dentro de sus límites.
- Si nadie ha revisado la propuesta → `aprobada = false` y no se envía.

Ninguna automatización, ningún sistema, ninguna herramienta puede cambiar `aprobada = true` sin intervención humana documentada.

---

## Finalidad

La propuesta comercial es el primer documento oficial con precio real que recibe el cliente. Define qué se le ofrece, cuánto cuesta, en qué condiciones y qué pasos debe seguir para confirmar.

No es el expediente interno. No es una confirmación. No es una factura. Es la oferta formal de Vive al Ándalus al cliente, redactada en su idioma, sin datos internos, con toda la información que necesita para decidir.

---

## Filosofía de uso

### La IA recomienda. El humano aprueba. Siempre.

La inteligencia artificial puede preparar, calcular, revisar y alertar. Puede redactar el borrador completo de una propuesta, calcular el precio con el margen correcto, detectar inconsistencias y avisar de riesgos.

Lo que la IA **nunca** puede hacer:
- Aprobar una propuesta oficialmente
- Comprometer un precio con el cliente
- Confirmar una venta
- Confirmar un pago
- Enviar la propuesta

La firma final es siempre humana. Esto no es una limitación técnica: es una decisión de gobierno empresarial. Bin Firnas Travel SL es responsable legal de cada propuesta enviada.

### La memoria es permanente

Ninguna versión de propuesta se elimina. Una propuesta v2 no borra la v1: la sustituye y la archiva. En cualquier momento futuro es posible saber exactamente qué se ofreció al cliente en cada versión, a qué precio, y por qué cambió.

### Los datos internos son inviolables

El cliente nunca verá costes de proveedores, márgenes, incidencias, negociaciones ni ningún dato interno. La separación entre lo que ve el cliente y lo que gestiona VAA es absoluta y permanente.

---

## Identificadores

```
id_propuesta formato:   PRO-AAAA-NNNN-Vn
  AAAA = año
  NNNN = número secuencial
  Vn   = versión (V1, V2, V3...)

Ejemplos:
  PRO-2026-0001-V1   → primera propuesta del expediente VAA-2026-0087
  PRO-2026-0001-V2   → revisión (mismo expediente, nueva versión)
  PRO-2026-0002-V1   → primer propuesta de otro expediente
```

---

## Estados de la propuesta

| Estado | Descripción |
|--------|-------------|
| `borrador` | En preparación. No enviada. `aprobada = false`. |
| `pendiente_aprobacion` | Preparada por IA o agente. Esperando firma humana. |
| `aprobada` | Aprobada por Abdu o delegado autorizado. Lista para enviar. |
| `enviada` | Enviada al cliente. Pendiente de respuesta. |
| `pendiente_respuesta` | Cliente acusó recibo pero no ha respondido. |
| `aceptada` | Cliente aceptó. Pendiente de pago del 30%. |
| `rechazada` | Cliente rechazó la propuesta. Documentar motivo. |
| `caducada` | Venció la fecha de validez sin respuesta del cliente. |
| `sustituida` | Reemplazada por versión posterior. Archivada permanentemente. |
| `cancelada` | El expediente fue cancelado antes de respuesta. |

**Regla de unicidad:** Solo una versión puede estar en estado `aprobada`, `enviada`, `pendiente_respuesta` o `aceptada` por expediente en un momento dado. Antes de activar una nueva versión, la anterior pasa a `sustituida`.

---

## Arquitectura de bloques

```
propuesta_comercial
├── _meta                          ← gestión interna del documento
├── referencias                    ← vínculos con expediente y sistema
├── cabecera_cliente               ← datos del cliente y grupo [VISIBLE]
├── itinerario                     ← resumen del viaje [VISIBLE]
├── servicios_incluidos            ← qué está incluido [VISIBLE]
├── servicios_no_incluidos         ← qué NO está incluido [VISIBLE]
├── precio_cliente                 ← cálculo para el cliente [VISIBLE]
├── condiciones                    ← cancelación, reserva, validez [VISIBLE]
├── documentacion_requerida        ← qué debe aportar el cliente [VISIBLE]
├── proximos_pasos                 ← cómo confirmar [VISIBLE]
├── pie_corporativo                ← identidad VAA [VISIBLE]
├── aprobacion_humana              ← gobierno comercial [INTERNO]
└── _datos_internos                ← costes, márgenes, alertas [INTERNO — NUNCA AL CLIENTE]
```

---

## Definición completa de campos

### Bloque `_meta`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `id_propuesta` | string | ✅ | `PRO-AAAA-NNNN-Vn` |
| `id_expediente` | string | ✅ | `VAA-AAAA-NNNN` — expediente al que pertenece |
| `version` | string | ✅ | `V1`, `V2`, `V3`... |
| `fecha_creacion` | datetime | ✅ | Cuándo se creó el borrador |
| `fecha_emision` | datetime | ❌ | Cuándo se envió al cliente (null hasta envío) |
| `fecha_validez` | date | ✅ | Hasta cuándo es válida la oferta |
| `estado` | enum | ✅ | Estado actual de la propuesta |
| `idioma` | enum | ✅ | Idioma de la propuesta. Fuente: `cliente.idioma_comunicacion` |
| `creada_por` | string | ✅ | Quién creó el borrador |
| `enviada_por` | string | ❌ | Quién envió (null hasta envío real) |
| `version_esquema` | string | ✅ | `1.0` |

**Regla de idioma:** El idioma de la propuesta debe coincidir con `expediente.cliente.idioma_comunicacion`. Si el idioma no está soportado, usar `en` como fallback. Nunca enviar en un idioma que el cliente no indicó.

**Regla de validez:**
- Temporada media/baja: 14 días naturales
- Temporada alta (julio–septiembre): 7 días
- Mínimo absoluto: 5 días
- Obligatorio en toda propuesta. Sin fecha de validez no se puede enviar.

### Bloque `referencias`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `id_expediente` | string | ✅ | Vínculo con el Expediente Maestro |
| `version_expediente` | string | ❌ | Versión del expediente al momento de crear la propuesta |
| `ids_selecciones` | array | ❌ | IDs de `SEL-AAAA-NNNN` que sustentan esta propuesta |
| `historial_versiones` | array | ✅ | Registro de todas las versiones de propuesta del expediente |

**Estructura de `historial_versiones`:**
```
{
  version:             "V1",
  id_propuesta:        "PRO-2026-0001-V1",
  fecha_emision:       "2026-06-15",
  fecha_validez:       "2026-06-29",
  precio_total:        12500.00,
  estado:              "sustituida",
  motivo_sustitucion:  "Actualización tarifa alojamiento Sevilla.",
  sustituida_por:      "PRO-2026-0001-V2",
  aprobada_por:        "Abdulah Jiménez Contreras"
}
```

### Bloque `cabecera_cliente` [VISIBLE AL CLIENTE]

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `nombre_cliente` | string | ✅ | Nombre + apellidos del cliente |
| `email_cliente` | string | ✅ | Email de contacto |
| `pais_cliente` | string | ✅ | País de residencia |
| `adultos` | int | ✅ | Número de adultos |
| `menores` | int | ✅ | Número de menores |
| `edades_menores` | array | ❌ | Edades de los menores (si aplica) |
| `total_viajeros` | int | ✅ | adultos + menores |
| `mensaje_personalizado` | string | ❌ | Mensaje especial de Abdu al cliente |

### Bloque `itinerario` [VISIBLE AL CLIENTE]

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `fecha_inicio` | date | ✅ | |
| `fecha_fin` | date | ✅ | |
| `duracion_noches` | int | ✅ | |
| `duracion_dias` | int | ✅ | duracion_noches + 1 |
| `ciudad_inicio` | string | ✅ | |
| `ciudad_final` | string | ✅ | |
| `ciudades_ruta` | array | ✅ | Lista ordenada de ciudades |
| `detalle_ciudades` | array | ✅ | Ciudad + noches + nota al cliente |
| `llegada_aeropuerto` | string | ❌ | Si incluye transfer llegada |
| `salida_aeropuerto` | string | ❌ | Si incluye transfer salida |
| `notas_especiales` | array | ❌ | Alertas al cliente (Alhambra, documentos, etc.) |

### Bloque `servicios_incluidos` [VISIBLE AL CLIENTE]

Lista de servicios incluidos en el precio. Redactados en el idioma del cliente. Nunca incluir nombres de proveedores.

Ejemplos de líneas:
- "Alojamiento 4 estrellas con desayuno en todas las ciudades"
- "Transporte privado exclusivo para el grupo durante toda la ruta"
- "Tour leader en árabe acompañando al grupo desde la llegada hasta la salida"
- "Guía local en árabe en Córdoba, Sevilla y Granada"
- "Almuerzos en restaurantes con certificación halal (10 días)"
- "Transfer privado aeropuerto de llegada y salida"
- "Entradas a monumentos principales incluidas"

### Bloque `servicios_no_incluidos` [VISIBLE AL CLIENTE]

Lista de lo que NO está incluido. Evita reclamaciones posteriores.

Ejemplos:
- "Vuelos internacionales"
- "Seguro de viaje"
- "Gastos personales y propinas"
- "Cenas (salvo las indicadas en el itinerario)"
- "Actividades opcionales no indicadas en la propuesta"

### Bloque `precio_cliente` [VISIBLE AL CLIENTE]

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `moneda` | string | ✅ | Siempre `EUR` |
| `precio_venta_final` | decimal | ✅ | Total que paga el cliente |
| `importe_reserva_30` | decimal | ✅ | `precio_venta_final × 0.30` |
| `importe_restante_70` | decimal | ✅ | `precio_venta_final × 0.70` |
| `precio_por_persona` | decimal | ❌ | `precio_venta_final / total_viajeros` |
| `precio_por_adulto` | decimal | ❌ | Si hay diferenciación por edad |
| `precio_por_menor` | decimal | ❌ | Si menores tienen precio distinto |
| `iva_nota` | string | ✅ | "Precio con todos los impuestos incluidos" |
| `nota_precio` | string | ❌ | Cualquier aclaración sobre el precio |

### Bloque `condiciones` [VISIBLE AL CLIENTE]

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `fecha_limite_reserva` | date | ✅ | Fecha límite para confirmar y pagar depósito |
| `condiciones_cancelacion` | string | ✅ | Política completa redactada para el cliente |
| `politica_noshow` | string | ✅ | Qué ocurre si el cliente no aparece |
| `condiciones_generales_url` | string | ✅ | `www.vivealandalus.com` |
| `nota_legal` | string | ✅ | Texto legal estándar de aceptación |
| `validez_oferta_texto` | string | ✅ | "Esta oferta es válida hasta [fecha_validez]." |

**Texto legal estándar:**
> "Al confirmar esta propuesta, el cliente declara haber leído y aceptado las Condiciones Generales de Contratación de Bin Firnas Travel SL disponibles en www.vivealandalus.com."

### Bloque `documentacion_requerida` [VISIBLE AL CLIENTE]

Array de documentos que el cliente debe aportar antes del viaje:
- Copia de pasaportes de todos los viajeros
- Datos completos de menores (nombre, edad, pasaporte)
- Información de seguro de viaje
- Cualquier requisito especial del destino

### Bloque `proximos_pasos` [VISIBLE AL CLIENTE]

Instrucciones claras de qué debe hacer el cliente para confirmar:
1. Confirmar la aceptación de la propuesta
2. Realizar el pago del 30% de reserva
3. Enviar la documentación requerida
4. Información de contacto directo con VAA

### Bloque `pie_corporativo` [VISIBLE AL CLIENTE]

```
Vive al Ándalus
BIN FIRNAS TRAVEL SL

Abdulah Jiménez Contreras
Teléfono: 633 30 59 06
Correo: reservas@vivealandalus.com
Web: www.vivealandalus.com

Condiciones generales, aviso legal y política de privacidad: www.vivealandalus.com
```

---

## Bloque `aprobacion_humana` [INTERNO]

Este bloque nunca se envía al cliente. Es el mecanismo de gobierno que garantiza que toda propuesta tiene una firma humana válida antes de salir del sistema.

### ⚠️ Regla absoluta (repetida — nunca omitir)

> **`aprobada = false` → la propuesta no puede enviarse al cliente bajo ninguna circunstancia.**

### Aprobadores válidos

| Rol | Código | Condiciones |
|-----|--------|-------------|
| Abdulah Jiménez Contreras | `abdu` | Sin restricciones de importe ni condiciones |
| Hermano / socio autorizado | `socio_autorizado` | Sin restricciones. Autorización permanente de Abdu. |
| Delegado autorizado | `delegado_autorizado` | Solo válido cuando `modo_ausencia_abdu = true` y dentro de los límites definidos |

### Campos del bloque

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `aprobada` | bool | ✅ | `false` por defecto. Solo `true` con firma humana documentada. |
| `aprobada_por` | string | Condicional | Nombre completo del aprobador. Obligatorio si `aprobada = true`. |
| `rol_aprobador` | enum | Condicional | `abdu`, `socio_autorizado`, `delegado_autorizado`. |
| `fecha_aprobacion` | datetime | Condicional | Obligatorio si `aprobada = true`. |
| `motivo_aprobacion` | string | ❌ | Observaciones del aprobador al revisar. |
| `aprobada_por_abdu` | bool | ✅ | Si Abdu firmó directamente. |
| `aprobada_por_delegado` | bool | ✅ | Si un delegado firmó (solo válido en modo ausencia). |

### Modo ausencia

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `modo_ausencia_abdu` | bool | ✅ | `false` por defecto. Solo `true` activado por Abdu. |
| `ausencia_desde` | datetime | Condicional | Inicio del período de ausencia. |
| `ausencia_hasta` | datetime | Condicional | Fin del período de ausencia. |
| `motivo_ausencia` | string | ❌ | Descripción del motivo. |
| `activado_por` | string | Condicional | Siempre debe ser "Abdulah Jiménez Contreras". |

**Regla crítica:** Solo Abdu puede activar `modo_ausencia_abdu = true`. Nadie más puede activarlo ni modificar sus parámetros.

### Delegado autorizado

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|:-----------:|-------------|
| `delegado_nombre` | string | Condicional | Nombre completo del delegado. |
| `delegado_rol` | string | Condicional | Rol o relación con VAA. |
| `autorizado_desde` | datetime | Condicional | Inicio de la autorización. |
| `autorizado_hasta` | datetime | Condicional | Fin de la autorización. |
| `limite_importe_autorizado` | decimal | Condicional | Importe máximo EUR que puede aprobar. |
| `margen_minimo_obligatorio` | decimal | Condicional | Margen mínimo % que el delegado debe respetar. |
| `requiere_revision_abdu` | bool | ✅ | Si `true`: el delegado puede aprobar y enviar, pero Abdu debe revisar a posteriori. Por defecto `true` en todas las delegaciones. |

### Condiciones para que el delegado pueda aprobar

El delegado puede aprobar **solo si se cumplen todas las condiciones simultáneamente:**

1. `modo_ausencia_abdu = true`
2. La fecha actual está entre `autorizado_desde` y `autorizado_hasta`
3. `precio_venta_final <= limite_importe_autorizado`
4. Margen calculado >= `margen_minimo_obligatorio`

Si **cualquiera** de estas condiciones falla → el delegado NO puede aprobar → la propuesta queda en `pendiente_aprobacion` hasta que Abdu intervenga.

### Recomendación de la IA

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `recomendacion_ia` | string | Texto de recomendación para el aprobador humano |
| `generada_por_ia` | bool | Si la propuesta fue preparada con ayuda de IA |
| `fecha_generacion_ia` | datetime | |
| `precio_calculado_ia` | decimal | Precio que la IA calculó como referencia |
| `margen_calculado_ia_pct` | decimal | Margen que la IA calculó como referencia |
| `alertas_ia` | array | Lista de alertas detectadas por la IA |

**Alertas que la IA puede generar** (orientativas, no vinculantes):
- `margen_bajo`: margen calculado por debajo del estándar
- `proveedor_en_observacion`: proveedor seleccionado con incidencias
- `halal_sin_certificar`: servicio halal sin verificación documentada
- `alhambra_sin_confirmar`: visita Alhambra sin entrada reservada
- `validez_corta`: temporada alta detectada, validez recomendada 7 días
- `deadline_ajustado`: poco margen entre validez propuesta y fecha del viaje

### Historial de aprobaciones

Array inmutable de cada evento de aprobación, rechazo o revisión.

```
{
  fecha:               datetime,
  accion:              enum ["preparada_ia", "enviada_revision", "aprobada",
                             "rechazada", "devuelta_revision",
                             "aprobada_delegado", "revision_abdu_posterior"],
  realizado_por:       string,
  rol:                 enum,
  precio_en_ese_momento: decimal,
  notas:               string
}
```

### Revisión posterior de Abdu

Cuando `requiere_revision_abdu = true` y el delegado aprobó en modo ausencia:
- La propuesta queda marcada como `pendiente_revision_abdu`
- Al volver, Abdu revisa todas las propuestas con este estado
- Abdu puede: confirmar (sin cambios) o emitir nota de seguimiento
- El historial registra: `{accion: "revision_abdu_posterior"}`

---

## Bloque `_datos_internos` [INTERNO — NUNCA AL CLIENTE]

### Lista de campos que JAMÁS pueden salir al cliente

| Campo | Por qué es interno |
|-------|-------------------|
| `coste_total_proveedores` | Revela el margen de VAA |
| `coste_por_servicio` | Desglose de costes reales por proveedor |
| `margen_vaa_pct` | Confidencialidad comercial absoluta |
| `margen_vaa_importe` | Confidencialidad comercial absoluta |
| `precio_calculado_ia` | Referencia interna de cálculo |
| `nombres_proveedores` | Protección de relaciones comerciales de VAA |
| `ids_proveedores` | Datos internos del sistema |
| `ids_selecciones` | Datos internos del sistema |
| `scoring_proveedores` | Evaluación interna de VAA |
| `incidencias_proveedores` | Historial interno de fallos |
| `negociaciones` | Estrategia comercial confidencial |
| `precios_rechazados` | Alternativas descartadas — estrategia comercial |
| `alertas_internas` | Problemas operativos internos |
| `notas_internas_expediente` | Comunicaciones internas de VAA |
| `habitaciones_staff` | Operativa interna de conductor y tour leader |
| `comisiones` | Confidencialidad comercial |
| `margen_negociacion` | Estrategia de negociación con el cliente |

**Regla de oro:** Si hay duda sobre si un campo puede ir al cliente → **no va**. La duda siempre se resuelve hacia la protección.

---

## Idiomas soportados

| Código | Idioma | Notas |
|--------|--------|-------|
| `ar` | Árabe | Dirección RTL. Verificar maquetación antes de enviar. |
| `es` | Español | Idioma base. Todos los textos legales existen en español. |
| `en` | Inglés | Fallback si el idioma del cliente no está soportado. |
| `fr` | Francés | |
| `pt` | Portugués | |

**Regla de idioma doble para condiciones legales:** Las condiciones generales de contratación deben estar disponibles en el idioma del cliente Y en español (obligatorio por ley española para contratos con consumidores).

**Regla árabe (RTL):** El contenido en árabe requiere verificación visual antes del envío. Los números (importes, fechas) mantienen orientación LTR dentro del texto RTL.

---

## Versionado

### Identificación de versiones

Cada revisión de propuesta genera una nueva versión con nuevo ID. Las versiones anteriores no se borran: se archivan en estado `sustituida`.

### Registro de cambio de versión

Cada nueva versión debe documentar:
- `motivo_nueva_version`: por qué se emite (cambio de precio, cambio de servicio, corrección, negociación)
- `cambios_respecto_version_anterior`: descripción de qué cambió
- `aprobada_por`: el nuevo aprobador humano (obligatorio — toda versión requiere firma)

### Tipos de motivo de nueva versión

| Código | Descripción |
|--------|-------------|
| `cambio_precio` | El precio cambió por cualquier motivo |
| `cambio_servicio` | Un servicio fue añadido, retirado o modificado |
| `cambio_fechas` | Las fechas del viaje cambiaron |
| `correccion_error` | Se corrigió un error en la versión anterior |
| `negociacion_cliente` | El cliente solicitó modificaciones |
| `cambio_proveedor` | Un proveedor fue sustituido y afecta a servicios |
| `actualizacion_condiciones` | Las condiciones de cancelación cambiaron |
| `otro` | Con descripción obligatoria |

---

## Cálculo económico (referencia para el aprobador)

### Fórmula interna (en `_datos_internos`)

```
coste_total_proveedores = suma de coste_confirmado de todas las SEL activas del expediente
precio_base_calculado   = coste_total_proveedores / (1 - margen_vaa_pct / 100)
precio_venta_objetivo   = redondeo al alza al siguiente múltiplo de 50 EUR
precio_venta_final      = decisión de Abdu (puede diferir del objetivo)

margen_vaa_eur          = precio_venta_final - coste_total_proveedores
margen_vaa_pct_real     = margen_vaa_eur / precio_venta_final × 100

importe_reserva_30      = precio_venta_final × 0.30
importe_restante_70     = precio_venta_final × 0.70
precio_por_persona      = precio_venta_final / total_viajeros
```

### Lo que el aprobador debe verificar antes de firmar

1. ✅ `margen_vaa_pct_real >= 25%` (estándar VAA)
2. ✅ Todos los proveedores seleccionados tienen estado `activo` o superior
3. ✅ Ningún proveedor seleccionado está en estado `bloqueado`
4. ✅ Servicios halal verificados para el grupo
5. ✅ `fecha_validez` establecida y correcta
6. ✅ Idioma de la propuesta coincide con el del cliente
7. ✅ No hay datos internos en la parte visible
8. ✅ Condiciones de cancelación incluidas

---

## Flujo operativo completo

```
EXPEDIENTE              PROPUESTA               APROBACION
────────────────────────────────────────────────────────────
nuevo
  ↓
en_cotizacion          borrador (IA prepara)    aprobada = false
  ↓
propuesta_enviada      aprobada                 aprobada = true ← FIRMA HUMANA
                       → enviada al cliente
  ↓
negociacion            (posible nueva versión)  aprobada = false (nueva versión)
                                                → nueva firma humana
  ↓
aceptado_cliente       aceptada
  ↓
pendiente_pago_30      aceptada (esperando 30%)
  ↓
venta_cerrada          ← SOLO con pago 30% confirmado

```

---

## Riesgos legales

### Oferta vinculante

La propuesta es una oferta vinculante en España una vez el cliente la acepta. El precio no puede subir unilateralmente. Mitigación: `fecha_validez` obligatoria y cláusula de validez en texto.

### Paquetes turísticos (RD 562/2019)

Los paquetes turísticos están regulados por el Real Decreto 562/2019 (Directiva UE 2015/2302). Obliga a informar de precios, revisión de precios, cancelaciones y responsabilidades. Mitigación: las Condiciones Generales de VAA deben estar disponibles en `www.vivealandalus.com`.

### Tratamiento fiscal

El régimen fiscal de paquetes turísticos en España aplica el REAT (Régimen Especial de Agencias de Viajes, artículos 141-147 LIVA). **Consultar con gestor fiscal antes de activar facturación real.** En v1.0 la propuesta indica "precio con impuestos incluidos" sin desgloses de IVA.

### Protección de datos (RGPD)

La propuesta contiene datos personales del cliente. El tratamiento de esos datos está regulado por el RGPD y la LOPDGDD. El cliente aceptó la política de privacidad en el wizard (registrado en `expediente.privacidad`).

---

*Documento interno. No distribuir fuera de Bin Firnas Travel SL.*

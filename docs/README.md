# Sistema Documental VAA — Índice Maestro

**Empresa:** Bin Firnas Travel SL  
**Marca:** Vive al Ándalus  
**Versión índice:** 1.0  
**Fecha creación:** 2026-06-10  
**Responsable:** Abdulah Jiménez Contreras  

---

## Propósito de este documento

Este README es el punto de entrada único al sistema documental de Vive al Ándalus. Define la arquitectura documental completa: qué existe, dónde vive, qué relaciones tiene cada pieza y en qué orden se usan. Cualquier sistema — humano, IA o automatización — que opere sobre este repositorio debe leerlo primero.

---

## Estructura del sistema

```
docs/
├── README.md                              ← ESTE ARCHIVO — índice maestro
│
├── EXPEDIENTE_MAESTRO_VAA.md              ← Especificación del expediente (MD)
├── expediente_maestro_vaa.json            ← Plantilla y ejemplos del expediente (JSON)
│
├── comercial/
│   ├── propuesta_comercial_v1.md          ← Especificación de propuestas (MD)
│   ├── propuesta_comercial_v1.json        ← Plantilla y ejemplos (JSON)
│   ├── reserva_comercial_v1.md            ← Especificación de reservas (MD)
│   └── reserva_comercial_v1.json          ← Plantilla y ejemplos (JSON)
│
├── correos/
│   ├── README.md                          ← Catálogo y reglas de correos
│   ├── fase0_inicial/
│   │   ├── 01_cliente_confirmacion.md     ← C01: confirmación automática al cliente
│   │   └── 02_interno_abdu.md             ← A01: alerta interna para Abdu
│   ├── comercial/
│   │   ├── 02_cliente_propuesta.md        ← C02: envío de propuesta
│   │   ├── 03_cliente_confirmacion_reserva.md  ← C03: confirmación reserva + 30%
│   │   ├── 04_cliente_documentacion_final.md   ← C04: programa definitivo
│   │   └── 05_cliente_post_viaje.md       ← C05: seguimiento post-viaje
│   └── proveedores/
│       ├── 01_proveedor_hotel.md          ← P01: solicitud a hotel
│       ├── 02_proveedor_transporte.md     ← P02: solicitud a transporte
│       ├── 03_proveedor_restaurante.md    ← P03: solicitud a restaurante halal
│       ├── 04_proveedor_guia_local.md     ← P04: solicitud a guía local
│       └── 05_proveedor_tour_leader.md    ← P05: solicitud a tour leader
│
└── proveedores/
    ├── proveedores_maestro_v1.md          ← Especificación de fichas de proveedor
    ├── proveedores_maestro_v1.json        ← Plantilla y ejemplos
    ├── presupuestos_proveedores_v1.md     ← Especificación de presupuestos
    ├── presupuestos_proveedores_v1.json   ← Plantilla y ejemplos
    ├── proveedores_seleccionados_v1.md    ← Especificación de selecciones
    ├── proveedores_seleccionados_v1.json  ← Plantilla y ejemplos
    ├── incidencias_proveedores_v1.md      ← Especificación de incidencias
    ├── incidencias_proveedores_v1.json    ← Plantilla y ejemplos
    ├── scoring_proveedores_v1.md          ← Especificación del scoring
    └── scoring_proveedores_v1.json        ← Plantilla, config y ejemplos
```

---

## Documentos del sistema — referencia rápida

### Expediente maestro

| Archivo | Versión | Descripción |
|---------|---------|-------------|
| `EXPEDIENTE_MAESTRO_VAA.md` | v1.3 | Especificación completa. 12 bloques. La fuente de verdad de qué datos vive en un expediente. |
| `expediente_maestro_vaa.json` | v1.3 | Plantilla JSON + ejemplo rellenado. Bloque 12 incluye ciclo_comercial con propuestas[], id_reserva, estado. |

### Documentos comerciales

| Archivo | Versión | Descripción |
|---------|---------|-------------|
| `comercial/propuesta_comercial_v1.md` | v1.0 | Reglas de propuesta. Regla absoluta: `aprobada = false` por defecto. C02 no puede enviarse sin aprobación humana. |
| `comercial/propuesta_comercial_v1.json` | v1.0 | Plantilla + ejemplo familia Al-Rashidi. |
| `comercial/reserva_comercial_v1.md` | v1.1 | Reglas de reserva. 13 estados. 17 alertas. Campo `programa_definitivo_cerrado`. Bloque `responsable_actual`. |
| `comercial/reserva_comercial_v1.json` | v1.1 | Plantilla + 2 ejemplos. Ejemplo 2 en operación activa. |

### Correos

| Archivo | Código | Descripción |
|---------|--------|-------------|
| `correos/README.md` | — | Catálogo completo. Variables de sustitución. Reglas de uso. |
| `correos/fase0_inicial/01_cliente_confirmacion.md` | C01 | Automático. Confirmación de recepción al cliente. 5 idiomas. |
| `correos/fase0_inicial/02_interno_abdu.md` | A01 | Automático. Alerta interna para Abdu con payload completo. |
| `correos/comercial/02_cliente_propuesta.md` | C02 | Manual. Requiere aprobación de Abdu. 5 idiomas. CC obligatorio. |
| `correos/comercial/03_cliente_confirmacion_reserva.md` | C03 | Manual. Solo tras confirmar ingreso real del 30%. 5 idiomas. |
| `correos/comercial/04_cliente_documentacion_final.md` | C04 | Manual. Solo si `programa_definitivo_cerrado = true`. 5 idiomas. |
| `correos/comercial/05_cliente_post_viaje.md` | C05 | Manual. Tras finalización del viaje. 5 idiomas. |
| `correos/proveedores/01_proveedor_hotel.md` | P01 | Solicitud de disponibilidad a hotel. Revisión de Abdu. |
| `correos/proveedores/02_proveedor_transporte.md` | P02 | Solicitud a transportista. Revisión de Abdu. |
| `correos/proveedores/03_proveedor_restaurante.md` | P03 | Solicitud a restaurante halal. Revisión de Abdu. |
| `correos/proveedores/04_proveedor_guia_local.md` | P04 | Solicitud a guía local. Revisión de Abdu. |
| `correos/proveedores/05_proveedor_tour_leader.md` | P05 | Solicitud a tour leader. Revisión de Abdu. |

### Proveedores

| Archivo | Versión | Descripción |
|---------|---------|-------------|
| `proveedores/proveedores_maestro_v1.md/json` | v1.0 | Fichas de proveedor. 10 tipos. 6 estados. Nivel estratégico. |
| `proveedores/presupuestos_proveedores_v1.md/json` | v1.0 | Presupuestos recibidos. Ley: ningún presupuesto se elimina. |
| `proveedores/proveedores_seleccionados_v1.md/json` | v1.0 | Selecciones por expediente. Historial inmutable. |
| `proveedores/incidencias_proveedores_v1.md/json` | v1.0 | Incidencias. 12 tipos. 4 gravedades. Descuento a scoring al cerrar. |
| `proveedores/scoring_proveedores_v1.md/json` | v1.0 | Scoring 100 pts (6 dimensiones) + halal 50 pts. Calculado, no manual. |

---

## Flujo operativo completo

```
[CLIENTE SOLICITA]
       │
       ▼
  C01 (auto) → Confirmación al cliente
  A01 (auto) → Alerta a Abdu
       │
       ▼
  [ABDU DISEÑA EXPEDIENTE]
  Crea expediente VAA-AAAA-NNNN
  Consulta proveedores (P01–P05)
  Recibe presupuestos → presupuestos_proveedores_v1
  Selecciona proveedores → proveedores_seleccionados_v1
       │
       ▼
  [ELABORA PROPUESTA]
  Crea propuesta PRO-AAAA-NNNN-Vn
  aprobacion_humana.aprobada = false (bloqueado)
       │
       ▼
  [ABDU APRUEBA PROPUESTA]
  aprobacion_humana.aprobada = true
       │
       ▼
  C02 (manual) → Envío de propuesta al cliente
       │
       ▼
  [CLIENTE ACEPTA]
  Crea reserva RES-AAAA-NNNN
  Expediente bloque 12 → ciclo_comercial actualizado
       │
       ▼
  [CLIENTE PAGA 30%]
  Verificación bancaria manual obligatoria
       │
       ▼
  C03 (manual) → Confirmación de reserva al cliente
       │
       ▼
  [OPERACIÓN EN CURSO]
  Proveedores confirman localizadores
  Incidencias → incidencias_proveedores_v1
  Scoring actualizado tras servicios
       │
       ▼
  [ABDU CIERRA PROGRAMA]
  programa_definitivo_cerrado = true (manual)
  Pago 100% confirmado
  Todos los proveedores con localizador
       │
       ▼
  C04 (manual) → Documentación final al cliente
       │
       ▼
  [VIAJE EJECUTADO]
       │
       ▼
  C05 (manual) → Seguimiento post-viaje
  Scoring proveedores actualizado
  Incidencias cerradas con descuento si aplica
```

---

## Reglas del sistema — siempre en vigor

| # | Regla |
|---|-------|
| R-01 | El scoring nunca se comunica al proveedor ni al cliente. |
| R-02 | Los márgenes, costes internos y IDs SEL/PRS nunca aparecen en correos externos. |
| R-03 | C02 nunca puede enviarse sin `aprobacion_humana.aprobada = true`. |
| R-04 | C03 nunca puede enviarse sin verificar el ingreso bancario real del 30%. |
| R-05 | C04 nunca puede enviarse sin `programa_definitivo_cerrado = true`. |
| R-06 | Ningún presupuesto se elimina del registro — solo se marca como `descartado`. |
| R-07 | El historial de selecciones y evaluaciones es inmutable — no se borran entradas. |
| R-08 | El `score_total` es calculado. Nunca se edita directamente. |
| R-09 | Un scoring provisional (`datos_insuficientes = true`) no debe usarse para decisiones críticas. |
| R-10 | Todo correo externo usa exclusivamente `reservas@vivealandalus.com`. Nunca `info@`. |
| R-11 | El descuento por `incumplimiento_halal` en score_halal es permanente. No se reduce con compensación. |
| R-12 | Abdu siempre decide. El sistema informa, nunca actúa autónomamente en operaciones críticas. |

---

## Identificadores del sistema

| Tipo | Formato | Ejemplo |
|------|---------|---------|
| Expediente | `VAA-AAAA-NNNN` | VAA-2026-0087 |
| Proveedor | `PRV-AAAA-NNNN` | PRV-2026-0008 |
| Presupuesto proveedor | `PRS-AAAA-NNNN` | PRS-2026-0012 |
| Selección proveedor | `SEL-AAAA-NNNN` | SEL-2026-0005 |
| Propuesta comercial | `PRO-AAAA-NNNN-Vn` | PRO-2026-0087-V2 |
| Reserva | `RES-AAAA-NNNN` | RES-2026-0001 |
| Pago | `PAG-AAAA-NNNN` | PAG-2026-0001 |
| Incidencia | `INC-AAAA-NNNN` | INC-2026-0003 |

---

## Datos corporativos fijos

| Campo | Valor |
|-------|-------|
| Razón social | Bin Firnas Travel SL |
| Marca | Vive al Ándalus |
| CIF | ESB56080765 |
| Licencia | CIAN-147996-3 |
| Dirección | C/ Teatro 19, bajo, Peñarroya-Pueblonuevo, Córdoba 14200 |
| Teléfono | 633 30 59 09 |
| Email operativo | reservas@vivealandalus.com |
| Web | www.vivealandalus.com |
| Responsable | Abdulah Jiménez Contreras |

---

## Idiomas del sistema

Todos los correos de cliente soportan 5 idiomas: **ES · EN · AR · FR · PT**

El campo `idioma_envio_final` del expediente determina el bloque a usar. Fallback: `en`.

---

*Documento interno. No distribuir fuera de Bin Firnas Travel SL.*

# Sistema de Plantillas de Correo — Vive al Ándalus

**Empresa:** Bin Firnas Travel SL  
**Marca:** Vive al Ándalus  
**Versión:** 1.0  
**Fecha creación:** 2026-06-10  
**Responsable:** Abdulah Jiménez Contreras

---

## Estructura de carpetas

```
docs/correos/
├── README.md                                      ← Este archivo
├── fase0_inicial/
│   ├── 01_cliente_confirmacion.md                 ← C01: Confirmación automática al cliente
│   └── 02_interno_abdu.md                         ← A01: Alerta interna para Abdu
├── comercial/
│   ├── 02_cliente_propuesta.md                    ← C02: Envío de propuesta comercial
│   ├── 03_cliente_confirmacion_reserva.md         ← C03: Confirmación de reserva (pago 30%)
│   ├── 04_cliente_documentacion_final.md          ← C04: Documentación final del viaje
│   └── 05_cliente_post_viaje.md                   ← C05: Seguimiento post-viaje
└── proveedores/
    ├── 01_proveedor_hotel.md                      ← P01: Solicitud de disponibilidad a hotel
    ├── 02_proveedor_transporte.md                 ← P02: Solicitud a proveedor de transporte
    ├── 03_proveedor_restaurante.md                ← P03: Solicitud a restaurante halal
    ├── 04_proveedor_guia_local.md                 ← P04: Solicitud a guía local
    └── 05_proveedor_tour_leader.md                ← P05: Solicitud a tour leader
```

---

## Reglas generales del sistema

### Correo oficial único
**Siempre:** `reservas@vivealandalus.com`  
**Nunca:** `info@vivealandalus.com` ni ninguna otra dirección.

### Pie corporativo obligatorio (correos externos)
Todos los correos dirigidos a clientes o proveedores incluyen este pie exacto:

```
Vive al Ándalus
BIN FIRNAS TRAVEL SL

Abdulah Jiménez Contreras
Teléfono: 633 30 59 09
Correo: reservas@vivealandalus.com
Web: www.vivealandalus.com

Puede consultar nuestras condiciones generales, aviso legal y política de privacidad en www.vivealandalus.com.
```

### Correos internos (A01)
Los correos internos (código A01) no llevan pie legal. Solo llevan:
```
Generado automáticamente por Sistema Vive al Ándalus
```

### Idiomas
- **Cliente:** en el idioma del cliente (`idioma_comunicacion` del expediente).
- **Proveedores:** en español (ES) por defecto; inglés si el proveedor es internacional.
- **Interno:** en español siempre.

---

## Catálogo de plantillas Fase 0

| Código | Archivo | Destinatario | Trigger | Idioma |
|--------|---------|--------------|---------|--------|
| C01 | fase0_inicial/01_cliente_confirmacion.md | Cliente | Solicitud recibida vía wizard | Idioma cliente |
| A01 | fase0_inicial/02_interno_abdu.md | Abdu (interno) | Solicitud recibida vía wizard | ES |
| P01 | proveedores/01_proveedor_hotel.md | Hotel | Fase cotización | ES |
| P02 | proveedores/02_proveedor_transporte.md | Transportista | Fase cotización | ES |
| P03 | proveedores/03_proveedor_restaurante.md | Restaurante halal | Fase cotización | ES |
| P04 | proveedores/04_proveedor_guia_local.md | Guía local | Fase cotización | ES |
| P05 | proveedores/05_proveedor_tour_leader.md | Tour leader | Fase cotización | ES |

## Catálogo de plantillas Fase Comercial

| Código | Archivo | Destinatario | Trigger | Idioma | CC obligatorio |
|--------|---------|--------------|---------|--------|----------------|
| C02 | comercial/02_cliente_propuesta.md | Cliente | `propuesta.aprobacion_humana.aprobada = true` | Idioma cliente | reservas@vivealandalus.com |
| C03 | comercial/03_cliente_confirmacion_reserva.md | Cliente | Pago 30% confirmado + reserva activa | Idioma cliente | reservas@vivealandalus.com |
| C04 | comercial/04_cliente_documentacion_final.md | Cliente | `programa_definitivo_cerrado = true` + pago 100% + todos los proveedores con localizador | Idioma cliente | reservas@vivealandalus.com |
| C05 | comercial/05_cliente_post_viaje.md | Cliente | Tras finalización del viaje (fecha_fin + 2–5 días) | Idioma cliente | reservas@vivealandalus.com |

### Reglas específicas de la fase comercial

- **C02** nunca puede enviarse automáticamente. Requiere revisión y envío manual por Abdu.
- **C03** nunca puede enviarse antes de verificar el ingreso bancario real. Un pago "registrado" no es suficiente.
- **C04** nunca puede enviarse sin `programa_definitivo_cerrado = true` en la reserva. Abdu aprueba ese campo manualmente.
- **C05** nunca automático. Abdu decide el momento (orientativo: 2–5 días tras fecha_fin). No enviar si hay incidencia grave pendiente de gestión directa.
- **CC obligatorio:** todo envío de C02, C03, C04 y C05 incluye copia interna a `reservas@vivealandalus.com` para archivo.
- **Identificadores visibles:** C02 muestra `Expediente` + `Propuesta`. C03 muestra `Expediente` + `Reserva`. C04 y C05 muestran `Expediente`.
- **Bloque de idioma:** C02–C05 usan `idioma_envio_final` (puede diferir de `idioma_preferido` si el cliente se comunicó en otro idioma). Fallback a `en`.
- **Datos internos prohibidos:** márgenes, costes, proveedores, scoring, incidencias, IDs SEL/PRS nunca aparecen en correos al cliente.

---

## Variables de sustitución

Las plantillas usan variables entre dobles llaves `{{variable}}`. El sistema de comunicación (n8n o manual) sustituye estas variables con datos reales del expediente antes de enviar.

### Variables de expediente
| Variable | Fuente en expediente |
|----------|----------------------|
| `{{ref}}` | `expediente.referencia` |
| `{{fecha_solicitud}}` | `expediente.fecha_solicitud` |
| `{{agente}}` | `expediente.agente_asignado` |

### Variables de cliente
| Variable | Fuente en expediente |
|----------|----------------------|
| `{{nombre_cliente}}` | `cliente.nombre` |
| `{{apellidos_cliente}}` | `cliente.apellidos` |
| `{{email_cliente}}` | `cliente.email` |
| `{{telefono_cliente}}` | `cliente.telefono_whatsapp` |
| `{{pais_cliente}}` | `cliente.pais_residencia` |
| `{{idioma_cliente}}` | `cliente.idioma_comunicacion` |
| `{{tipo_cliente}}` | `cliente.tipo_cliente` |

### Variables de grupo
| Variable | Fuente en expediente |
|----------|----------------------|
| `{{adultos}}` | `grupo.adultos` |
| `{{menores}}` | `grupo.menores` |
| `{{total_viajeros}}` | `grupo.total_viajeros` |
| `{{edades_menores}}` | `grupo.edades_menores` |

### Variables de fechas y ruta
| Variable | Fuente en expediente |
|----------|----------------------|
| `{{fecha_inicio}}` | `fechas.fecha_inicio` |
| `{{fecha_fin}}` | `fechas.fecha_fin` |
| `{{duracion_noches}}` | `fechas.duracion_noches` |
| `{{duracion_dias}}` | `fechas.duracion_dias` |
| `{{ciudades_ruta}}` | `ruta.ciudades_orden` (join ", ") |
| `{{ciudad_inicio}}` | `ruta.ciudad_inicio` |
| `{{ciudad_final}}` | `ruta.ciudad_final` |

### Variables de llegada/salida internacional
| Variable | Fuente en expediente |
|----------|----------------------|
| `{{llegada_aeropuerto}}` | `llegada_internacional.aeropuerto_ciudad` |
| `{{llegada_fecha}}` | `llegada_internacional.fecha` |
| `{{llegada_hora}}` | `llegada_internacional.hora` |
| `{{llegada_vuelo}}` | `llegada_internacional.numero_vuelo` |
| `{{salida_aeropuerto}}` | `salida_internacional.aeropuerto_ciudad` |
| `{{salida_fecha}}` | `salida_internacional.fecha` |
| `{{salida_hora}}` | `salida_internacional.hora` |
| `{{salida_vuelo}}` | `salida_internacional.numero_vuelo` |

### Variables de servicios
| Variable | Fuente en expediente |
|----------|----------------------|
| `{{categoria_hotel}}` | `servicios.alojamiento.categoria_estrellas` |
| `{{regimen}}` | `servicios.alojamiento.regimen` |
| `{{hab_dobles}}` | `servicios.alojamiento.hab_dobles` |
| `{{hab_triples}}` | `servicios.alojamiento.hab_triples` |
| `{{tipo_vehiculo}}` | `servicios.transporte.tipo_vehiculo` |
| `{{halal_requerido}}` | `servicios.halal.requerido` |
| `{{dias_restaurante}}` | `servicios.restauracion.dias_restaurante` |

---

## Reglas de uso

1. **Nunca enviar** datos marcados `_interno: true` del expediente a clientes o proveedores.
2. **Nunca revelar** márgenes, costes, nombres de otros proveedores ni notas internas.
3. **Siempre revisar** antes de enviar cualquier correo de proveedor (P01–P05). Abdu aprueba.
4. **C01** puede enviarse automáticamente (trigger inmediato). A01 también es automático.
5. **P01–P05** requieren revisión y aprobación de Abdu antes de enviar.
6. Las variables `{{...}}` que no tengan valor deben eliminarse o sustituirse por `—` antes de enviar.

---

*Documento interno. No distribuir fuera de Bin Firnas Travel SL.*

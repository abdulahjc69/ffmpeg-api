# EXPEDIENTE MAESTRO — VIVE AL ÁNDALUS
**Versión:** 1.1 | **Empresa:** Bin Firnas Travel SL | **Marca:** Vive al Ándalus

---

## ESTRUCTURA OFICIAL DEL EXPEDIENTE

### BLOQUE 1 — DATOS DEL EXPEDIENTE

| Campo | Descripción | Ejemplo |
|---|---|---|
| `referencia` | Código único del expediente | `VAA-2026-0087` |
| `fecha_solicitud` | Fecha y hora de llegada del lead | `2026-07-15T10:32:00` |
| `estado` | Estado actual del expediente | ver tabla de estados |
| `urgencia` | Valoración interna de urgencia | `normal` / `alta` / `muy_alta` |
| `canal_entrada` | De dónde llegó la solicitud | `wizard_web` / `formulario_legacy` / `whatsapp` / `email` / `referido` |
| `agente_asignado` | Responsable interno | `Abdu` / nombre agente |

#### Estados oficiales del expediente

| Estado | Descripción |
|---|---|
| `nuevo` | Lead recibido, sin gestionar |
| `en_cotizacion` | En proceso de cálculo de costes |
| `propuesta_enviada` | Propuesta enviada al cliente |
| `negociacion` | Cliente respondió, negociando condiciones |
| `aceptado_cliente` | Cliente acepta verbalmente, pendiente de formalizar |
| `pendiente_pago_30` | Esperando recepción del 30% de reserva |
| `venta_cerrada` | **30% recibido. Venta confirmada.** |
| `documentacion_pendiente` | Venta cerrada, pendiente rooming list y docs viajeros |
| `en_operacion` | Viaje en curso |
| `finalizado` | Viaje completado |
| `cancelado` | Expediente cancelado |

> **REGLA CLAVE:** Una solicitud NO está vendida ni confirmada hasta recibir el **30% de reserva**.  
> El estado `venta_cerrada` solo se activa tras confirmar la recepción del pago.

---

### BLOQUE 2 — CLIENTE PRINCIPAL

| Campo | Descripción | Ejemplo |
|---|---|---|
| `nombre` | Nombre de pila | `Fatima` |
| `apellidos` | Apellidos completos | `Al-Rashidi Al-Otaibi` |
| `email` | Correo electrónico principal | `fatima@example.com` |
| `telefono_whatsapp` | WhatsApp con prefijo país | `+966501234567` |
| `pais_residencia` | País de residencia | `Arabia Saudí` |
| `idioma_comunicacion` | Idioma preferido para comunicaciones | `ar` / `en` / `es` / `fr` / `pt` |
| `tipo_cliente` | Clasificación del grupo | ver tabla de tipos |

#### Tipos de cliente

| Valor | Descripción |
|---|---|
| `familia` | Núcleo familiar con o sin menores |
| `pareja` | Dos personas, viaje en pareja |
| `grupo_amigos` | Grupo informal de adultos |
| `empresa` | Viaje corporativo o incentivo |
| `asociacion` | Asociación cultural, religiosa o civil |
| `colegio` | Alumnos de educación primaria |
| `instituto` | Alumnos de educación secundaria |
| `universidad` | Alumnos universitarios |
| `universidad_mayores` | Programa universitario para mayores |
| `agencia_viajes` | Agencia que compra para sus clientes |
| `tour_operador` | Operador mayorista |
| `grupo_organizado` | Grupo con organización externa previa |
| `profesional_turistico` | Fam trip, press trip, blogger, influencer |
| `otro` | Cualquier otro perfil |

---

### BLOQUE 3 — GRUPO DE VIAJEROS

| Campo | Descripción | Ejemplo |
|---|---|---|
| `adultos` | Número de adultos (≥18 años) | `4` |
| `menores` | Número de menores (<18 años) | `2` |
| `edades_menores` | Lista de edades de cada menor | `[7, 12]` |
| `total_viajeros` | Suma adultos + menores | `6` |
| `tipo_grupo` | Tipología operativa | ver tipos de cliente |
| `necesidades_accesibilidad` | Movilidad reducida u otras | `false` / descripción libre |

> **REGLA MENORES:**  
> Todo menor debe tener edad registrada obligatoriamente.  
> Todo menor debe viajar acompañado por padre, madre o tutor legal.  
> Esta información se completará en fase de documentación / rooming list, no necesariamente en la solicitud inicial.

---

### BLOQUE 4 — FECHAS DEL VIAJE

| Campo | Descripción | Ejemplo |
|---|---|---|
| `fecha_inicio` | Primer día del viaje | `2026-09-10` |
| `fecha_fin` | Último día del viaje | `2026-09-25` |
| `duracion_dias` | Días totales incluyendo llegada y salida | `16` |
| `duracion_noches` | Noches de alojamiento a reservar | `15` |
| `fechas_flexibles` | Si el cliente acepta variación | `false` |
| `margen_flexibilidad_dias` | ±N días si flexibles | `0` |
| `temporada` | Clasificación interna | `alta` / `media` / `baja` |

---

### BLOQUE 5 — LLEGADA INTERNACIONAL

| Campo | Descripción | Ejemplo |
|---|---|---|
| `llegada_medio` | Medio de transporte de llegada | `avion` / `tren` / `autobus` / `vehiculo_propio` / `barco` / `ferry` |
| `llegada_aeropuerto_ciudad` | Aeropuerto, puerto o estación de llegada | `Aeropuerto Adolfo Suárez Madrid-Barajas (MAD)` |
| `llegada_terminal` | Terminal específica si aplica | `T4` |
| `llegada_fecha` | Fecha de llegada al punto de entrada | `2026-09-10` |
| `llegada_hora` | Hora del vuelo / llegada | `09:45` |
| `llegada_numero_vuelo` | Código de vuelo / billete si disponible | `SV136` |
| `llegada_recogida` | Si necesita transfer de recogida | `true` |
| `llegada_cartel_nombre` | Nombre para cartel de bienvenida | `Al-Rashidi` |
| `alerta_revision_manual` | Activa si el medio requiere revisión | `true` si avion / barco / ferry |

> **⚠️ ALERTA INTERNA — VUELOS, BARCOS Y FERRYS:**  
> Si la solicitud incluye vuelos, barcos o ferrys, se genera automáticamente una alerta de revisión manual para Abdu.  
> Vive al Ándalus puede gestionar estos servicios, pero requieren revisión y validación manual antes de confirmar al cliente.

---

### BLOQUE 6 — SALIDA INTERNACIONAL

| Campo | Descripción | Ejemplo |
|---|---|---|
| `salida_medio` | Medio de transporte de salida | `avion` / `barco` / `ferry` / `tren` |
| `salida_aeropuerto_ciudad` | Aeropuerto, puerto o estación de salida | `Aeropuerto de Málaga-Costa del Sol (AGP)` |
| `salida_terminal` | Terminal específica si aplica | `T3` |
| `salida_fecha` | Fecha de salida del último destino | `2026-09-25` |
| `salida_hora` | Hora del vuelo / salida | `18:20` |
| `salida_numero_vuelo` | Código de vuelo / billete si disponible | `SV137` |
| `salida_transfer` | Si necesita transfer al aeropuerto/puerto | `true` |
| `salida_hora_necesaria_aeropuerto` | Hora límite en el punto de salida | `16:20` |
| `alerta_revision_manual` | Activa si el medio requiere revisión | `true` si avion / barco / ferry |

---

### BLOQUE 7 — RUTA Y DESTINOS

| Campo | Descripción | Ejemplo |
|---|---|---|
| `ciudades_orden` | Orden de visita de ciudades | `["Madrid","Toledo","Córdoba","Sevilla","Granada","Málaga"]` |
| `ciudad_inicio` | Primera ciudad del recorrido | `Madrid` |
| `ciudad_final` | Última ciudad antes de salida | `Málaga` |
| `noches_por_ciudad` | Objeto ciudad → noches | `{"Madrid":3,"Toledo":1,"Córdoba":2,"Sevilla":4,"Granada":3,"Málaga":2}` |
| `total_noches_ruta` | Suma de todas las noches | `15` |

#### Sub-tabla: Detalle por ciudad

| Ciudad | Noches | Obs. operativa |
|---|---|---|
| Madrid | 3 | Check-in día llegada. Transfer aeropuerto incluido. |
| Toledo | 1 | Excursión desde Madrid o noche independiente. |
| Córdoba | 2 | Visita Mezquita-Catedral + Medina Azahara. |
| Sevilla | 4 | Hub central. Mayor densidad de actividades. |
| Granada | 3 | Alhambra reserva anticipada obligatoria. |
| Málaga | 2 | Check-out día vuelta. Transfer aeropuerto incluido. |

---

### BLOQUE 8 — SERVICIOS CONTRATADOS

#### 8.1 Alojamiento

| Campo | Descripción | Ejemplo |
|---|---|---|
| `alojamiento_incluido` | Si el paquete incluye hotel | `true` |
| `categoria_estrellas` | Categoría mínima deseada | `4` |
| `regimen` | Régimen de comidas | `con_desayuno` / `media_pension` / `sin_pension` |
| `hab_dobles` | Habitaciones dobles cliente | `2` |
| `hab_individuales` | Habitaciones individuales cliente | `0` |
| `hab_triples` | Habitaciones triples cliente | `1` |
| `hab_familiares` | Habitaciones familiares cliente | `0` |
| `accesibilidad_hab` | Habitación adaptada | `false` |
| `servicio_maletas` | Traslado de maletas entre hoteles | `true` |

#### 8.2 Transporte Interno

| Campo | Descripción | Ejemplo |
|---|---|---|
| `transporte_incluido` | Transporte entre ciudades | `true` |
| `tipo_vehiculo` | Tipo de vehículo contratado | `minibus_8` / `autobus_30` / `autocar_55` / `turismo` |
| `conductor_incluido` | Si hay conductor en plantilla | `true` |
| `cobertura_transporte` | Qué tramos cubre | `toda_ruta` / `parcial` |
| `transporte_llegada_aeropuerto` | Transfer llegada incluido | `true` |
| `transporte_salida_aeropuerto` | Transfer salida incluido | `true` |

#### 8.3 Tour Leader

| Campo | Descripción | Ejemplo |
|---|---|---|
| `tour_leader_incluido` | Acompañante de expedición | `true` |
| `tour_leader_cobertura` | Días de cobertura | `toda_ruta` |
| `tour_leader_idioma` | Idioma del tour leader | `ar` |
| `tour_leader_nombre` | Nombre si ya asignado | `` |

#### 8.4 Guía Local

| Campo | Descripción | Ejemplo |
|---|---|---|
| `guia_local_incluido` | Guía en cada ciudad | `true` |
| `guia_local_ciudades` | Ciudades con guía local | `["Córdoba","Sevilla","Granada"]` |
| `guia_local_idioma` | Idioma del guía | `ar` |
| `guia_local_duracion` | Duración por visita | `medio_dia` / `dia_completo` |

#### 8.5 Restauración

| Campo | Descripción | Ejemplo |
|---|---|---|
| `restauracion_incluida` | Comidas en restaurante incluidas | `true` |
| `comidas_incluidas` | Qué comidas | `["almuerzo"]` |
| `tipo_cocina` | Preferencia culinaria | `andaluza_tradicional` / `arabe` / `internacional` |
| `restaurantes_preconcertados` | Si son restaurantes de acuerdo previo | `true` |

#### 8.6 Servicio Halal

| Campo | Descripción | Ejemplo |
|---|---|---|
| `halal_requerido` | Si el grupo requiere certificación halal | `true` |
| `opciones_halal` | Qué servicios deben ser halal | `["comida_halal","hotel_sin_alcohol_en_mesa"]` |
| `certificacion_halal_documentada` | Si se adjunta certificado | `false` |

---

### BLOQUE 9 — OPERACIÓN INTERNA ⚠️ NUNCA VISIBLE AL CLIENTE

> Este bloque es **exclusivo para uso interno de Bin Firnas Travel**. No aparece en ningún correo ni resumen enviado al cliente.

| Campo | Descripción | Cálculo / Ejemplo |
|---|---|---|
| `hab_operativa_staff` | Habitación compartida de staff | `+1` si hay conductor y/o tour leader con pernocta |
| `hab_operativa_excepcion` | Segunda hab. de staff | Solo si Abdu lo marca expresamente |
| `total_hab_a_solicitar` | Total real a reservar | `hab_cliente + hab_staff` |
| `margen_precio_objetivo` | Margen comercial estándar | `25%` sobre coste operativo |
| `coste_estimado_base` | Coste operativo estimado | Campo para rellenar en cotización |
| `precio_venta_objetivo` | Precio de venta con margen | `coste_base × 1.25` |
| `precio_venta_final` | Precio acordado con cliente | Campo para cerrar |
| `notas_internas` | Observaciones operativas privadas | Texto libre |
| `proveedor_transporte` | Empresa de transporte asignada | `` |
| `proveedor_hoteles` | Cadena / proveedor hotelero | `` |
| `comisiones_pendientes` | Estado de comisiones | `` |

#### Regla habitación de staff

```
Si hay conductor con pernocta     → 1 hab. individual operativa (no facturar al cliente)
Si hay tour leader con pernocta   → 1 hab. individual operativa (no facturar al cliente)
Si hay conductor + tour leader    → comparten 1 hab. operativa con camas separadas (= 1 hab. total)
Si Abdu decide excepción          → puede autorizar 2 hab. operativas (caso por caso)

Total a solicitar = hab_cliente_dobles + hab_cliente_ind + hab_cliente_triples + hab_staff (1 ó 2)
```

#### Regla de margen

```
Margen estándar objetivo = 25%
Precio venta mínimo = coste_operativo × 1.25

Descuentos:
  - Solo valorar en grupos superiores a 25 pax
  - Descuento máximo autorizado: hasta 10 puntos porcentuales del margen
  - Nunca aplicar descuentos automáticos
  - La decisión económica final corresponde exclusivamente a Abdu
```

---

### BLOQUE 10 — COMUNICACIONES

#### 10.1 Resumen para el Cliente (VISIBLE)

El correo al cliente debe incluir **únicamente**:
- Nombre del cliente
- Destinos y fechas confirmadas
- Servicios incluidos (lista limpia)
- Próximos pasos
- Contacto directo de Vive al Ándalus

**No incluir nunca:** precios de coste, nombres de proveedores, hab. de staff, márgenes, notas internas.

#### 10.2 Expediente Interno para Abdu (OPERATIVO)

El expediente interno incluye todos los bloques: 1 a 9 completos, incluyendo:
- Coste estimado y margen
- Proveedores asignados
- Habitaciones de staff
- Alertas de revisión manual (vuelos, barcos, ferrys)
- Notas de operación

---

## EJEMPLO REAL — RUTA 15 NOCHES COMPLETA

### Expediente: VAA-2026-0087

**Cliente:** Familia Al-Rashidi | Riad, Arabia Saudí | 6 viajeros (4A + 2M: 7 y 12 años)  
**Idioma:** Árabe | **Entrada:** Madrid (vuelo SV136) | **Salida:** Málaga (vuelo SV137)  
**Viaje:** 10 – 25 septiembre 2026 (15 noches)

> **⚠️ ALERTA INTERNA:** Solicitud incluye vuelos internacionales. Requiere revisión manual por Abdu antes de confirmar al cliente.

#### Ruta

| Ciudad | Noches | Highlights |
|---|---|---|
| Madrid | 3 | Llegada. Palacio Real, Retiro, gastronomía halal |
| Toledo | 1 | Excursión. Ciudad de las tres culturas |
| Córdoba | 2 | Mezquita-Catedral, Medina Azahara, Judería |
| Sevilla | 4 | Alcázar, Giralda, Barrio de Santa Cruz, flamenco |
| Granada | 3 | Alhambra, Albaicín, Sacromonte |
| Málaga | 2 | Costa, Alcazaba, Picasso. Salida vuelo |

#### Servicios contratados

- **Alojamiento:** 4★ | Solo desayuno | 2 hab. dobles + 1 hab. triple (familia de 6)
- **Transporte:** Minibús 8 plazas con conductor toda la ruta + transfers aeropuerto
- **Tour Leader:** Toda la ruta, idioma árabe
- **Guía Local:** Córdoba, Sevilla y Granada — árabe, medio día
- **Restauración:** Almuerzo preconcertado en restaurante halal certificado ×10 días
- **Halal:** Comida halal + hotel sin alcohol en mesa
- **Servicio maletas:** Incluido entre ciudades

#### Operación interna (solo Abdu)

| Concepto | Valor |
|---|---|
| Hab. cliente | 2 dobles + 1 triple = 3 hab. |
| Hab. staff (conductor + tour leader comparten) | +1 individual |
| **Total a reservar** | **4 hab. por noche × 15 noches** |
| Coste estimado base | Pendiente cotización proveedores |
| Margen objetivo | 25% |
| Precio venta mínimo | coste × 1.25 |
| Precio venta final | Decisión de Abdu |

#### Notas internas

- ⚠️ Vuelos internacionales incluidos — revisión manual obligatoria antes de confirmar.
- Familia pide confirmación de que todos los restaurantes tienen certif. halal.
- Padre solicita habitación en planta baja (accesibilidad relativa — no estricta).
- Preferencia de hoteles con piscina para los menores en Sevilla y Málaga.
- Alhambra: reservar entradas con 60 días de antelación mínimo.
- Posible extensión a 2 noches en Ronda — consultar antes del cierre.
- Menores (7 y 12 años): edades registradas. Viajan con padre/madre — documentar en rooming list.

---

## ESTADOS DEL EXPEDIENTE

```
nuevo
  → en_cotizacion
    → propuesta_enviada
      → negociacion
        → aceptado_cliente
          → pendiente_pago_30
            → venta_cerrada  ← 30% RECIBIDO
              → documentacion_pendiente
                → en_operacion
                  → finalizado

En cualquier punto → cancelado
```

> **REGLA DE PAGO:** `venta_cerrada` = 30% recibido y confirmado. Sin pago no hay confirmación.

---

## REGLA DE ORO

> **El cliente recibe un resumen comercial limpio.**  
> **Abdu recibe el expediente operativo completo.**  
> **Nunca mezclar. Nunca filtrar datos internos al cliente.**

---

*Documento oficial — Bin Firnas Travel SL / Vive al Ándalus — Versión 1.1 — Junio 2026*

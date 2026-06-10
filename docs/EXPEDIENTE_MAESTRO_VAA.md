# EXPEDIENTE MAESTRO — VIVE AL ÁNDALUS
**Versión:** 1.0 | **Empresa:** Bin Firnas Travel SL | **Marca:** Vive al Ándalus

---

## ESTRUCTURA OFICIAL DEL EXPEDIENTE

### BLOQUE 1 — DATOS DEL EXPEDIENTE

| Campo | Descripción | Ejemplo |
|---|---|---|
| `referencia` | Código único del expediente | `VAA-2026-0087` |
| `fecha_solicitud` | Fecha y hora de llegada del lead | `2026-07-15T10:32:00` |
| `estado` | Estado actual del expediente | `nuevo` / `en_cotizacion` / `propuesta_enviada` / `confirmado` / `cancelado` |
| `urgencia` | Valoración interna de urgencia | `normal` / `alta` / `muy_alta` |
| `canal_entrada` | De dónde llegó la solicitud | `wizard_web` / `formulario_legacy` / `whatsapp` / `email` / `referido` |
| `agente_asignado` | Responsable interno | `Abdu` / nombre agente |

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
| `tipo_cliente` | Clasificación del grupo | `familia` / `pareja` / `grupo_amigos` / `empresa` / `luna_de_miel` / `grupo_organizado` |

---

### BLOQUE 3 — GRUPO DE VIAJEROS

| Campo | Descripción | Ejemplo |
|---|---|---|
| `adultos` | Número de adultos (≥18 años) | `4` |
| `menores` | Número de menores (<18 años) | `2` |
| `edades_menores` | Lista de edades de cada menor | `[7, 12]` |
| `total_viajeros` | Suma adultos + menores | `6` |
| `tipo_grupo` | Tipología operativa | `familia` / `grupo_independiente` / `grupo_organizado` |
| `necesidades_accesibilidad` | Movilidad reducida u otras | `false` / descripción libre |

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
| `llegada_medio` | Medio de transporte de llegada | `avion` / `tren` / `autobus` / `vehiculo_propio` |
| `llegada_aeropuerto_ciudad` | Aeropuerto o estación de llegada | `Aeropuerto Adolfo Suárez Madrid-Barajas (MAD)` |
| `llegada_terminal` | Terminal específica si aplica | `T4` |
| `llegada_fecha` | Fecha de llegada al punto de entrada | `2026-09-10` |
| `llegada_hora` | Hora del vuelo / llegada | `09:45` |
| `llegada_numero_vuelo` | Código de vuelo si disponible | `SV136` |
| `llegada_recogida` | Si necesita transfer de recogida | `true` |
| `llegada_cartel_nombre` | Nombre para cartel de bienvenida | `Al-Rashidi` |

---

### BLOQUE 6 — SALIDA INTERNACIONAL

| Campo | Descripción | Ejemplo |
|---|---|---|
| `salida_medio` | Medio de transporte de salida | `avion` |
| `salida_aeropuerto_ciudad` | Aeropuerto o estación de salida | `Aeropuerto de Málaga-Costa del Sol (AGP)` |
| `salida_terminal` | Terminal específica si aplica | `T3` |
| `salida_fecha` | Fecha de salida del último destino | `2026-09-25` |
| `salida_hora` | Hora del vuelo / salida | `18:20` |
| `salida_numero_vuelo` | Código de vuelo si disponible | `SV137` |
| `salida_transfer` | Si necesita transfer al aeropuerto | `true` |
| `salida_hora_necesaria_aeropuerto` | Hora límite en el aeropuerto (check-in) | `16:20` |

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
| `hab_triples` | Habitaciones triples cliente | `0` |
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
| `hab_operativa_conductor` | Habitación extra para conductor | `+1` si conductor incluido |
| `hab_operativa_tour_leader` | Habitación extra para tour leader | `+1` si tour leader incluido |
| `total_hab_a_solicitar` | Total real a reservar | `hab_cliente + hab_staff` |
| `margen_precio_objetivo` | Margen comercial objetivo | `25%` sobre coste operativo |
| `coste_estimado_base` | Coste operativo estimado | Campo para rellenar en cotización |
| `precio_venta_objetivo` | Precio de venta con margen | `coste_base × 1.25` |
| `precio_venta_final` | Precio acordado con cliente | Campo para cerrar |
| `notas_internas` | Observaciones operativas privadas | Texto libre |
| `proveedor_transporte` | Empresa de transporte asignada | `` |
| `proveedor_hoteles` | Cadena / proveedor hotelero | `` |
| `comisiones_pendientes` | Estado de comisiones | `` |

#### Regla habitación de staff

```
Si conductor = true   → solicitar 1 hab. individual extra al hotel (no facturar al cliente)
Si tour leader = true → solicitar 1 hab. individual extra al hotel (no facturar al cliente)
Si ambos = true       → solicitar 2 hab. individuales extra
Total a solicitar     = hab_cliente_dobles + hab_cliente_ind + hab_cliente_triples + hab_staff
```

#### Regla de margen

```
Precio venta mínimo = coste_operativo × 1.25
Precio venta objetivo = coste_operativo × 1.30
Precio venta premium = según destino y temporada
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
- Notas de operación

---

## EJEMPLO REAL — RUTA 15 NOCHES COMPLETA

### Expediente: VAA-2026-0087

**Cliente:** Familia Al-Rashidi | Riad, Arabia Saudí | 6 viajeros (4A + 2M: 7 y 12 años)  
**Idioma:** Árabe | **Entrada:** Madrid | **Salida:** Málaga  
**Viaje:** 10 – 25 septiembre 2026 (15 noches)

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
| Hab. conductor (staff) | +1 individual |
| Hab. tour leader (staff) | +1 individual |
| **Total a reservar** | **5 hab. por noche × 15 noches** |
| Coste estimado base | Pendiente cotización proveedores |
| Margen objetivo | 25–30% |
| Precio venta objetivo | Pendiente |

#### Notas internas

- Familia pide confirmación de que todos los restaurantes tienen certif. halal.
- Padre solicita habitación en planta baja (accesibilidad relativa — no estricta).
- Preferencia de hoteles con piscina para los menores en Sevilla y Málaga.
- Alhambra: reservar entradas con 60 días de antelación mínimo.
- Posible extensión a 2 noches en Ronda — consultar antes del cierre.

---

## ESTADOS DEL EXPEDIENTE

```
nuevo → en_cotizacion → propuesta_enviada → negociacion → confirmado → en_operacion → finalizado
                                                                     ↓
                                                                 cancelado
```

---

## REGLA DE ORO

> **El cliente recibe un resumen comercial limpio.**  
> **Abdu recibe el expediente operativo completo.**  
> **Nunca mezclar. Nunca filtrar datos internos al cliente.**

---

*Documento oficial — Bin Firnas Travel SL / Vive al Ándalus — Versión 1.0 — Junio 2026*

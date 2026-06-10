# A01 — Alerta interna de nueva solicitud (para Abdu)

**Código:** A01  
**Tipo:** Interno — solo uso Bin Firnas Travel SL  
**Trigger:** Solicitud recibida a través del wizard web  
**Envío:** Automático inmediato tras recepción del webhook  
**Idioma:** Español (siempre)  
**Desde:** Sistema Vive al Ándalus (no-reply o reservas@vivealandalus.com)  
**Para:** reservas@vivealandalus.com (Abdu)  
**Asunto:** 🔔 Nueva solicitud — `{{ref}}` — `{{nombre_cliente}}` — `{{fecha_inicio}}`

> **AVISO:** Este correo es de uso interno exclusivo. NUNCA enviar al cliente.  
> No contiene pie legal externo.

---

## Plantilla

---

**NUEVA SOLICITUD RECIBIDA**  
Sistema Vive al Ándalus — Fase 0

---

**REFERENCIA:** `{{ref}}`  
**Fecha de solicitud:** `{{fecha_solicitud}}`  
**Canal de entrada:** `{{canal_entrada}}`  
**Agente asignado:** `{{agente}}`  
**Urgencia:** `{{urgencia}}`

---

### CLIENTE

| Campo | Valor |
|-------|-------|
| Nombre | `{{nombre_cliente}}` `{{apellidos_cliente}}` |
| Email | `{{email_cliente}}` |
| WhatsApp | `{{telefono_cliente}}` |
| País | `{{pais_cliente}}` |
| Idioma | `{{idioma_cliente}}` |
| Tipo de cliente | `{{tipo_cliente}}` |

---

### GRUPO

| Campo | Valor |
|-------|-------|
| Adultos | `{{adultos}}` |
| Menores | `{{menores}}` |
| Edades menores | `{{edades_menores}}` |
| Total viajeros | `{{total_viajeros}}` |

---

### FECHAS Y RUTA

| Campo | Valor |
|-------|-------|
| Fecha inicio | `{{fecha_inicio}}` |
| Fecha fin | `{{fecha_fin}}` |
| Duración | `{{duracion_noches}}` noches / `{{duracion_dias}}` días |
| Fechas flexibles | `{{fechas_flexibles}}` |
| Margen flexibilidad | `{{margen_flexibilidad}}` días |
| Temporada | `{{temporada}}` |
| Ciudades (orden) | `{{ciudades_ruta}}` |
| Ciudad inicio | `{{ciudad_inicio}}` |
| Ciudad final | `{{ciudad_final}}` |

---

### LLEGADA INTERNACIONAL

| Campo | Valor |
|-------|-------|
| Aeropuerto | `{{llegada_aeropuerto}}` |
| Fecha | `{{llegada_fecha}}` |
| Hora | `{{llegada_hora}}` |
| Número de vuelo | `{{llegada_vuelo}}` |

> ⚠️ **ALERTA REVISIÓN MANUAL:** La solicitud incluye vuelo internacional. Revisar y validar antes de confirmar al cliente.

---

### SALIDA INTERNACIONAL

| Campo | Valor |
|-------|-------|
| Aeropuerto | `{{salida_aeropuerto}}` |
| Fecha | `{{salida_fecha}}` |
| Hora | `{{salida_hora}}` |
| Número de vuelo | `{{salida_vuelo}}` |

---

### SERVICIOS SOLICITADOS

| Servicio | Incluido |
|----------|----------|
| Alojamiento | `{{alojamiento_incluido}}` — `{{categoria_hotel}}` estrellas — `{{regimen}}` |
| Transporte | `{{transporte_incluido}}` — `{{tipo_vehiculo}}` |
| Tour leader | `{{tour_leader_incluido}}` — idioma: `{{idioma_tour_leader}}` |
| Guía local | `{{guia_local_incluido}}` — ciudades: `{{ciudades_guia}}` |
| Restauración | `{{restauracion_incluida}}` — `{{dias_restaurante}}` días |
| Halal | `{{halal_requerido}}` |
| Transfer llegada | `{{transfer_llegada}}` |
| Transfer salida | `{{transfer_salida}}` |

---

### HABITACIONES (cálculo operativo)

| Concepto | Valor |
|----------|-------|
| Hab. dobles cliente | `{{hab_dobles}}` |
| Hab. triples cliente | `{{hab_triples}}` |
| Hab. individuales cliente | `{{hab_individuales}}` |
| Hab. familiares cliente | `{{hab_familiares}}` |
| Hab. staff | 1 (conductor + tour leader comparten) |
| **TOTAL HAB. A SOLICITAR** | `{{total_hab_solicitar}}` |

---

### NOTAS DEL CLIENTE

`{{comentarios_cliente}}`

---

### ACCIONES PENDIENTES

- [ ] Revisar vuelos internacionales (⚠️ obligatorio antes de confirmar)
- [ ] Verificar disponibilidad Alhambra (reservar con 60 días mínimo de antelación)
- [ ] Iniciar cotización con proveedores
- [ ] Enviar propuesta al cliente
- [ ] Actualizar estado expediente a `en_cotizacion`

---

*Generado automáticamente por Sistema Vive al Ándalus*

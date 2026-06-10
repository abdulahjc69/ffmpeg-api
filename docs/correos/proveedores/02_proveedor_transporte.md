# P02 — Solicitud a proveedor de transporte

**Código:** P02  
**Tipo:** Proveedor externo — transportista  
**Trigger:** Fase de cotización (manual — requiere aprobación de Abdu antes de enviar)  
**Envío:** Manual por Abdu o agente autorizado  
**Idioma:** Español (ES)  
**Desde:** reservas@vivealandalus.com  
**Para:** [Email del transportista — completar manualmente]  
**Asunto:** Solicitud de servicio de transporte — `{{total_viajeros}}` pax — `{{fecha_inicio}}` al `{{fecha_fin}}` — Ref. `{{ref}}`

> ⚠️ **REVISIÓN OBLIGATORIA antes de enviar.** No enviar automáticamente.  
> Los datos de km y tiempos son estimados orientativos sujetos a validación del transportista.  
> Nunca incluir: márgenes, costes internos ni datos de otros proveedores.

---

## Plantilla

---

Estimado/a equipo de [NOMBRE DEL TRANSPORTISTA],

Me pongo en contacto con ustedes en nombre de **Vive al Ándalus** (Bin Firnas Travel SL) para solicitar disponibilidad y tarifa para un servicio de transporte privado de grupo.

**DATOS GENERALES DEL SERVICIO**

| Campo | Detalle |
|-------|---------|
| Referencia interna | `{{ref}}` |
| Fecha de inicio servicio | `{{fecha_inicio}}` |
| Fecha de fin servicio | `{{fecha_fin}}` |
| Número de días de servicio | `{{duracion_dias}}` días |
| Total viajeros | `{{total_viajeros}}` (`{{adultos}}` adultos, `{{menores}}` menores) |
| Vehículo solicitado | `{{tipo_vehiculo}}` |
| Conductor incluido | Sí |

**RUTA COMPLETA**

| Orden | Ciudad | Noches | Entrada | Salida |
|-------|--------|--------|---------|--------|
| 1 | `{{ciudad_1}}` | `{{noches_1}}` | `{{fecha_entrada_1}}` | `{{fecha_salida_1}}` |
| 2 | `{{ciudad_2}}` | `{{noches_2}}` | `{{fecha_entrada_2}}` | `{{fecha_salida_2}}` |
| 3 | `{{ciudad_3}}` | `{{noches_3}}` | `{{fecha_entrada_3}}` | `{{fecha_salida_3}}` |
| 4 | `{{ciudad_4}}` | `{{noches_4}}` | `{{fecha_entrada_4}}` | `{{fecha_salida_4}}` |
| 5 | `{{ciudad_5}}` | `{{noches_5}}` | `{{fecha_entrada_5}}` | `{{fecha_salida_5}}` |
| 6 | `{{ciudad_6}}` | `{{noches_6}}` | `{{fecha_entrada_6}}` | `{{fecha_salida_6}}` |

*Nota: ajustar tabla según ciudades reales del expediente.*

**TRAMOS PRINCIPALES**

| Tramo | Ruta |
|-------|------|
| 1 | `{{ciudad_inicio}}` → siguiente ciudad |
| … | … |
| N | Penúltima ciudad → `{{ciudad_final}}` |

**TRANSFERS DE AEROPUERTO**

| Tipo | Detalle |
|------|---------|
| Transfer llegada | `{{llegada_aeropuerto}}` — `{{llegada_fecha}}` — `{{llegada_hora}}` — Vuelo: `{{llegada_vuelo}}` |
| Cartel de bienvenida | Apellido: [APELLIDO CARTEL] |
| Transfer salida | `{{salida_aeropuerto}}` — `{{salida_fecha}}` — Hora necesaria en aeropuerto: [HH:MM] |

**EQUIPAJE**

- Servicio de maletas en hoteles: incluido (coordinar con cada hotel).
- Espacio en vehículo: prever equipaje de `{{total_viajeros}}` viajeros con maletas de viaje largo.

**PERNOCTA DEL CONDUCTOR**

- El conductor pernoctará en los mismos hoteles que el grupo.
- 1 habitación operativa para conductor (y tour leader si aplica) — se coordinará con cada hotel.

**SOLICITUD DE INFORMACIÓN**

Por favor, indíquenos:
1. Disponibilidad para las fechas indicadas.
2. Tarifa neta por el servicio completo (ruta completa + transfers aeropuerto).
3. Tarifa por tramos si aplica (día activo, día espera, km).
4. Vehículo(s) disponible(s) y capacidad real.
5. Número de conductores recomendado según normativa de descanso para esta ruta.
6. Condiciones: depósito, cancelación, no-show.
7. Experiencia previa con grupos de turismo halal (valorable).

Quedamos a su disposición para cualquier aclaración o para enviar la ruta detallada con distancias estimadas.

Un cordial saludo,

---

Vive al Ándalus  
BIN FIRNAS TRAVEL SL

Abdulah Jiménez Contreras  
Teléfono: 633 30 59 06  
Correo: reservas@vivealandalus.com  
Web: www.vivealandalus.com

Puede consultar nuestras condiciones generales, aviso legal y política de privacidad en www.vivealandalus.com.

---

## Notas operativas

- **Envío:** MANUAL. Abdu revisa y aprueba antes de enviar.
- Completar manualmente: nombre del transportista, tabla de ciudades con fechas reales, cartel (apellido del cliente), hora necesaria en aeropuerto de salida.
- Los datos de km y tiempos del bloque `operacion_ruta` del expediente son **estimados orientativos** — el transportista debe validar la viabilidad operativa y legal.
- Si `operacion_ruta.validado_por_transportista = false`, indicar en el correo que los datos de ruta son preliminares y solicitar validación.
- Archivar respuesta en `operacion_interna.proveedores.transporte` y actualizar `operacion_ruta._meta.validado_por_transportista`.

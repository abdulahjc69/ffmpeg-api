# C04 — Documentación final del viaje al cliente

**Código:** C04  
**Tipo:** Cliente externo  
**Trigger:** Condiciones obligatorias O1–O6 cumplidas (ver abajo)  
**Envío:** Manual por Abdu. Nunca automático.  
**Idioma:** `{{idioma_envio_final}}` (ver bloque de idioma más abajo)  
**Desde:** reservas@vivealandalus.com  
**Para:** `{{email_cliente}}`  
**CC obligatorio:** reservas@vivealandalus.com (copia interna de archivo)  
**Asunto:** ver tabla por idioma

---

## Posición en el ciclo comercial

```
C01 → C02 → C03 → [operativa proveedores] → C04 → [viaje] → C05
```

C04 es el kit de viaje completo. Es el único correo que el cliente necesita para desenvolverse en destino. Su ausencia o sus datos incorrectos tienen impacto directo sobre la experiencia del grupo.

---

## Condiciones obligatorias de envío

**C04 solo puede enviarse si se cumplen TODAS las condiciones siguientes:**

| # | Condición | Campo de verificación |
|---|-----------|----------------------|
| O1 | Reserva activa (no cancelada, no en disputa) | `reserva.estado_reserva.estado ∉ {cancelada, en_disputa}` |
| O2 | Pago completo al 100% confirmado | `reserva.estado_financiero.porcentaje_cobrado = 100` |
| O3 | Todos los proveedores clave confirmados con localizador | `reserva.estado_proveedores[n].confirmado = true` y `localizador ≠ null` en alojamientos y transporte |
| O4 | Programa definitivo cerrado y aprobado por Abdu | `reserva.estado_documentacion.programa_definitivo_cerrado = true` |
| O5 | Vouchers generados | `reserva.estado_documentacion.vouchers_generados = true` |
| O6 | Pasaportes de todos los viajeros recibidos | `reserva.estado_documentacion.pasaportes_recibidos = true` |

**Si alguna condición obligatoria no se cumple, C04 no se envía. No hay excepciones.**

### Condiciones recomendadas (no bloquean, Abdu decide)

| # | Condición | Acción si no cumple |
|---|-----------|---------------------|
| R1 | Tour leader asignado con teléfono de contacto | Si no hay tour leader, el contacto en destino es Abdu directamente |
| R2 | Seguro de viaje del cliente verificado | Incluir advertencia en C04 si `seguro_viaje = false` |
| R3 | Rooming list completa | Advertir a los hoteles si falta asignación de habitaciones |
| R4 | Entradas a monumentos reservadas | Incluir nota al cliente si hay visitas pendientes de confirmar |

### Al enviar C04, actualizar en la reserva

| Campo | Nuevo valor |
|-------|-------------|
| `estado_documentacion.vouchers_enviados` | `true` |
| `estado_documentacion.programa_enviado` | `true` |
| `estado_reserva.estado` | `documentacion_enviada` |
| `estado_reserva.motivo_cambio_estado` | `"C04 enviado. Documentación completa entregada al cliente."` |

Registrar en `reserva.historial`:
```
accion: "Correo C04 enviado. Kit de viaje completo entregado al cliente."
realizado_por: "Abdulah Jiménez Contreras"
estado_anterior: "pago_completo_confirmado"
estado_nuevo: "documentacion_enviada"
```

Actualizar `responsable_actual` tras el envío:
```
responsable_actual: "tour_leader"  (si asignado) / "abdu" (si no hay tour leader)
proxima_accion: "Briefing final con el grupo / Coordinación día de llegada"
fecha_limite_accion: fecha_entrada - 2 días
prioridad_accion: "alta"
```

---

## Bloque de idioma

| Campo | Origen | Descripción |
|-------|--------|-------------|
| `idioma_detectado` | Wizard / formulario de solicitud | Idioma original del formulario |
| `idioma_preferido` | `reserva.cliente.idioma_preferido` | Idioma declarado o detectado |
| `idioma_envio_final` | Decisión de Abdu | Idioma real del envío. Por defecto = `idioma_preferido`. Abdu puede corregirlo. Fallback: `en`. |

**Nota especial de C04:** Este correo contiene información operativa crítica (direcciones, teléfonos, horarios). Un idioma incorrecto tiene consecuencias en destino. Verificar `idioma_envio_final` antes de enviar. En árabe: incluir nombres de hoteles también en español para uso en destino (mostrar al taxista, recepcionista).

---

## Identificadores visibles en el correo

```
Expediente: {{id_expediente}}
Reserva:    {{id_reserva}}
```

---

## Variables permitidas

### Obligatorias

| Variable | Origen |
|----------|--------|
| `{{nombre_cliente}}` | `reserva.cliente.nombre_completo` |
| `{{id_expediente}}` | `reserva.referencias.id_expediente` |
| `{{id_reserva}}` | `reserva._meta.id_reserva` |
| `{{fecha_entrada}}` | `reserva.estado_operacion.fecha_entrada` |
| `{{fecha_salida}}` | `reserva.estado_operacion.fecha_salida` |
| `{{num_noches}}` | `reserva.estado_operacion.num_noches` |
| `{{num_pax}}` | `reserva.cliente.num_pax` |
| `{{destinos_con_fechas}}` | Construido desde `estado_operacion.destinos` + fechas del expediente |
| `{{hoteles_confirmados}}` | `estado_proveedores[]` filtrado por `tipo_servicio = alojamiento` y `confirmado = true` |
| `{{programa_dia_a_dia}}` | Programa definitivo aprobado (`programa_definitivo_cerrado = true`) |
| `{{punto_encuentro_llegada}}` | Instrucción de bienvenida en aeropuerto / estación de llegada |
| `{{cartel_nombre}}` | `expediente.llegada_internacional.cartel_nombre` |
| `{{telefono_emergencia_vaa}}` | `+34 633 30 59 06` (fijo) |
| `{{email_emergencia_vaa}}` | `reservas@vivealandalus.com` (fijo) |

### Opcionales

| Variable | Condición |
|----------|-----------|
| `{{nombre_tour_leader}}` | Si `tour_leader_asignado = true` |
| `{{telefono_tour_leader}}` | Si tour leader asignado con teléfono confirmado |
| `{{nota_halal}}` | Si `halal_requerido = true` — confirmar que todos los servicios cumplen |
| `{{nota_menores}}` | Si `num_menores > 0` |
| `{{nota_accesibilidad}}` | Si hay necesidades de accesibilidad documentadas |
| `{{nota_equipaje}}` | Recomendación de equipaje según tipo de viaje y vehículo |
| `{{nota_clima}}` | Clima esperado por destino y fechas |
| `{{nota_seguro_viaje}}` | Si `seguro_viaje = false` — advertencia al cliente |
| `{{horarios_traslados}}` | Si los horarios de traslado están fijados por el transportista |
| `{{visitas_incluidas}}` | Lista de entradas/visitas confirmadas con horario |
| `{{numero_vuelo_llegada}}` | `expediente.llegada_internacional.numero_vuelo` |
| `{{numero_vuelo_salida}}` | `expediente.salida_internacional.numero_vuelo` |
| `{{num_adultos}}` / `{{num_menores}}` | Si el desglose es relevante |

### Prohibidas — NUNCA en C04

| Variable prohibida | Motivo |
|-------------------|--------|
| `coste_total_proveedores_eur` | Dato interno |
| `margen_bruto_eur` / `margen_porcentaje` | Dato interno |
| `SEL-AAAA-NNNN` / `PRS-AAAA-NNNN` | IDs internos |
| `scoring` de proveedores | Dato interno |
| `incidencias` de proveedores | Dato interno |
| `notas_internas` | Dato interno |
| `hab_staff` (habitación conductor/tour leader) | Dato operativo interno |
| `operacion_ruta` (km, tiempos conducción, alertas conductor) | Dato técnico interno |
| `responsable_actual` (bloque interno) | Dato de gestión interna |
| `alertas[]` de la reserva | Dato de gestión interna |
| Proveedores no seleccionados | Dato interno de selección |
| `estado_financiero` detallado | Solo puede mencionar que el pago está completo |
| `programa_definitivo_aprobado_por` | Dato de gobernanza interna |

---

## Asunto por idioma

| Idioma | Asunto |
|--------|--------|
| AR | وثائق رحلتك جاهزة — الأندلس `{{id_reserva}}` |
| ES | Tu viaje a Al-Ándalus está listo — Documentación completa `{{id_reserva}}` |
| EN | Your Al-Andalus journey is ready — Complete travel pack `{{id_reserva}}` |
| FR | Votre voyage en Al-Andalus est prêt — Dossier complet `{{id_reserva}}` |
| PT | A sua viagem à Al-Ândalus está pronta — Documentação completa `{{id_reserva}}` |

---

## Versión árabe (AR)

**الموضوع:** وثائق رحلتك جاهزة — الأندلس `{{id_reserva}}`

---

عزيزي/عزيزتي `{{nombre_cliente}}`،

يسعدنا أن نبلغك بأن جميع ترتيبات رحلتك إلى الأندلس قد اكتملت. فيما يلي كل ما تحتاجه للانطلاق.

**رقم الملف:** `{{id_expediente}}`  
**رقم الحجز:** `{{id_reserva}}`

---

### بيانات الرحلة

- **تاريخ الوصول:** `{{fecha_entrada}}`
- **تاريخ المغادرة:** `{{fecha_salida}}`
- **عدد الليالي:** `{{num_noches}}` ليلة
- **المسافرون:** `{{num_pax}}` مسافر
- **الوجهات:** `{{destinos_con_fechas}}`

---

### نقطة الاستقبال عند الوصول

`{{punto_encuentro_llegada}}`

سيرفع مرافقكم لافتة باسم: **`{{cartel_nombre}}`**

`{{numero_vuelo_llegada}}`

---

### الفنادق المؤكدة

`{{hoteles_confirmados}}`

*(أسماء الفنادق مذكورة باللغتين العربية والإسبانية للاستخدام في الوجهة)*

---

### برنامج الرحلة اليومي

`{{programa_dia_a_dia}}`

`{{horarios_traslados}}`

`{{visitas_incluidas}}`

---

### مرافق الرحلة

`{{nombre_tour_leader}}`  
**هاتف المرافق:** `{{telefono_tour_leader}}`

---

### معلومات الحلال

`{{nota_halal}}`

---

### معلومات للعائلات مع أطفال

`{{nota_menores}}`

---

### توصيات عملية

`{{nota_equipaje}}`

`{{nota_clima}}`

`{{nota_accesibilidad}}`

`{{nota_seguro_viaje}}`

---

### معلومات للطوارئ

| الجهة | الرقم |
|-------|-------|
| طوارئ إسبانيا | 112 |
| الشرطة الوطنية | 091 |
| Vive al Ándalus — عبد الله | **`{{telefono_emergencia_vaa}}`** |
| البريد الإلكتروني | `{{email_emergencia_vaa}}` |

---

نتمنى لكم رحلة موفقة ولا تُنسى في ربوع الأندلس.

مع أطيب التحيات،

---

Vive al Ándalus  
BIN FIRNAS TRAVEL SL

Abdulah Jiménez Contreras  
Teléfono: 633 30 59 06  
Correo: reservas@vivealandalus.com  
Web: www.vivealandalus.com

Puede consultar nuestras condiciones generales, aviso legal y política de privacidad en www.vivealandalus.com.

---

## Versión español (ES)

**Asunto:** Tu viaje a Al-Ándalus está listo — Documentación completa `{{id_reserva}}`

---

Estimado/a `{{nombre_cliente}}`,

Todo está preparado para tu viaje a Al-Ándalus. Aquí tienes la documentación completa y todo lo que necesitas para salir.

**Expediente:** `{{id_expediente}}`  
**Reserva:** `{{id_reserva}}`

---

### Tu viaje

- **Fecha de llegada:** `{{fecha_entrada}}`
- **Fecha de salida:** `{{fecha_salida}}`
- **Duración:** `{{num_noches}}` noches
- **Viajeros:** `{{num_pax}}`
- **Destinos y fechas:** `{{destinos_con_fechas}}`

---

### Punto de encuentro a tu llegada

`{{punto_encuentro_llegada}}`

Tu acompañante te recibirá con un cartel con el nombre: **`{{cartel_nombre}}`**

`{{numero_vuelo_llegada}}`

---

### Alojamientos confirmados

`{{hoteles_confirmados}}`

---

### Programa del viaje

`{{programa_dia_a_dia}}`

`{{horarios_traslados}}`

`{{visitas_incluidas}}`

---

### Tu acompañante durante el viaje

`{{nombre_tour_leader}}`  
**Teléfono directo:** `{{telefono_tour_leader}}`

---

### Servicios halal

`{{nota_halal}}`

---

### Información para familias con menores

`{{nota_menores}}`

---

### Recomendaciones prácticas

`{{nota_equipaje}}`

`{{nota_clima}}`

`{{nota_accesibilidad}}`

`{{nota_seguro_viaje}}`

---

### Contactos de emergencia

| Servicio | Teléfono |
|----------|---------|
| Emergencias España | 112 |
| Policía Nacional | 091 |
| Guardia Civil | 062 |
| Vive al Ándalus — Abdulah | **`{{telefono_emergencia_vaa}}`** |
| Email de contacto | `{{email_emergencia_vaa}}` |

---

¡Que disfrutes de cada momento en Al-Ándalus!

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

## Versión inglés (EN)

**Subject:** Your Al-Andalus journey is ready — Complete travel pack `{{id_reserva}}`

---

Dear `{{nombre_cliente}}`,

Everything is in place for your journey to Al-Andalus. Please find below your complete travel pack with all the information you need.

**Reference:** `{{id_expediente}}`  
**Booking:** `{{id_reserva}}`

---

### Your trip

- **Arrival date:** `{{fecha_entrada}}`
- **Departure date:** `{{fecha_salida}}`
- **Duration:** `{{num_noches}}` nights
- **Travellers:** `{{num_pax}}`
- **Destinations and dates:** `{{destinos_con_fechas}}`

---

### Meeting point on arrival

`{{punto_encuentro_llegada}}`

Your guide/escort will be holding a sign with the name: **`{{cartel_nombre}}`**

`{{numero_vuelo_llegada}}`

---

### Confirmed hotels

`{{hoteles_confirmados}}`

*(Hotel names are shown in Spanish for use at destination — show to taxi drivers and hotel reception)*

---

### Travel itinerary

`{{programa_dia_a_dia}}`

`{{horarios_traslados}}`

`{{visitas_incluidas}}`

---

### Your tour leader

`{{nombre_tour_leader}}`  
**Direct phone:** `{{telefono_tour_leader}}`

---

### Halal services

`{{nota_halal}}`

---

### Information for families with children

`{{nota_menores}}`

---

### Practical recommendations

`{{nota_equipaje}}`

`{{nota_clima}}`

`{{nota_accesibilidad}}`

`{{nota_seguro_viaje}}`

---

### Emergency contacts

| Service | Phone |
|---------|-------|
| Spain emergency services | 112 |
| National Police | 091 |
| Civil Guard | 062 |
| Vive al Ándalus — Abdulah | **`{{telefono_emergencia_vaa}}`** |
| Email | `{{email_emergencia_vaa}}` |

---

We wish you an unforgettable journey through Al-Andalus. We are always available if you need us.

Kind regards,

---

Vive al Ándalus  
BIN FIRNAS TRAVEL SL

Abdulah Jiménez Contreras  
Phone: 633 30 59 06  
Email: reservas@vivealandalus.com  
Web: www.vivealandalus.com

You can review our general terms, legal notice and privacy policy at www.vivealandalus.com.

---

## Versión francés (FR)

**Objet :** Votre voyage en Al-Andalus est prêt — Dossier complet `{{id_reserva}}`

---

Cher/Chère `{{nombre_cliente}}`,

Tout est prêt pour votre voyage en Al-Andalus. Vous trouverez ci-dessous votre dossier de voyage complet avec toutes les informations dont vous aurez besoin.

**Dossier :** `{{id_expediente}}`  
**Réservation :** `{{id_reserva}}`

---

### Votre voyage

- **Date d'arrivée :** `{{fecha_entrada}}`
- **Date de départ :** `{{fecha_salida}}`
- **Durée :** `{{num_noches}}` nuits
- **Voyageurs :** `{{num_pax}}`
- **Destinations et dates :** `{{destinos_con_fechas}}`

---

### Point de rendez-vous à l'arrivée

`{{punto_encuentro_llegada}}`

Votre accompagnateur vous attendra avec une pancarte au nom de : **`{{cartel_nombre}}`**

`{{numero_vuelo_llegada}}`

---

### Hôtels confirmés

`{{hoteles_confirmados}}`

*(Les noms des hôtels sont indiqués en espagnol pour usage sur place)*

---

### Programme du voyage

`{{programa_dia_a_dia}}`

`{{horarios_traslados}}`

`{{visitas_incluidas}}`

---

### Votre accompagnateur

`{{nombre_tour_leader}}`  
**Téléphone direct :** `{{telefono_tour_leader}}`

---

### Services halal

`{{nota_halal}}`

---

### Informations pour les familles avec enfants

`{{nota_menores}}`

---

### Recommandations pratiques

`{{nota_equipaje}}`

`{{nota_clima}}`

`{{nota_accesibilidad}}`

`{{nota_seguro_viaje}}`

---

### Contacts d'urgence

| Service | Téléphone |
|---------|-----------|
| Urgences Espagne | 112 |
| Police nationale | 091 |
| Garde civile | 062 |
| Vive al Ándalus — Abdulah | **`{{telefono_emergencia_vaa}}`** |
| E-mail | `{{email_emergencia_vaa}}` |

---

Nous vous souhaitons un voyage inoubliable en Al-Andalus. N'hésitez pas à nous contacter à tout moment.

Cordialement,

---

Vive al Ándalus  
BIN FIRNAS TRAVEL SL

Abdulah Jiménez Contreras  
Téléphone : 633 30 59 06  
Courriel : reservas@vivealandalus.com  
Web : www.vivealandalus.com

Vous pouvez consulter nos conditions générales, mentions légales et politique de confidentialité sur www.vivealandalus.com.

---

## Versión portugués (PT)

**Assunto:** A sua viagem à Al-Ândalus está pronta — Documentação completa `{{id_reserva}}`

---

Caro/a `{{nombre_cliente}}`,

Tudo está preparado para a sua viagem à Al-Ândalus. Encontra abaixo a sua documentação completa com tudo o que precisa.

**Processo:** `{{id_expediente}}`  
**Reserva:** `{{id_reserva}}`

---

### A sua viagem

- **Data de chegada:** `{{fecha_entrada}}`
- **Data de partida:** `{{fecha_salida}}`
- **Duração:** `{{num_noches}}` noites
- **Viajantes:** `{{num_pax}}`
- **Destinos e datas:** `{{destinos_con_fechas}}`

---

### Ponto de encontro à chegada

`{{punto_encuentro_llegada}}`

O seu acompanhante estará à espera com uma placa com o nome: **`{{cartel_nombre}}`**

`{{numero_vuelo_llegada}}`

---

### Hotéis confirmados

`{{hoteles_confirmados}}`

*(Os nomes dos hotéis estão indicados em espanhol para uso no destino)*

---

### Programa da viagem

`{{programa_dia_a_dia}}`

`{{horarios_traslados}}`

`{{visitas_incluidas}}`

---

### O seu acompanhante de viagem

`{{nombre_tour_leader}}`  
**Telefone direto:** `{{telefono_tour_leader}}`

---

### Serviços halal

`{{nota_halal}}`

---

### Informações para famílias com crianças

`{{nota_menores}}`

---

### Recomendações práticas

`{{nota_equipaje}}`

`{{nota_clima}}`

`{{nota_accesibilidad}}`

`{{nota_seguro_viaje}}`

---

### Contactos de emergência

| Serviço | Telefone |
|---------|---------|
| Emergências Espanha | 112 |
| Polícia Nacional | 091 |
| Guarda Civil | 062 |
| Vive al Ándalus — Abdulah | **`{{telefono_emergencia_vaa}}`** |
| E-mail | `{{email_emergencia_vaa}}` |

---

Desejamos-lhe uma viagem inesquecível pela Al-Ândalus. Estamos sempre disponíveis para si.

Com os melhores cumprimentos,

---

Vive al Ándalus  
BIN FIRNAS TRAVEL SL

Abdulah Jiménez Contreras  
Telefone: 633 30 59 06  
E-mail: reservas@vivealandalus.com  
Web: www.vivealandalus.com

Pode consultar as nossas condições gerais, aviso legal e política de privacidade em www.vivealandalus.com.

---

*Documento interno. No distribuir fuera de Bin Firnas Travel SL.*

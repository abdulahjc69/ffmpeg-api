# C02 — Envío de propuesta comercial al cliente

**Código:** C02  
**Tipo:** Cliente externo  
**Trigger:** `propuesta_comercial_v1.aprobacion_humana.aprobada = true`  
**Envío:** Manual por Abdu. Nunca automático.  
**Idioma:** `{{idioma_envio_final}}` (ver bloque de idioma más abajo)  
**Desde:** reservas@vivealandalus.com  
**Para:** `{{email_cliente}}`  
**CC obligatorio:** reservas@vivealandalus.com (copia interna de archivo)  
**Asunto:** ver tabla por idioma

---

## Regla de disparo

**C02 solo puede enviarse si se cumplen TODAS estas condiciones:**

1. `propuesta_comercial_v1.aprobacion_humana.aprobada = true`
2. `propuesta_comercial_v1._meta.estado = aprobada`
3. `propuesta_comercial_v1._meta.fecha_validez` no superada en el momento del envío
4. Abdu ha revisado el contenido final del correo

**La IA puede preparar el correo. La IA no puede enviarlo. El envío es siempre humano.**

Al enviar, actualizar en `propuesta_comercial_v1`:
- `_meta.estado → enviada`
- `_meta.fecha_emision → fecha real de envío`
- `_meta.enviada_por → "Abdulah Jiménez Contreras"`

---

## Bloque de idioma

| Campo | Origen | Descripción |
|-------|--------|-------------|
| `idioma_detectado` | Wizard / formulario de solicitud | Idioma en que el cliente rellenó el formulario |
| `idioma_preferido` | `expediente.cliente.idioma_comunicacion` | Idioma declarado por el cliente o detectado en conversación |
| `idioma_envio_final` | Decisión de Abdu | Idioma real en que se envía el correo. Por defecto = `idioma_preferido`. Abdu puede cambiarlo si el cliente se ha comunicado en otro idioma durante el proceso. |

**Fallback:** Si `idioma_envio_final` no está entre `[ar, es, en, fr, pt]` → usar `en`.

---

## Identificadores visibles en el correo

Todo correo C02 debe mostrar claramente:

```
Expediente: {{id_expediente}}
Propuesta:  {{id_propuesta}}
```

---

## Variables permitidas

### Obligatorias

| Variable | Origen |
|----------|--------|
| `{{nombre_cliente}}` | `expediente.cliente.nombre_completo` |
| `{{id_expediente}}` | `propuesta.referencias.id_expediente` |
| `{{id_propuesta}}` | `propuesta._meta.id_propuesta` |
| `{{fecha_entrada}}` | `propuesta.viaje.fecha_entrada` |
| `{{fecha_salida}}` | `propuesta.viaje.fecha_salida` |
| `{{num_noches}}` | `propuesta.viaje.num_noches` |
| `{{num_pax}}` | `propuesta.viaje.num_pax` |
| `{{destinos}}` | `propuesta.viaje.destinos` (lista legible) |
| `{{precio_total_eur}}` | `propuesta.precio_cliente.precio_total_eur` |
| `{{precio_por_persona_eur}}` | `propuesta.precio_cliente.precio_por_persona_eur` |
| `{{deposito_requerido_eur}}` | `propuesta.precio_cliente.deposito_requerido_eur` (30%) |
| `{{fecha_validez}}` | `propuesta._meta.fecha_validez` |

### Opcionales

| Variable | Condición |
|----------|-----------|
| `{{resumen_servicios_incluidos}}` | Lista legible de `servicios_incluidos` |
| `{{servicios_excluidos}}` | Si hay exclusiones relevantes (vuelos, visados) |
| `{{condiciones_cancelacion_resumen}}` | Resumen legible de tramos de cancelación |
| `{{nota_halal}}` | Si `requisitos_especiales.halal = true` |
| `{{nota_accesibilidad}}` | Si hay necesidades de accesibilidad documentadas |
| `{{nota_version_revisada}}` | Si es V2 o posterior: "Propuesta revisada" |
| `{{num_adultos}}` | Si el desglose adultos/menores es relevante |
| `{{num_menores}}` | Si el desglose adultos/menores es relevante |

### Prohibidas — NUNCA en C02

| Variable prohibida | Motivo |
|-------------------|--------|
| `coste_total_proveedores_eur` | Dato interno |
| `margen_bruto_eur` | Dato interno |
| `margen_porcentaje` | Dato interno |
| Nombres de proveedores no confirmados | Dato interno de selección |
| `ids_selecciones_activas` / cualquier `SEL-AAAA-NNNN` | Dato interno |
| `ids_presupuestos` / cualquier `PRS-AAAA-NNNN` | Dato interno |
| `scoring` de proveedores | Dato interno |
| `incidencias` de proveedores | Dato interno |
| `notas_internas` de cualquier bloque | Dato interno |
| Campos del bloque `aprobacion_humana` | Dato de gobernanza interna |
| `presupuestos_proveedores` | Dato interno |
| `nivel_estrategico` del proveedor | Dato interno |

---

## Asunto por idioma

| Idioma | Asunto |
|--------|--------|
| AR | عرض رحلتك المخصص إلى الأندلس — Ref. `{{id_propuesta}}` |
| ES | Tu propuesta personalizada para Al-Ándalus — Ref. `{{id_propuesta}}` |
| EN | Your personalised Al-Andalus travel proposal — Ref. `{{id_propuesta}}` |
| FR | Votre proposition de voyage personnalisée en Al-Andalus — Réf. `{{id_propuesta}}` |
| PT | A sua proposta personalizada para a Al-Ândalus — Ref. `{{id_propuesta}}` |

---

## Versión árabe (AR)

**Asunto:** عرض رحلتك المخصص إلى الأندلس — Ref. `{{id_propuesta}}`

---

عزيزي/عزيزتي `{{nombre_cliente}}`،

يسعدنا أن نقدم لك عرضنا المخصص لرحلتك إلى الأندلس.

**بيانات الرحلة:**

- **رقم الملف:** `{{id_expediente}}`
- **رقم العرض:** `{{id_propuesta}}`
- **تاريخ الوصول:** `{{fecha_entrada}}`
- **تاريخ المغادرة:** `{{fecha_salida}}`
- **عدد الليالي:** `{{num_noches}}` ليلة
- **المسافرون:** `{{num_pax}}` مسافر
- **الوجهات:** `{{destinos}}`

---

**السعر الإجمالي:**

| | |
|--|--|
| السعر الكامل للرحلة | `{{precio_total_eur}}` يورو |
| السعر للشخص الواحد | `{{precio_por_persona_eur}}` يورو |
| **لتأكيد الحجز (30%)** | **`{{deposito_requerido_eur}}` يورو** |

---

**ما يشمله العرض:**

`{{resumen_servicios_incluidos}}`

`{{nota_halal}}`

---

**لتأكيد حجزك:**

يُرجى تحويل مبلغ التأمين **`{{deposito_requerido_eur}}` يورو** عبر الحوالة المصرفية قبل تاريخ **`{{fecha_validez}}`**.

بعد استلام التأمين، سنرسل لك تأكيد الحجز الرسمي وسنبدأ فوراً في تنسيق جميع خدمات رحلتك.

---

هذا العرض صالح حتى: **`{{fecha_validez}}`**

للاستفسار أو التعديل، يمكنك التواصل معنا عبر البريد الإلكتروني أو واتساب على الرقم: **+34 633 30 59 06**

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

**Asunto:** Tu propuesta personalizada para Al-Ándalus — Ref. `{{id_propuesta}}`

---

Estimado/a `{{nombre_cliente}}`,

Nos complace enviarte tu propuesta personalizada para viajar a Al-Ándalus.

**Datos del viaje:**

- **Expediente:** `{{id_expediente}}`
- **Propuesta:** `{{id_propuesta}}`
- **Fecha de llegada:** `{{fecha_entrada}}`
- **Fecha de salida:** `{{fecha_salida}}`
- **Duración:** `{{num_noches}}` noches
- **Viajeros:** `{{num_pax}}`
- **Destinos:** `{{destinos}}`

---

**Precio de la propuesta:**

| | |
|--|--|
| Precio total del viaje | `{{precio_total_eur}}` EUR |
| Precio por persona | `{{precio_por_persona_eur}}` EUR |
| **Para confirmar reserva (30%)** | **`{{deposito_requerido_eur}}` EUR** |

---

**Qué incluye:**

`{{resumen_servicios_incluidos}}`

`{{nota_halal}}`

`{{nota_accesibilidad}}`

**Qué no incluye:**

`{{servicios_excluidos}}`

---

**Condiciones de cancelación:**

`{{condiciones_cancelacion_resumen}}`

---

**Para confirmar tu reserva:**

Realiza una transferencia bancaria de **`{{deposito_requerido_eur}}` EUR** antes del **`{{fecha_validez}}`**.

Tras recibir el depósito, te enviaremos la confirmación oficial de reserva y comenzaremos la coordinación de todos los servicios.

Esta propuesta tiene validez hasta el **`{{fecha_validez}}`**. Transcurrida esa fecha sin confirmación, los precios y disponibilidad quedan sujetos a revisión.

Para cualquier consulta, responde a este correo o contáctanos por WhatsApp en el **+34 633 30 59 06**.

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

**Subject:** Your personalised Al-Andalus travel proposal — Ref. `{{id_propuesta}}`

---

Dear `{{nombre_cliente}}`,

We are delighted to present your personalised travel proposal for Al-Andalus.

**Trip details:**

- **Reference:** `{{id_expediente}}`
- **Proposal:** `{{id_propuesta}}`
- **Arrival date:** `{{fecha_entrada}}`
- **Departure date:** `{{fecha_salida}}`
- **Duration:** `{{num_noches}}` nights
- **Travellers:** `{{num_pax}}`
- **Destinations:** `{{destinos}}`

---

**Pricing:**

| | |
|--|--|
| Total trip price | `{{precio_total_eur}}` EUR |
| Price per person | `{{precio_por_persona_eur}}` EUR |
| **To confirm booking (30%)** | **`{{deposito_requerido_eur}}` EUR** |

---

**What's included:**

`{{resumen_servicios_incluidos}}`

`{{nota_halal}}`

`{{nota_accesibilidad}}`

**What's not included:**

`{{servicios_excluidos}}`

---

**Cancellation policy:**

`{{condiciones_cancelacion_resumen}}`

---

**How to confirm your booking:**

Please transfer **`{{deposito_requerido_eur}}` EUR** by bank transfer before **`{{fecha_validez}}`**.

Once we receive your deposit, we will send you the official booking confirmation and immediately begin coordinating all services for your journey.

This proposal is valid until **`{{fecha_validez}}`**. After this date, prices and availability are subject to change.

For any questions, simply reply to this email or contact us via WhatsApp at **+34 633 30 59 06**.

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

**Objet :** Votre proposition de voyage personnalisée en Al-Andalus — Réf. `{{id_propuesta}}`

---

Cher/Chère `{{nombre_cliente}}`,

Nous avons le plaisir de vous présenter votre proposition de voyage personnalisée en Al-Andalus.

**Détails du voyage :**

- **Dossier :** `{{id_expediente}}`
- **Proposition :** `{{id_propuesta}}`
- **Date d'arrivée :** `{{fecha_entrada}}`
- **Date de départ :** `{{fecha_salida}}`
- **Durée :** `{{num_noches}}` nuits
- **Voyageurs :** `{{num_pax}}`
- **Destinations :** `{{destinos}}`

---

**Tarification :**

| | |
|--|--|
| Prix total du voyage | `{{precio_total_eur}}` EUR |
| Prix par personne | `{{precio_por_persona_eur}}` EUR |
| **Pour confirmer la réservation (30 %)** | **`{{deposito_requerido_eur}}` EUR** |

---

**Ce qui est inclus :**

`{{resumen_servicios_incluidos}}`

`{{nota_halal}}`

`{{nota_accesibilidad}}`

**Ce qui n'est pas inclus :**

`{{servicios_excluidos}}`

---

**Conditions d'annulation :**

`{{condiciones_cancelacion_resumen}}`

---

**Pour confirmer votre réservation :**

Veuillez effectuer un virement bancaire de **`{{deposito_requerido_eur}}` EUR** avant le **`{{fecha_validez}}`**.

Dès réception de votre acompte, nous vous enverrons la confirmation officielle de réservation et commencerons immédiatement la coordination de tous les services de votre voyage.

Cette proposition est valable jusqu'au **`{{fecha_validez}}`**. Passée cette date, les prix et disponibilités sont susceptibles d'être modifiés.

Pour toute question, répondez simplement à cet e-mail ou contactez-nous via WhatsApp au **+34 633 30 59 06**.

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

**Assunto:** A sua proposta personalizada para a Al-Ândalus — Ref. `{{id_propuesta}}`

---

Caro/a `{{nombre_cliente}}`,

Temos o prazer de lhe apresentar a sua proposta de viagem personalizada para a Al-Ândalus.

**Detalhes da viagem:**

- **Processo:** `{{id_expediente}}`
- **Proposta:** `{{id_propuesta}}`
- **Data de chegada:** `{{fecha_entrada}}`
- **Data de partida:** `{{fecha_salida}}`
- **Duração:** `{{num_noches}}` noites
- **Viajantes:** `{{num_pax}}`
- **Destinos:** `{{destinos}}`

---

**Preço:**

| | |
|--|--|
| Preço total da viagem | `{{precio_total_eur}}` EUR |
| Preço por pessoa | `{{precio_por_persona_eur}}` EUR |
| **Para confirmar a reserva (30 %)** | **`{{deposito_requerido_eur}}` EUR** |

---

**O que está incluído:**

`{{resumen_servicios_incluidos}}`

`{{nota_halal}}`

`{{nota_accesibilidad}}`

**O que não está incluído:**

`{{servicios_excluidos}}`

---

**Condições de cancelamento:**

`{{condiciones_cancelacion_resumen}}`

---

**Como confirmar a sua reserva:**

Efetue uma transferência bancária de **`{{deposito_requerido_eur}}` EUR** antes de **`{{fecha_validez}}`**.

Após recebermos o depósito, enviaremos a confirmação oficial de reserva e iniciaremos imediatamente a coordenação de todos os serviços da sua viagem.

Esta proposta é válida até **`{{fecha_validez}}`**. Após essa data, os preços e disponibilidades ficam sujeitos a revisão.

Para qualquer dúvida, responda a este e-mail ou contacte-nos via WhatsApp para o **+34 633 30 59 06**.

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

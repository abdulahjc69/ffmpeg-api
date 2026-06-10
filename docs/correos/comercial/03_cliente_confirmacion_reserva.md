# C03 — Confirmación de reserva tras pago del 30%

**Código:** C03  
**Tipo:** Cliente externo  
**Trigger:** `reserva_comercial_v1.pagos[n].confirmado = true` + `reserva_comercial_v1.estado_financiero.porcentaje_cobrado ≥ 30`  
**Envío:** Manual por Abdu. Nunca automático.  
**Idioma:** `{{idioma_envio_final}}` (ver bloque de idioma más abajo)  
**Desde:** reservas@vivealandalus.com  
**Para:** `{{email_cliente}}`  
**CC obligatorio:** reservas@vivealandalus.com (copia interna de archivo)  
**Asunto:** ver tabla por idioma

---

## Regla de disparo

**C03 solo puede enviarse si se cumplen TODAS estas condiciones:**

1. `reserva_comercial_v1.pagos[n].confirmado = true` — el ingreso está verificado en cuenta, no solo registrado
2. `reserva_comercial_v1.estado_financiero.porcentaje_cobrado ≥ 30`
3. `reserva_comercial_v1.estado_reserva.estado = primer_pago_confirmado` o superior
4. Existe `id_reserva` válido (`RES-AAAA-NNNN`)
5. Abdu ha verificado el ingreso bancario real

**Un pago registrado pero no confirmado no es suficiente. Abdu verifica el ingreso antes de enviar C03.**

Al enviar, registrar en `reserva_comercial_v1.historial`:
```
accion: "Correo C03 enviado al cliente. Reserva confirmada."
realizado_por: "Abdulah Jiménez Contreras"
```

Actualizar `responsable_actual` tras el envío:
```
responsable_actual: "abdu"
proxima_accion: "Contactar proveedores y solicitar confirmación de servicios"
```

---

## Bloque de idioma

| Campo | Origen | Descripción |
|-------|--------|-------------|
| `idioma_detectado` | Wizard / formulario de solicitud | Idioma en que el cliente rellenó el formulario |
| `idioma_preferido` | `reserva.cliente.idioma_preferido` | Idioma declarado o detectado en conversación previa |
| `idioma_envio_final` | Decisión de Abdu | Idioma real en que se envía el correo. Por defecto = `idioma_preferido`. Abdu puede cambiarlo si el cliente se ha comunicado en otro idioma durante el proceso. |

**Fallback:** Si `idioma_envio_final` no está entre `[ar, es, en, fr, pt]` → usar `en`.

---

## Identificadores visibles en el correo

Todo correo C03 debe mostrar claramente:

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
| `{{destinos}}` | `reserva.estado_operacion.destinos` (lista legible) |
| `{{num_pax}}` | `reserva.cliente.num_pax` |
| `{{deposito_recibido_eur}}` | `reserva.pagos[0].importe_eur` (primer pago confirmado) |
| `{{precio_total_eur}}` | `reserva.estado_financiero.precio_total_venta_eur` |
| `{{pendiente_eur}}` | `reserva.estado_financiero.total_pendiente_cobro_eur` |
| `{{fecha_limite_pago_completo}}` | `reserva.estado_financiero.fecha_limite_pago_completo` |

### Opcionales

| Variable | Condición |
|----------|-----------|
| `{{nota_halal}}` | Si hay requisitos halal en la reserva |
| `{{nota_accesibilidad}}` | Si hay necesidades de accesibilidad |
| `{{num_adultos}}` | Si el desglose adultos/menores es relevante |
| `{{num_menores}}` | Si el desglose adultos/menores es relevante |
| `{{nombre_tour_leader}}` | Solo si `tour_leader_asignado = true` y Abdu decide mencionarlo |
| `{{recordatorio_pasaportes}}` | Si `pasaportes_recibidos = false` — recordatorio gentil |

### Prohibidas — NUNCA en C03

| Variable prohibida | Motivo |
|-------------------|--------|
| `coste_total_proveedores_eur` | Dato interno |
| `margen_bruto_eur` | Dato interno |
| `margen_porcentaje` | Dato interno |
| Nombres de hoteles, transportistas o guías | Nunca antes de que los vouchers estén listos con localizador. El cliente no debe saber de cambios de proveedor. |
| `ids_selecciones_activas` / cualquier `SEL-AAAA-NNNN` | Dato interno |
| `ids_presupuestos` / cualquier `PRS-AAAA-NNNN` | Dato interno |
| `scoring` de proveedores | Dato interno |
| `incidencias` de proveedores | Dato interno |
| `notas_internas` de cualquier bloque | Dato interno |
| `alertas` activas | Dato de gestión interna |
| `responsable_actual` (bloque interno) | Dato de gestión interna |
| `historial` interno (raw) | Dato de gestión interna |
| `nivel_estrategico` de proveedor | Dato interno |
| `estado_proveedores` (raw) | Dato operativo interno |

---

## Asunto por idioma

| Idioma | Asunto |
|--------|--------|
| AR | تأكيد حجزك — رحلة الأندلس `{{id_reserva}}` |
| ES | Confirmación de reserva — Tu viaje a Al-Ándalus `{{id_reserva}}` |
| EN | Booking confirmed — Your Al-Andalus journey `{{id_reserva}}` |
| FR | Réservation confirmée — Votre voyage en Al-Andalus `{{id_reserva}}` |
| PT | Reserva confirmada — A sua viagem à Al-Ândalus `{{id_reserva}}` |

---

## Versión árabe (AR)

**Asunto:** تأكيد حجزك — رحلة الأندلس `{{id_reserva}}`

---

عزيزي/عزيزتي `{{nombre_cliente}}`،

يسعدنا أن نؤكد لك استلام مبلغ التأمين وتثبيت حجزك رسمياً.

**تأكيد الحجز:**

- **رقم الملف:** `{{id_expediente}}`
- **رقم الحجز:** `{{id_reserva}}`
- **تاريخ الوصول:** `{{fecha_entrada}}`
- **تاريخ المغادرة:** `{{fecha_salida}}`
- **عدد الليالي:** `{{num_noches}}` ليلة
- **المسافرون:** `{{num_pax}}` مسافر
- **الوجهات:** `{{destinos}}`

---

**حالة الدفع:**

| | |
|--|--|
| المبلغ المستلم (30%) | `{{deposito_recibido_eur}}` يورو ✓ |
| المبلغ المتبقي | `{{pendiente_eur}}` يورو |
| **الموعد النهائي للدفع الكامل** | **`{{fecha_limite_pago_completo}}`** |

يُرجى إتمام الدفع الكامل عبر الحوالة المصرفية قبل التاريخ المحدد أعلاه.

---

**ما يحدث الآن:**

بدأنا فور استلام تأمينك في التنسيق مع جميع مزودي الخدمات لضمان تجربة سفر مثالية.

ستتلقى وثائق رحلتك الكاملة (القسائم والبرنامج النهائي) قريباً، بعد تأكيد جميع الخدمات.

`{{recordatorio_pasaportes}}`

`{{nota_halal}}`

---

للاستفسار أو التعديل، يمكنك التواصل معنا في أي وقت عبر البريد الإلكتروني أو واتساب على الرقم: **+34 633 30 59 09**

مع أطيب التحيات،

---

Vive al Ándalus  
BIN FIRNAS TRAVEL SL

Abdulah Jiménez Contreras  
Teléfono: 633 30 59 09  
Correo: reservas@vivealandalus.com  
Web: www.vivealandalus.com

Puede consultar nuestras condiciones generales, aviso legal y política de privacidad en www.vivealandalus.com.

---

## Versión español (ES)

**Asunto:** Confirmación de reserva — Tu viaje a Al-Ándalus `{{id_reserva}}`

---

Estimado/a `{{nombre_cliente}}`,

Hemos recibido tu depósito y tu reserva está confirmada. A partir de este momento, Vive al Ándalus comienza a coordinar todos los servicios de tu viaje.

**Datos de tu reserva confirmada:**

- **Expediente:** `{{id_expediente}}`
- **Reserva:** `{{id_reserva}}`
- **Fecha de llegada:** `{{fecha_entrada}}`
- **Fecha de salida:** `{{fecha_salida}}`
- **Duración:** `{{num_noches}}` noches
- **Viajeros:** `{{num_pax}}`
- **Destinos:** `{{destinos}}`

---

**Estado del pago:**

| | |
|--|--|
| Depósito recibido (30 %) | `{{deposito_recibido_eur}}` EUR ✓ |
| Importe pendiente | `{{pendiente_eur}}` EUR |
| **Fecha límite pago completo** | **`{{fecha_limite_pago_completo}}`** |

El pago restante debe realizarse por transferencia bancaria antes de la fecha indicada.

---

**¿Qué ocurre ahora?**

Comenzamos inmediatamente la coordinación de todos los servicios. Recibirás tus vouchers y el programa definitivo del viaje una vez estén todos los servicios confirmados.

`{{recordatorio_pasaportes}}`

`{{nota_halal}}`

`{{nota_accesibilidad}}`

---

Para cualquier consulta, responde a este correo o contáctanos por WhatsApp en el **+34 633 30 59 09**.

Un cordial saludo,

---

Vive al Ándalus  
BIN FIRNAS TRAVEL SL

Abdulah Jiménez Contreras  
Teléfono: 633 30 59 09  
Correo: reservas@vivealandalus.com  
Web: www.vivealandalus.com

Puede consultar nuestras condiciones generales, aviso legal y política de privacidad en www.vivealandalus.com.

---

## Versión inglés (EN)

**Subject:** Booking confirmed — Your Al-Andalus journey `{{id_reserva}}`

---

Dear `{{nombre_cliente}}`,

We have received your deposit and your booking is now confirmed. Vive al Ándalus will begin coordinating all services for your journey immediately.

**Your confirmed booking details:**

- **Reference:** `{{id_expediente}}`
- **Booking:** `{{id_reserva}}`
- **Arrival date:** `{{fecha_entrada}}`
- **Departure date:** `{{fecha_salida}}`
- **Duration:** `{{num_noches}}` nights
- **Travellers:** `{{num_pax}}`
- **Destinations:** `{{destinos}}`

---

**Payment status:**

| | |
|--|--|
| Deposit received (30%) | `{{deposito_recibido_eur}}` EUR ✓ |
| Remaining balance | `{{pendiente_eur}}` EUR |
| **Final payment due by** | **`{{fecha_limite_pago_completo}}`** |

Please transfer the remaining balance by bank transfer before the date shown above.

---

**What happens next?**

We have started coordinating all your travel services. You will receive your vouchers and final itinerary once all services have been confirmed.

`{{recordatorio_pasaportes}}`

`{{nota_halal}}`

`{{nota_accesibilidad}}`

---

For any questions, simply reply to this email or contact us via WhatsApp at **+34 633 30 59 09**.

Kind regards,

---

Vive al Ándalus  
BIN FIRNAS TRAVEL SL

Abdulah Jiménez Contreras  
Phone: 633 30 59 09  
Email: reservas@vivealandalus.com  
Web: www.vivealandalus.com

You can review our general terms, legal notice and privacy policy at www.vivealandalus.com.

---

## Versión francés (FR)

**Objet :** Réservation confirmée — Votre voyage en Al-Andalus `{{id_reserva}}`

---

Cher/Chère `{{nombre_cliente}}`,

Nous avons bien reçu votre acompte et votre réservation est désormais confirmée. Vive al Ándalus commence immédiatement la coordination de tous les services de votre voyage.

**Détails de votre réservation confirmée :**

- **Dossier :** `{{id_expediente}}`
- **Réservation :** `{{id_reserva}}`
- **Date d'arrivée :** `{{fecha_entrada}}`
- **Date de départ :** `{{fecha_salida}}`
- **Durée :** `{{num_noches}}` nuits
- **Voyageurs :** `{{num_pax}}`
- **Destinations :** `{{destinos}}`

---

**État du paiement :**

| | |
|--|--|
| Acompte reçu (30 %) | `{{deposito_recibido_eur}}` EUR ✓ |
| Solde restant | `{{pendiente_eur}}` EUR |
| **Date limite de paiement intégral** | **`{{fecha_limite_pago_completo}}`** |

Veuillez effectuer le virement du solde restant avant la date indiquée ci-dessus.

---

**Que se passe-t-il maintenant ?**

Nous commençons immédiatement la coordination de tous vos services de voyage. Vous recevrez vos vouchers et le programme définitif dès que tous les services auront été confirmés.

`{{recordatorio_pasaportes}}`

`{{nota_halal}}`

`{{nota_accesibilidad}}`

---

Pour toute question, répondez simplement à cet e-mail ou contactez-nous via WhatsApp au **+34 633 30 59 09**.

Cordialement,

---

Vive al Ándalus  
BIN FIRNAS TRAVEL SL

Abdulah Jiménez Contreras  
Téléphone : 633 30 59 09  
Courriel : reservas@vivealandalus.com  
Web : www.vivealandalus.com

Vous pouvez consulter nos conditions générales, mentions légales et politique de confidentialité sur www.vivealandalus.com.

---

## Versión portugués (PT)

**Assunto:** Reserva confirmada — A sua viagem à Al-Ândalus `{{id_reserva}}`

---

Caro/a `{{nombre_cliente}}`,

Recebemos o seu depósito e a sua reserva está agora confirmada. A Vive al Ándalus começa de imediato a coordenar todos os serviços da sua viagem.

**Detalhes da sua reserva confirmada:**

- **Processo:** `{{id_expediente}}`
- **Reserva:** `{{id_reserva}}`
- **Data de chegada:** `{{fecha_entrada}}`
- **Data de partida:** `{{fecha_salida}}`
- **Duração:** `{{num_noches}}` noites
- **Viajantes:** `{{num_pax}}`
- **Destinos:** `{{destinos}}`

---

**Estado do pagamento:**

| | |
|--|--|
| Depósito recebido (30 %) | `{{deposito_recibido_eur}}` EUR ✓ |
| Saldo em falta | `{{pendiente_eur}}` EUR |
| **Data limite para pagamento total** | **`{{fecha_limite_pago_completo}}`** |

Por favor, efetue a transferência do saldo restante antes da data indicada acima.

---

**O que acontece agora?**

Começámos imediatamente a coordenar todos os serviços da sua viagem. Receberá os seus vouchers e o programa definitivo assim que todos os serviços estiverem confirmados.

`{{recordatorio_pasaportes}}`

`{{nota_halal}}`

`{{nota_accesibilidad}}`

---

Para qualquer dúvida, responda a este e-mail ou contacte-nos via WhatsApp para o **+34 633 30 59 09**.

Com os melhores cumprimentos,

---

Vive al Ándalus  
BIN FIRNAS TRAVEL SL

Abdulah Jiménez Contreras  
Telefone: 633 30 59 09  
E-mail: reservas@vivealandalus.com  
Web: www.vivealandalus.com

Pode consultar as nossas condições gerais, aviso legal e política de privacidade em www.vivealandalus.com.

---

*Documento interno. No distribuir fuera de Bin Firnas Travel SL.*

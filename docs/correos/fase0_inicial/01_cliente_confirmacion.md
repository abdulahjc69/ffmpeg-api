# C01 — Confirmación de solicitud al cliente

**Código:** C01  
**Tipo:** Cliente externo  
**Trigger:** Solicitud recibida a través del wizard web  
**Envío:** Automático inmediato tras recepción del webhook  
**Idioma:** Idioma del cliente (`{{idioma_cliente}}`)  
**Desde:** reservas@vivealandalus.com  
**Para:** `{{email_cliente}}`  
**Asunto:** Tu solicitud de viaje a Al-Ándalus — Ref. `{{ref}}`

---

## Versión árabe (AR) — principal

**Asunto:** طلب رحلتك إلى الأندلس — Ref. `{{ref}}`

---

عزيزتي {{nombre_cliente}}،

شكراً لتواصلك مع **Vive al Ándalus**. لقد استلمنا طلبك بنجاح وسنبدأ في مراجعته فوراً.

**ملخص طلبك:**

- **رقم المرجع:** `{{ref}}`
- **المسافرون:** `{{adultos}}` بالغين و`{{menores}}` أطفال (المجموع: `{{total_viajeros}}` مسافرين)
- **تاريخ الوصول:** `{{fecha_inicio}}`
- **تاريخ المغادرة:** `{{fecha_fin}}`
- **المدة:** `{{duracion_noches}}` ليلة
- **المدن:** `{{ciudades_ruta}}`

سيتولى **`{{agente}}`** متابعة ملفك شخصياً وسيتواصل معك في أقرب وقت ممكن لتأكيد التفاصيل وتقديم العرض الأنسب لعائلتك.

إذا كان لديك أي سؤال أو تغيير، لا تتردد في التواصل معنا عبر هذا البريد الإلكتروني أو عبر الواتساب على الرقم: **+34 633 30 59 06**

نحن هنا لنجعل رحلتكم إلى الأندلس تجربة لا تُنسى.

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

**Asunto:** Tu solicitud de viaje a Al-Ándalus — Ref. `{{ref}}`

---

Estimada/o {{nombre_cliente}},

Gracias por ponerte en contacto con **Vive al Ándalus**. Hemos recibido tu solicitud correctamente y ya estamos trabajando en ella.

**Resumen de tu solicitud:**

- **Referencia:** `{{ref}}`
- **Viajeros:** `{{adultos}}` adultos y `{{menores}}` menores (total: `{{total_viajeros}}` viajeros)
- **Fecha de llegada:** `{{fecha_inicio}}`
- **Fecha de salida:** `{{fecha_fin}}`
- **Duración:** `{{duracion_noches}}` noches
- **Ciudades:** `{{ciudades_ruta}}`

**`{{agente}}`** se encargará personalmente de tu expediente y se pondrá en contacto contigo a la mayor brevedad para confirmar los detalles y enviarte la propuesta más adecuada para tu grupo.

Si tienes alguna duda o quieres hacer algún cambio, puedes responder a este correo o contactarnos por WhatsApp en el: **+34 633 30 59 06**

Estamos aquí para que tu viaje por Al-Ándalus sea una experiencia inolvidable.

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

**Subject:** Your travel request to Al-Andalus — Ref. `{{ref}}`

---

Dear {{nombre_cliente}},

Thank you for contacting **Vive al Ándalus**. We have successfully received your travel request and are already working on it.

**Summary of your request:**

- **Reference:** `{{ref}}`
- **Travellers:** `{{adultos}}` adults and `{{menores}}` children (total: `{{total_viajeros}}` travellers)
- **Arrival date:** `{{fecha_inicio}}`
- **Departure date:** `{{fecha_fin}}`
- **Duration:** `{{duracion_noches}}` nights
- **Cities:** `{{ciudades_ruta}}`

**`{{agente}}`** will personally handle your file and will be in touch as soon as possible to confirm the details and send you the most suitable proposal for your group.

If you have any questions or would like to make any changes, please reply to this email or contact us via WhatsApp at: **+34 633 30 59 06**

We look forward to making your journey through Al-Andalus an unforgettable experience.

Warm regards,

---

Vive al Ándalus  
BIN FIRNAS TRAVEL SL

Abdulah Jiménez Contreras  
Teléfono: 633 30 59 06  
Correo: reservas@vivealandalus.com  
Web: www.vivealandalus.com

You can review our general terms and conditions, legal notice, and privacy policy at www.vivealandalus.com.

---

## Versión francés (FR)

**Objet:** Votre demande de voyage en Al-Andalus — Réf. `{{ref}}`

---

Chère/Cher {{nombre_cliente}},

Merci de nous avoir contacté chez **Vive al Ándalus**. Nous avons bien reçu votre demande et nous travaillons déjà dessus.

**Résumé de votre demande:**

- **Référence:** `{{ref}}`
- **Voyageurs:** `{{adultos}}` adultes et `{{menores}}` enfants (total: `{{total_viajeros}}` voyageurs)
- **Date d'arrivée:** `{{fecha_inicio}}`
- **Date de départ:** `{{fecha_fin}}`
- **Durée:** `{{duracion_noches}}` nuits
- **Villes:** `{{ciudades_ruta}}`

**`{{agente}}`** s'occupera personnellement de votre dossier et vous contactera dans les meilleurs délais pour confirmer les détails et vous envoyer la proposition la plus adaptée à votre groupe.

Pour toute question ou modification, n'hésitez pas à répondre à cet e-mail ou à nous contacter via WhatsApp au: **+34 633 30 59 06**

Nous sommes là pour faire de votre voyage en Al-Andalus une expérience inoubliable.

Bien cordialement,

---

Vive al Ándalus  
BIN FIRNAS TRAVEL SL

Abdulah Jiménez Contreras  
Téléphone: 633 30 59 06  
E-mail: reservas@vivealandalus.com  
Web: www.vivealandalus.com

Vous pouvez consulter nos conditions générales, mentions légales et politique de confidentialité sur www.vivealandalus.com.

---

## Versión portugués (PT)

**Assunto:** O seu pedido de viagem para Al-Andalus — Ref. `{{ref}}`

---

Cara/Caro {{nombre_cliente}},

Obrigado por nos contactar na **Vive al Ándalus**. Recebemos o seu pedido com sucesso e já estamos a trabalhar nele.

**Resumo do seu pedido:**

- **Referência:** `{{ref}}`
- **Viajantes:** `{{adultos}}` adultos e `{{menores}}` crianças (total: `{{total_viajeros}}` viajantes)
- **Data de chegada:** `{{fecha_inicio}}`
- **Data de partida:** `{{fecha_fin}}`
- **Duração:** `{{duracion_noches}}` noites
- **Cidades:** `{{ciudades_ruta}}`

**`{{agente}}`** tratará pessoalmente do seu processo e entrará em contacto o mais brevemente possível para confirmar os detalhes e enviar-lhe a proposta mais adequada para o seu grupo.

Se tiver alguma dúvida ou quiser fazer alguma alteração, pode responder a este e-mail ou contactar-nos via WhatsApp para: **+34 633 30 59 06**

Estamos aqui para tornar a sua viagem pela Al-Andalus numa experiência inesquecível.

Com os melhores cumprimentos,

---

Vive al Ándalus  
BIN FIRNAS TRAVEL SL

Abdulah Jiménez Contreras  
Telefone: 633 30 59 06  
E-mail: reservas@vivealandalus.com  
Web: www.vivealandalus.com

Pode consultar os nossos termos e condições gerais, aviso legal e política de privacidade em www.vivealandalus.com.

---

## Notas operativas

- **Envío:** Automático. No requiere revisión de Abdu antes de enviar.
- **Idioma:** Usar la versión que corresponda a `{{idioma_cliente}}`.
- **Si el idioma no está disponible:** Usar versión EN como fallback.
- **Variables vacías:** Si `{{menores}}` = 0, suprimir la línea de menores en el resumen.
- **Nunca incluir:** precios, disponibilidad, confirmación de servicio ni datos internos.

# C05 — Correo post-viaje al cliente

**Código:** C05  
**Destinatario:** Cliente  
**Trigger:** Tras la finalización del viaje (fecha_fin + 2–5 días)  
**Envío:** Manual. Abdu decide el momento exacto.  
**Idioma:** Idioma del cliente (`idioma_envio_final`)  
**CC obligatorio:** `reservas@vivealandalus.com`

---

## Reglas específicas C05

- **Nunca automático.** Abdu envía cuando considera que el grupo ya está de regreso y asentado.
- **Plazo orientativo:** entre 2 y 5 días tras `fechas.fecha_fin`.
- **No incluir** datos internos: scoring, márgenes, incidencias, nombres de proveedores ni IDs internos.
- **El enlace de valoración es opcional** si VAA no tiene sistema de reseñas activo — omitir la línea si no aplica.
- **El descuento / próxima reserva es opcional** — incluir solo si Abdu decide activarlo para ese grupo.
- Si hay una incidencia grave no resuelta satisfactoriamente, Abdu debe gestionar esa comunicación por separado antes de enviar C05.

---

## Bloque de idioma

```
idioma_envio_final: "es" | "en" | "ar" | "fr" | "pt"
```

Usar el bloque correspondiente al idioma del cliente. Si el cliente se comunicó en un idioma distinto al registrado inicialmente, usar el idioma real de comunicación.

---

## Plantilla ES — Español

**Asunto:** Gracias por viajar con Vive al Ándalus — Expediente {{ref}}

---

Estimado/a {{nombre_cliente}},

Ha pasado ya un tiempo desde que concluisteis vuestro viaje por Al-Ándalus, y quería escribiros personalmente para agradeceros la confianza depositada en Vive al Ándalus.

Ha sido un placer acompañaros durante {{duracion_dias}} días por {{ciudades_ruta}}. Esperamos que el viaje haya superado vuestras expectativas y que los recuerdos de estas ciudades permanezcan con vosotros durante mucho tiempo.

Si tenéis cualquier comentario, observación o sugerencia sobre el servicio, estaré encantado de escucharla. Vuestra experiencia nos ayuda a mejorar y a seguir ofreciendo viajes a la altura de lo que merece Al-Ándalus.

[OPCIONAL — si hay sistema de valoración activo:]
Si queréis compartir vuestra experiencia, podéis dejarnos una valoración en {{enlace_valoracion}}. Cada reseña honesta nos ayuda enormemente.

[OPCIONAL — si Abdu activa descuento para próxima reserva:]
Como agradecimiento por haber viajado con nosotros, os ofrecemos un descuento especial del {{descuento_porcentaje}}% en vuestra próxima reserva. Válido hasta {{descuento_fecha_limite}}. Indicadlo al contactar.

Quedamos a vuestra disposición para cualquier consulta futura. Será un placer volver a diseñar juntos el próximo capítulo de vuestros viajes.

Un saludo,

---

Vive al Ándalus
BIN FIRNAS TRAVEL SL

Abdulah Jiménez Contreras
Teléfono: 633 30 59 06
Correo: reservas@vivealandalus.com
Web: www.vivealandalus.com

Puede consultar nuestras condiciones generales, aviso legal y política de privacidad en www.vivealandalus.com.

---

## Plantilla EN — English

**Subject:** Thank you for travelling with Vive al Ándalus — Booking {{ref}}

---

Dear {{nombre_cliente}},

Now that some time has passed since the end of your journey through Al-Andalus, I wanted to write to you personally to thank you for your trust in Vive al Ándalus.

It was a pleasure to accompany you during {{duracion_dias}} days through {{ciudades_ruta}}. We hope the trip exceeded your expectations and that the memories of these extraordinary cities will stay with you for a long time.

If you have any comments, observations or suggestions about the service, I would be very happy to hear them. Your experience helps us to improve and continue offering journeys that do justice to Al-Andalus.

[OPTIONAL — if review system is active:]
If you would like to share your experience, you can leave us a review at {{enlace_valoracion}}. Every honest review helps us enormously.

[OPTIONAL — if Abdu activates a discount for next booking:]
As a thank you for travelling with us, we would like to offer you a special discount of {{descuento_porcentaje}}% on your next booking. Valid until {{descuento_fecha_limite}}. Please mention this when you get in touch.

We remain at your disposal for any future enquiries. It would be a pleasure to design your next journey together.

Kind regards,

---

Vive al Ándalus
BIN FIRNAS TRAVEL SL

Abdulah Jiménez Contreras
Phone: 633 30 59 06
Email: reservas@vivealandalus.com
Web: www.vivealandalus.com

You can read our general terms, legal notice and privacy policy at www.vivealandalus.com.

---

## Plantilla AR — العربية

**الموضوع:** شكراً لسفركم مع Vive al Ándalus — الملف {{ref}}

---

عزيزي/عزيزتي {{nombre_cliente}}،

مضى بعض الوقت منذ انتهاء رحلتكم في أرض الأندلس، وأردت أن أكتب إليكم شخصياً لأشكركم على الثقة التي منحتموها لـ Vive al Ándalus.

كان من دواعي سروري مرافقتكم خلال {{duracion_dias}} يوماً في {{ciudades_ruta}}. نأمل أن تكون الرحلة قد فاقت توقعاتكم، وأن تبقى ذكريات هذه المدن الاستثنائية معكم طويلاً.

إذا كان لديكم أي تعليق أو ملاحظة أو اقتراح حول الخدمة المقدمة، فسيسعدني الاطلاع عليها. تجربتكم تساعدنا على التحسين والاستمرار في تقديم رحلات تليق بهذه الأرض العريقة.

[اختياري — في حال وجود نظام تقييم فعّال:]
إذا أردتم مشاركة تجربتكم، يمكنكم ترك تقييم على {{enlace_valoracion}}. كل رأي صادق يساعدنا كثيراً.

[اختياري — في حال تفعيل خصم للحجز القادم:]
شكراً لسفركم معنا، نقدم لكم خصماً خاصاً بنسبة {{descuento_porcentaje}}٪ على حجزكم القادم. ساري حتى {{descuento_fecha_limite}}. يُرجى الإشارة إليه عند التواصل معنا.

نبقى دائماً في خدمتكم لأي استفسار مستقبلي. سيكون من دواعي سرورنا تصميم رحلتكم القادمة معاً.

مع خالص التحيات،

---

Vive al Ándalus
BIN FIRNAS TRAVEL SL

Abdulah Jiménez Contreras
هاتف: 633 30 59 06
البريد: reservas@vivealandalus.com
الموقع: www.vivealandalus.com

يمكنكم الاطلاع على شروطنا العامة وإشعار قانوني وسياسة الخصوصية على www.vivealandalus.com.

---

## Plantilla FR — Français

**Objet:** Merci d'avoir voyagé avec Vive al Ándalus — Dossier {{ref}}

---

Cher/Chère {{nombre_cliente}},

Quelque temps s'est écoulé depuis la fin de votre voyage en Al-Andalus, et je souhaitais vous écrire personnellement pour vous remercier de la confiance que vous avez accordée à Vive al Ándalus.

Ce fut un plaisir de vous accompagner pendant {{duracion_dias}} jours à travers {{ciudades_ruta}}. Nous espérons que le voyage a dépassé vos attentes et que les souvenirs de ces villes extraordinaires vous accompagneront longtemps.

Si vous avez des commentaires, observations ou suggestions concernant le service, je serai ravi de les entendre. Votre expérience nous aide à nous améliorer et à continuer de proposer des voyages à la hauteur de ce que mérite Al-Andalus.

[FACULTATIF — si un système d'avis est actif :]
Si vous souhaitez partager votre expérience, vous pouvez nous laisser un avis sur {{enlace_valoracion}}. Chaque avis sincère nous aide énormément.

[FACULTATIF — si Abdu active une remise pour la prochaine réservation :]
En remerciement de votre voyage avec nous, nous vous offrons une remise spéciale de {{descuento_porcentaje}}% sur votre prochaine réservation. Valable jusqu'au {{descuento_fecha_limite}}. Merci de le mentionner lors de votre prochain contact.

Nous restons à votre disposition pour toute question future. Ce sera un plaisir de concevoir ensemble votre prochain voyage.

Cordialement,

---

Vive al Ándalus
BIN FIRNAS TRAVEL SL

Abdulah Jiménez Contreras
Téléphone : 633 30 59 06
E-mail : reservas@vivealandalus.com
Site web : www.vivealandalus.com

Vous pouvez consulter nos conditions générales, mentions légales et politique de confidentialité sur www.vivealandalus.com.

---

## Plantilla PT — Português

**Assunto:** Obrigado por viajar com a Vive al Ándalus — Expediente {{ref}}

---

Caro/a {{nombre_cliente}},

Já passou algum tempo desde o final da vossa viagem pela Al-Andalus, e quis escrever-vos pessoalmente para agradecer a confiança depositada na Vive al Ándalus.

Foi um prazer acompanhar-vos durante {{duracion_dias}} dias por {{ciudades_ruta}}. Esperamos que a viagem tenha superado as vossas expectativas e que as memórias destas cidades extraordinárias fiquem convosco por muito tempo.

Se tiverem algum comentário, observação ou sugestão sobre o serviço, ficaria muito satisfeito em ouvi-los. A vossa experiência ajuda-nos a melhorar e a continuar a oferecer viagens à altura do que Al-Andalus merece.

[OPCIONAL — se houver sistema de avaliação ativo:]
Se quiserem partilhar a vossa experiência, podem deixar-nos uma avaliação em {{enlace_valoracion}}. Cada opinião honesta ajuda-nos enormemente.

[OPCIONAL — se Abdu ativar um desconto para a próxima reserva:]
Como agradecimento por terem viajado connosco, oferecemos-vos um desconto especial de {{descuento_porcentaje}}% na vossa próxima reserva. Válido até {{descuento_fecha_limite}}. Por favor, mencionem-no quando entrarem em contacto.

Ficamos à vossa disposição para qualquer questão futura. Será um prazer desenhar juntos a próxima etapa das vossas viagens.

Com os melhores cumprimentos,

---

Vive al Ándalus
BIN FIRNAS TRAVEL SL

Abdulah Jiménez Contreras
Telefone: 633 30 59 06
E-mail: reservas@vivealandalus.com
Website: www.vivealandalus.com

Pode consultar as nossas condições gerais, aviso legal e política de privacidade em www.vivealandalus.com.

---

## Variables utilizadas en C05

| Variable | Fuente |
|----------|--------|
| `{{ref}}` | `expediente.referencia` |
| `{{nombre_cliente}}` | `cliente.nombre` |
| `{{duracion_dias}}` | `fechas.duracion_dias` |
| `{{ciudades_ruta}}` | `ruta.ciudades_orden` (join ", ") |
| `{{enlace_valoracion}}` | configuración interna VAA (opcional) |
| `{{descuento_porcentaje}}` | decisión de Abdu (opcional) |
| `{{descuento_fecha_limite}}` | decisión de Abdu (opcional) |

---

*Documento interno. No distribuir fuera de Bin Firnas Travel SL.*

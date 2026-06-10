# Auditoría Web ↔ Sistema Documental VAA — v1.0

**Empresa:** Bin Firnas Travel SL  
**Marca:** Vive al Ándalus  
**Versión:** 1.0  
**Fecha auditoría:** 2026-06-10  
**Responsable:** Abdulah Jiménez Contreras  
**Alcance:** `index.html` (única página web) ↔ sistema documental en `docs/`

---

## Resumen ejecutivo

La web de Vive al Ándalus y el sistema documental están bien alineados en los aspectos fundamentales: identidad corporativa, enfoque en Al-Ándalus, servicios ofertados, multiidioma y funcionalidad halal. Sin embargo, existen **5 brechas** que deben resolverse y **3 discrepancias menores** que conviene documentar.

---

## 1. Coherencia de identidad corporativa

| Elemento | En web (`index.html`) | En sistema documental | Estado |
|----------|----------------------|----------------------|--------|
| Razón social | Bin Firnas Travel SL | Bin Firnas Travel SL | ✅ Correcto |
| Marca | Vive al Ándalus | Vive al Ándalus | ✅ Correcto |
| CIF/VAT | ESB56080765 (structured data) | ESB56080765 | ✅ Correcto |
| Licencia CIAN | CIAN-147996-3 | CIAN-147996-3 | ✅ Correcto |
| Email operativo | `reservas@vivealandalus.com` | `reservas@vivealandalus.com` | ✅ Correcto |
| Web | `www.vivealandalus.com` | `www.vivealandalus.com` | ✅ Correcto |
| Dirección | C/ Teatro 19, bajo, Peñarroya-Pueblonuevo | C/ Teatro 19, bajo, Peñarroya-Pueblonuevo, Córdoba 14200 | ✅ Correcto |
| Teléfono visible | 633 30 59 09 | 633 30 59 09 | ✅ Correcto |
| Teléfono structured data | +34633305906 | +34 633 30 59 09 | ⚠️ Discrepancia menor (ver §4.1) |

---

## 2. Coherencia de servicios

| Servicio | En web | En sistema documental | Estado |
|---------|--------|----------------------|--------|
| Alojamiento (hotel) | ✅ Wizard captura categoría, régimen, hab. | `servicios.alojamiento` en expediente | ✅ Alineado |
| Transporte | ✅ Wizard captura tipo de vehículo | `servicios.transporte` en expediente | ✅ Alineado |
| Restauración halal | ✅ Wizard captura `halal.requerido`, días restaurante | `servicios.restauracion` + `halal` en expediente | ✅ Alineado |
| Guía local | ✅ Opción en wizard (`guia: si/no`) | `servicios.guia_local` en expediente | ✅ Alineado |
| Tour leader / Guía acompañante | ✅ Wizard captura `tour_lider` boolean | `servicios.tour_leader` en expediente + P05 | ✅ Alineado |
| Seguro | ✅ Opción en wizard (tipos de seguro) | No hay documento `seguro_v1` todavía | ⚠️ Brecha documental (ver §3.2) |
| Visitas y excursiones | Parcialmente: guías locales en web | No hay documento de excursiones/actividades | ⚠️ Brecha documental (ver §3.3) |

---

## 3. Brechas identificadas

### 3.1 — Ausencia de testimonios / reseñas en la web

**Hallazgo:** No existe ningún bloque de testimonios, reseñas ni valoraciones de clientes en `index.html`. Búsqueda exhaustiva de los términos `testimonio`, `reseña`, `review`, `opinion`, `valoraci` no arrojó ningún resultado en contenido visible al usuario.

**Impacto:** La web carece de prueba social, elemento crítico en turismo premium. Los grupos de viaje musulmán toman decisiones de confianza basadas en referencias de otros viajeros.

**Acción recomendada:**
- Añadir bloque de testimonios a `index.html` (requiere autorización explícita de Abdu).
- Definir proceso para capturar y publicar reseñas reales (vinculado a C05 — correo post-viaje).
- Considerar integración con Google Reviews o similar con moderación.

**Prioridad:** Alta.

---

### 3.2 — Seguro capturado en wizard sin proceso documental

**Hallazgo:** El wizard de `index.html` ofrece 5 opciones de seguro: `Seguro básico de viaje`, `Seguro de cancelación`, `Seguro médico de viaje`, `Seguro para grupos`, `Seguro a definir por el equipo`. El dato llega al expediente vía webhook como parte de `preferencias`. Sin embargo, no existe documento `seguro_v1` ni proceso definido para gestionar presupuestos y selección de seguros.

**Impacto:** El dato se captura pero no hay flujo operativo que lo gestione de forma sistemática. Abdu lo maneja ad-hoc.

**Acción recomendada:**
- Crear `docs/comercial/seguros_v1.md` con tipos de seguro, proveedores preferentes y proceso de cotización.
- Alternativamente, documentar como sub-sección dentro del expediente maestro.

**Prioridad:** Media.

---

### 3.3 — Visitas / excursiones sin documento operativo

**Hallazgo:** La web menciona guías locales y visitas a monumentos como parte del producto. El sistema documental tiene P04 (solicitud a guía local) pero no existe un documento de `programa_visitas_v1` o similar que registre qué monumentos se incluyen, con qué guía, en qué horario y con qué condiciones de reserva de entrada.

**Impacto:** Sin documento, la gestión de entradas (muchos monumentos de Al-Ándalus requieren reserva anticipada) y la asignación de guías queda fuera del sistema estructurado.

**Acción recomendada:**
- Crear `docs/operaciones/programa_visitas_v1.md` para gestionar el itinerario detallado por día y ciudad.

**Prioridad:** Media.

---

### 3.4 — Condiciones de pago y cancelación no visibles en web

**Hallazgo:** La web no menciona en ningún punto visible el esquema de pagos (30% al reservar, 100% antes del viaje) ni las condiciones de cancelación. Solo existe un enlace a `condiciones-generales.html` en el footer.

**Impacto:** Los clientes llegan al proceso de reserva sin expectativas alineadas sobre pagos. Esto puede generar fricción o abandono al recibir C03 con la solicitud del 30%.

**Acción recomendada:**
- Valorar añadir una sección de "¿Cómo funciona?" o "Proceso de reserva" en `index.html` que mencione brevemente el esquema de pagos.
- Esto también reduce la carga de explicación en C02 y C03.
- Requiere autorización explícita de Abdu antes de modificar web.

**Prioridad:** Media-Alta.

---

### 3.5 — C05 (post-viaje) sin mecanismo de captura de reseñas

**Hallazgo:** C05 tiene un bloque opcional `[OPCIONAL — si hay sistema de valoración activo]` con `{{enlace_valoracion}}`. Actualmente no existe dicho sistema ni una URL definida.

**Impacto:** El correo post-viaje puede enviarse sin el enlace de valoración, pero se pierde una oportunidad sistemática de capturar reseñas que alimenten la brecha 3.1.

**Acción recomendada:**
- Definir si se usará Google Reviews, Tripadvisor, formulario propio u otro sistema.
- Una vez definido, actualizar C05 con el enlace fijo o variable.

**Prioridad:** Media (vinculada a 3.1).

---

## 4. Discrepancias menores

### 4.1 — Teléfono en structured data vs. documentación

**Hallazgo:** El structured data JSON-LD en `index.html` declara `"telephone": "+34633305906"`. La documentación interna y el pie de correos usa `633 30 59 09` (sin prefijo internacional, con espacios).

**Impacto:** Ninguno operativo. Ambos referencian el mismo número. La versión con prefijo internacional (`+34633305906`) es correcta para structured data (formato E.164).

**Acción recomendada:** Mantener como está. Documentar que el formato canónico para uso externo es `+34 633 30 59 09` y para structured data `+34633305906`.

**Prioridad:** Baja (informativa).

---

### 4.2 — Idioma "árabe" en wizard vs. 5 idiomas del sistema

**Hallazgo:** El wizard captura `idioma` del cliente entre las opciones disponibles. El sistema documental soporta: ES, EN, AR, FR, PT. En la web, `idioma_comunicacion` del expediente puede recibir cualquier valor del wizard.

**Acción recomendada:** Verificar que los valores del wizard mapean exactamente a los 5 códigos de idioma del sistema. No se detectaron inconsistencias directas, pero conviene validación al implementar integración n8n.

**Prioridad:** Baja (preventiva).

---

### 4.3 — SUBMIT_MODE en 'preview' — correcto pero no debe cambiar

**Hallazgo:** `SUBMIT_MODE: 'preview'` en línea 4532 de `index.html`. El wizard NO envía datos al webhook en producción. Solo prepara el payload y lo muestra en consola.

**Estado:** Correcto intencionalmente. No modificar.

**Acción recomendada:** Este campo solo puede cambiarse a `'live'` con autorización explícita de Abdu cuando el sistema n8n esté completamente configurado y probado.

**Prioridad:** Informativa — sin acción.

---

## 5. Alineación del flujo web → expediente

| Campo que captura el wizard | Campo en expediente maestro | Estado |
|----------------------------|----------------------------|--------|
| adultos | `grupo.adultos` | ✅ |
| menores | `grupo.menores` | ✅ |
| halal (bool) | `halal.requerido` | ✅ |
| tour_leader / guía acomp. | `servicios.tour_leader` | ✅ |
| idioma | `cliente.idioma_comunicacion` | ✅ |
| ciudades seleccionadas | `ruta.ciudades_orden` | ✅ |
| servicios (hotel, transport, restaur.) | `servicios.*` | ✅ |
| seguro | `preferencias.seguro` (sin documento operativo) | ⚠️ |
| fecha_inicio / fecha_fin | `fechas.fecha_inicio/fin` | ✅ |
| email | `cliente.email` | ✅ |
| teléfono | `cliente.telefono_whatsapp` | ✅ |

---

## 6. Resumen de acciones prioritarias

| # | Acción | Prioridad | Requiere |
|---|--------|-----------|---------|
| A-01 | Añadir bloque de testimonios en `index.html` | Alta | Autorización Abdu + contenido real de clientes |
| A-02 | Añadir sección "Proceso de reserva / pagos" en `index.html` | Media-Alta | Autorización Abdu |
| A-03 | Definir sistema de reseñas (Google / Tripadvisor / propio) para enlazar en C05 | Media | Decisión Abdu |
| A-04 | Crear `docs/comercial/seguros_v1.md` | Media | Autorización Abdu |
| A-05 | Crear `docs/operaciones/programa_visitas_v1.md` | Media | Autorización Abdu |
| A-06 | Validar mapeo wizard → expediente al implementar n8n | Baja | Fase n8n |

---

*Documento interno. No distribuir fuera de Bin Firnas Travel SL.*

# ESTRUCTURA NOTION DEFINITIVA — VIVE AL ÁNDALUS
## Bases de datos · Propiedades · Relaciones

---

## ARQUITECTURA GENERAL

```
SISTEMA CENTRAL VAA
│
├── 📩 SOLICITUDES DE PRESUPUESTO      ← Leads de la web / manual
│        │
│        ├── relacionada con → CONTACTOS CRM
│        └── relacionada con → EXPEDIENTES
│
├── 📋 EXPEDIENTES                     ← Una fila por viaje vendido/en curso
│        │
│        ├── relacionada con → CONTACTOS CRM
│        ├── relacionada con → SOLICITUDES
│        ├── relacionada con → COTIZACIONES
│        └── relacionada con → DOCUMENTOS
│
├── 🏨 PROVEEDORES                     ← Hoteles, transporte, guías, restaurantes
│
├── 💼 RED COMERCIAL                   ← Colaboradores, prescriptores, agencias
│
├── 💰 COTIZACIONES                    ← Una fila por propuesta económica enviada
│
└── 👥 CONTACTOS CRM                   ← Personas físicas (clientes y responsables)
```

---

## BASE 1 — SOLICITUDES DE PRESUPUESTO

> Destino: recibir y clasificar leads antes de abrir expediente formal.

| Propiedad | Tipo Notion | Obligatoria | Notas |
|---|---|---|---|
| Solicitud (título) | Title | ✅ | Auto-generada: "SOL-001 · [Nombre]" |
| Ref | Auto-increment ID | ✅ | Automático |
| Recibida | Created time | ✅ | Automático |
| Estado | Select | ✅ | Nueva / Contactada / En cotización / Propuesta enviada / Ganada / Perdida |
| Origen | Select | ✅ | Web / WhatsApp / Email / Teléfono / Referido |
| Nombre contacto | Text | ✅ | Nombre del responsable |
| Email | Email | ✅ | |
| Teléfono | Phone | ✅ | |
| Idioma cliente | Select | ✅ | Español / Árabe / Inglés / Francés / Portugués |
| Organización | Text | — | Si viene de una asociación o empresa |
| Nº viajeros | Number | ✅ | |
| Ciudades | Multi-select | ✅ | Madrid / Toledo / Córdoba / Sevilla / Granada / Otro |
| Fechas aproximadas | Text | — | "septiembre 2026" / "flexible" |
| Halal requerido | Checkbox | ✅ | |
| Guía árabe | Checkbox | — | |
| Transporte incluido | Checkbox | — | |
| Alojamiento incluido | Checkbox | — | |
| Tour líder | Checkbox | — | |
| Nivel | Select | — | Esencial / Premium / Lujo |
| Mensaje del cliente | Text (long) | — | Texto libre del formulario web |
| Selección explorador (JSON) | Text (long) | — | Payload del formulario web |
| Es prueba | Checkbox | — | Para filtrar tests |
| Contacto CRM | Relation | — | → Base CONTACTOS CRM |
| Expediente creado | Relation | — | → Base EXPEDIENTES |

---

## BASE 2 — EXPEDIENTES

> Destino: gestión completa de cada viaje desde lead hasta cierre.

| Propiedad | Tipo Notion | Obligatoria | Notas |
|---|---|---|---|
| Código expediente (título) | Title | ✅ | Formato: VAA-2026-NNNN |
| Estado | Select | ✅ | Lead / Presupuestado / Confirmado / En operación / Cerrado / Cancelado |
| Estado comercial | Select | ✅ | Nuevo / Contactado / Propuesta enviada / Negociación / Ganado / Perdido |
| Prioridad | Select | ✅ | Alta / Media / Baja |
| Responsable VAA | Select | ✅ | Abdu / Hermano / Sistema |
| Fecha apertura | Date | ✅ | |
| Fecha límite propuesta | Date | ✅ | 7 días desde primer contacto |
| Fecha salida | Date | ✅ cuando confirmado | |
| Fecha regreso | Date | ✅ cuando confirmado | |
| Cliente (nombre) | Text | ✅ | |
| Organización | Text | — | |
| País origen | Select | — | España / Arabia Saudí / EAU / Marruecos / Otro |
| Idioma principal | Select | ✅ | Español / Árabe / Inglés / Francés / Portugués |
| Canal preferido | Select | — | WhatsApp / Email / Teléfono |
| Nº viajeros | Number | ✅ | |
| Nº menores | Number | — | |
| Necesidades alimentarias | Multi-select | ✅ | Halal / Vegetariano / Sin gluten / Sin restricciones |
| Movilidad reducida | Checkbox | — | |
| Tipo viaje | Select | — | Circuito / Ruta / Grupo / A medida / Educativo |
| Nivel | Select | — | Esencial / Premium / Lujo |
| Ruta | Text | ✅ | "Madrid-Toledo-Córdoba-Sevilla-Granada" |
| Origen lead | Select | — | Web / WhatsApp / Email / Asociación / Agencia / Referido |
| **Precio total cliente (€)** | **Number** | **✅** | **Importe acordado con el cliente** |
| **Coste total proveedores (€)** | **Number** | **✅** | **Suma de todos los costes** |
| **Margen neto (€)** | **Formula** | **Auto** | **= Precio cliente − Coste proveedores** |
| **Margen %** | **Formula** | **Auto** | **= Margen / Precio × 100** |
| **Pago 30% — fecha** | **Date** | **—** | **Cuándo se recibió la señal** |
| **Pago 30% — importe** | **Number** | **—** | **Importe real recibido** |
| **Pago 70% — fecha** | **Date** | **—** | **Cuándo se recibió el resto** |
| **Pago 70% — importe** | **Number** | **—** | **Importe real recibido** |
| Observaciones | Text (long) | — | Notas operativas internas |
| Contacto CRM | Relation | — | → Base CONTACTOS CRM |
| Solicitud origen | Relation | — | → Base SOLICITUDES |
| Cotizaciones | Relation | — | → Base COTIZACIONES |
| Documentos | Relation | — | → Base DOCUMENTOS |

---

## BASE 3 — PROVEEDORES

> Destino: cartera de proveedores activos y en evaluación.

| Propiedad | Tipo Notion | Obligatoria | Notas |
|---|---|---|---|
| Nombre (título) | Title | ✅ | Nombre comercial |
| Tipo | Select | ✅ | Hotel / Transporte / Guía / Restaurante / Seguro / Entrada / Actividad / Otro |
| Estado | Select | ✅ | Prospecto / Contactado / En negociación / Activo / Preferente / En observación / Bloqueado |
| Ciudad (ciudades) | Multi-select | ✅ | Madrid / Toledo / Córdoba / Sevilla / Granada / Málaga / Ronda / Otro |
| País | Select | ✅ | España / Marruecos / Portugal / Otro |
| Contacto nombre | Text | ✅ | Persona de referencia |
| Teléfono | Phone | ✅ | |
| WhatsApp | Phone | — | |
| Email principal | Email | ✅ | |
| Email reservas | Email | — | Si diferente al principal |
| Halal | Select | ✅ | Certificado / Verificado VAA / Declarado / Apto parcial / No apto / Sin evaluar |
| **Tarifa referencia grupo 25 pax (€)** | **Number** | **✅ si Activo** | **Precio orientativo** |
| Capacidad máxima grupo | Number | ✅ | |
| Prioridad | Select | — | Alta / Media / Baja |
| Categoría (hoteles) | Select | — | 2* / 3* / 4* / 5* |
| Recomendado 55 pax | Checkbox | — | Para grupos grandes |
| Recomendado por Abdu | Checkbox | — | Sello personal de confianza |
| Verificado comercialmente | Checkbox | — | Ha prestado servicio real a VAA |
| Web | URL | — | |
| Fuente | URL / Text | — | Cómo se encontró |
| Notas operativas | Text (long) | — | Lo importante antes de contratar |
| Última revisión | Date | — | Cuando se actualizó la tarifa |

---

## BASE 4 — RED COMERCIAL

> Destino: colaboradores, prescriptores, agencias y asociaciones.

| Propiedad | Tipo Notion | Obligatoria | Notas |
|---|---|---|---|
| Nombre (título) | Title | ✅ | Nombre del contacto |
| Tipo | Select | ✅ | Prescriptor / Colaborador formal / Agencia B2B / Asociación / Comunidad / Empresa / Universidad |
| Estado | Select | ✅ | Nuevo / Contactado / Interesado / Activo sin acuerdo / Colaborador activo / En pausa / Descartado |
| Organización | Text | ✅ | |
| Ciudad | Select | — | |
| País | Select | — | |
| Email | Email | ✅ | |
| WhatsApp | Phone | ✅ | |
| Último contacto | Date | ✅ | |
| Próximo seguimiento | Date | ✅ si activo | Alerta para no olvidar |
| Potencial grupos/año | Number | — | Estimación |
| **Comisión acordada (%)** | **Number** | **✅ si Colaborador** | **% sobre precio final cliente** |
| Grupos referidos | Number | — | Cuántos grupos ha mandado |
| Ingresos generados (€) | Number | — | Total facturado por sus referencias |
| Primer contacto | Date | — | Cuándo se inició la relación |
| Canal de relación | Select | — | WhatsApp / Email / Teléfono / Referido |
| Notas | Text (long) | — | Contexto, intereses, cómo llegamos |

---

## BASE 5 — COTIZACIONES

> Destino: una fila por propuesta económica enviada a un cliente.

| Propiedad | Tipo Notion | Obligatoria | Notas |
|---|---|---|---|
| Referencia (título) | Title | ✅ | Formato: VAA-2026-NNNN-V1 |
| Expediente | Relation | ✅ | → Base EXPEDIENTES |
| Estado | Select | ✅ | Borrador / Enviada / Aceptada / Rechazada / Caducada / Sustituida |
| Fecha creación | Date | ✅ | |
| Fecha envío | Date | — | |
| Fecha validez | Date | ✅ | 7 días desde envío |
| Precio total (€) | Number | ✅ | Lo que paga el cliente |
| Precio por persona (€) | Number | ✅ | |
| Nº viajeros | Number | ✅ | |
| Coste interno (€) | Number | ✅ | Solo visible en VAA |
| Margen (€) | Formula | Auto | Precio − Coste |
| Margen (%) | Formula | Auto | |
| Versión | Number | ✅ | 1, 2, 3... |
| Notas | Text (long) | — | Cambios respecto a versión anterior |

---

## BASE 6 — CONTACTOS CRM

> Destino: personas físicas responsables de grupos o clientes individuales.

| Propiedad | Tipo Notion | Obligatoria | Notas |
|---|---|---|---|
| Nombre completo (título) | Title | ✅ | |
| Email | Email | ✅ | |
| WhatsApp | Phone | ✅ | |
| Teléfono | Phone | — | |
| Idioma preferido | Select | ✅ | Español / Árabe / Inglés / Francés |
| País | Select | — | |
| Organización | Text | — | |
| Tipo relación | Select | — | Cliente / Responsable grupo / Colaborador / Prescriptor |
| Fecha primer contacto | Date | — | |
| Viajes realizados | Number | — | Cuántos viajes ha hecho con VAA |
| Valoración VAA | Select | — | Excelente / Buena / Normal / Incidencia |
| Solicitudes | Relation | — | → Base SOLICITUDES |
| Expedientes | Relation | — | → Base EXPEDIENTES |
| Notas | Text (long) | — | |

---

## RELACIONES ENTRE BASES

```
CONTACTO CRM ←→ SOLICITUDES
CONTACTO CRM ←→ EXPEDIENTES
SOLICITUD    ←→ EXPEDIENTE (1:1 normalmente)
EXPEDIENTE   ←→ COTIZACIONES (1:N — varias versiones)
EXPEDIENTE   ←→ DOCUMENTOS (contratos, rooming lists)
RED COMERCIAL ←→ EXPEDIENTES (quién refirió este lead)
```

---

## VISTAS MÍNIMAS RECOMENDADAS POR BASE

### SOLICITUDES
- **Kanban por Estado** — columnas: Nueva / Cotizando / Propuesta enviada / Ganada / Perdida
- **Tabla completa** — para búsqueda y filtros

### EXPEDIENTES
- **Kanban por Estado comercial**
- **Tabla con columnas: Expediente / Cliente / Viajeros / Precio / Margen / Estado / Próxima acción**
- **Filtro "Confirmados"** — solo los que tienen 30% cobrado

### PROVEEDORES
- **Tabla por Tipo** (filtro: Hotel / Guía / Transporte / Restaurante)
- **Tabla filtro "Activos"** — para usar en cotizaciones

### RED COMERCIAL
- **Tabla por Estado** — identificar quién necesita seguimiento hoy
- **Ordenar por "Próximo seguimiento"** ascendente — el de arriba = llamar hoy

---

*Documento de arquitectura operativa · Vive al Ándalus · Bin Firnas Travel SL*
*Versión 1.0 · Junio 2026 · Para implementación inmediata en Notion*

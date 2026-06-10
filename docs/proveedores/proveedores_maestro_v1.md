# Proveedores Maestro VAA — v1.0

**Empresa:** Bin Firnas Travel SL  
**Marca:** Vive al Ándalus  
**Versión:** 1.0  
**Fecha creación:** 2026-06-10  
**Responsable:** Abdulah Jiménez Contreras  
**Documento paralelo:** `proveedores_maestro_v1.json`

---

## Finalidad

El Maestro de Proveedores es el registro central y permanente de todas las empresas, profesionales y colaboradores con los que Vive al Ándalus trabaja, ha trabajado, o podría trabajar en el futuro.

Un proveedor existe como entidad independiente. No pertenece a ningún expediente. Su ficha, historial, clasificación y puntuación son propios y permanentes.

---

## Filosofía de uso

### El proveedor vive más que cualquier expediente

Un hotel, un transportista o un guía local son entidades que existen antes y después de cualquier viaje concreto. Su ficha recoge todo el conocimiento acumulado sobre ellos: cómo responden, qué calidad ofrecen, cómo negocian, qué incidencias han tenido, cuánto cobran históricamente.

### Proveedores descubiertos sin contrato previo

Un proveedor puede registrarse aunque nunca haya trabajado con VAA. Si Abdu encuentra un hotel interesante en internet, puede crearlo con estado `en_evaluacion`. Eso es suficiente para empezar a construir la cartera.

### Separación estricta proveedor ↔ expediente

El Expediente Maestro solo guarda una referencia al proveedor (su ID). Nunca duplica los datos completos. Si el nombre del hotel cambia, cambia en un solo lugar.

### Preparado para crecer

La versión 1.0 incluye la estructura base más los campos necesarios para que las fases futuras (scoring, incidencias, negociaciones, histórico de precios) puedan integrarse sin refactorizar.

---

## Tipos de proveedor

| Código | Tipo | Descripción |
|--------|------|-------------|
| `hotel` | Hotel | Alojamiento turístico |
| `transporte` | Transporte | Flota de vehículos con conductor |
| `restaurante` | Restaurante | Servicio de restauración |
| `guia_local` | Guía local | Guía oficial de ciudad o monumento |
| `tour_leader` | Tour leader | Acompañante de ruta completa |
| `seguro` | Seguros | Pólizas de viaje |
| `entrada` | Entradas / Monumentos | Alhambra, Alcázar, Mezquita, etc. |
| `actividad` | Actividad / Experiencia | Talleres, flamenco, excursiones, catas |
| `fotografo` | Fotografía / Vídeo | Reportajes y memorias de viaje |
| `otro` | Otro | Genérico con descripción obligatoria |

---

## Estados del proveedor

| Estado | Descripción |
|--------|-------------|
| `en_evaluacion` | Primera vez. Sin historial real con VAA. Puede cotizarse con precaución. |
| `activo` | Disponible para cotizar y contratar. Relación establecida. |
| `pausado` | Temporalmente fuera de rotación. Sin motivo crítico. |
| `en_observacion` | Ha tenido incidencias. Se mantiene disponible pero bajo vigilancia. |
| `bloqueado` | No contratar bajo ningún concepto. Motivo obligatoriamente documentado. |
| `inactivo` | Cerrado, ilocalizalbe o retirado del mercado. |

### Reglas de transición de estado

- `en_evaluacion` → `activo`: tras completar al menos 1 servicio sin incidencias.
- Cualquier estado → `en_observacion`: al registrar una incidencia de gravedad alta o crítica.
- Cualquier estado → `bloqueado`: incidencia crítica documentada o decisión expresa de Abdu.
- `bloqueado` → ningún otro estado sin autorización expresa de Abdu.

---

## Clasificación halal

| Código | Nivel | Descripción |
|--------|-------|-------------|
| `halal_certificado` | Certificado oficial | Certificación emitida por organismo reconocido (CIHI, Halal España, etc.) |
| `halal_verificado` | Verificado sin certificar | Verificado por VAA en persona. Sin certificado formal. |
| `halal_declarado` | Declarado | El proveedor declara ser halal. Sin verificación externa. |
| `apto_parcial` | Apto parcialmente | Tiene opciones halal pero requiere acuerdo previo para menú cerrado. |
| `no_apto` | No apto | No cumple requisitos mínimos halal. |
| `pendiente` | Sin evaluar | No ha sido evaluado todavía. |

**Regla operativa crítica:** Un proveedor con nivel `no_apto` no puede ser seleccionado para ningún expediente con `halal.requerido = true`. Un proveedor con nivel `pendiente` requiere verificación antes de cualquier confirmación de servicio.

**Regla de certificación halal:** `verificado_por_vaa = true` es independiente de `tiene_certificacion = true`. Un proveedor puede estar verificado por VAA sin tener certificado formal. Ambos campos deben registrarse por separado.

---

## Clasificación de idiomas

| Código | Nivel | Descripción operativa |
|--------|-------|-----------------------|
| `nativo` | Nativo | Lengua materna. Máxima confianza. |
| `profesional` | Profesional | Dominio completo para guía turística, negociación y gestión de incidencias. |
| `fluido` | Fluido | Comunicación eficaz en todos los contextos del viaje. |
| `funcional` | Funcional | Gestiona situaciones estándar. Dificultades en emergencias. |
| `basico` | Básico | Comunicación simple. Insuficiente para guía o gestión de grupo. |
| `no` | No habla | Sin conocimiento funcional. |

**Requisito mínimo crítico para guías y tour leaders:**
- Si `tipo = tour_leader` o `tipo = guia_local` y no existe idioma árabe con nivel `funcional` o superior → el proveedor **no es válido** para expedientes VAA. Este filtro es innegociable.

---

## Niveles estratégicos

| Nivel | Código | Criterios de asignación |
|-------|--------|------------------------|
| Proveedor prioritario | `prioritario` | scoring ≥ 8.5 + ≥3 expedientes completados + sin incidencias críticas + halal verificado + decisión de Abdu |
| Proveedor habitual | `habitual` | scoring 7.0–8.4 + ≥1 expediente completado + sin incidencias críticas |
| Proveedor secundario | `secundario` | scoring 5.0–6.9 o sin expedientes completados todavía |
| En evaluación | `en_evaluacion` | Alta reciente, sin historial real con VAA |
| En observación | `en_observacion` | ≥1 incidencia alta o ≥2 medias en últimos 12 meses |
| Bloqueado | `bloqueado` | Incidencia crítica o decisión expresa de Abdu. Permanente. |

---

## Definición completa de campos

### Bloque `_meta`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `id_interno` | string | ✅ | Identificador único. Formato: `PRV-AAAA-NNNN` |
| `fecha_alta` | date | ✅ | Fecha de creación de la ficha |
| `fecha_actualizacion` | date | ✅ | Última modificación |
| `creado_por` | string | ✅ | Quién creó la ficha |
| `activo` | bool | ✅ | Si la ficha está operativa |
| `version` | string | ✅ | Versión del esquema |

### Bloque `identificacion`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `nombre_comercial` | string | ✅ | Nombre por el que se le conoce operativamente |
| `razon_social` | string | ❌ | Razón social legal |
| `nif_cif` | string | ❌ | NIF/CIF para facturación |
| `tipo` | enum | ✅ | Ver tabla de tipos |
| `subtipo` | string | ❌ | Descripción libre. Ej: "hotel boutique", "autocar 55 pax" |
| `descripcion` | string | ❌ | Descripción libre del proveedor |

### Bloque `contacto`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `nombre_contacto` | string | ✅ | Persona de referencia principal |
| `cargo` | string | ❌ | Cargo de la persona de contacto |
| `email_principal` | string | ✅ | Email principal. Usado para solicitudes y contratos. |
| `email_secundario` | string | ❌ | Email alternativo |
| `telefono` | string | ✅ | Teléfono principal |
| `whatsapp` | string | ❌ | WhatsApp si disponible |
| `idioma_comunicacion` | enum | ✅ | Idioma preferido para comunicaciones. [es, en, ar, fr, pt] |
| `zona_horaria` | string | ❌ | Zona horaria si es proveedor fuera de España |

### Bloque `ubicacion`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `ciudad` | string | ✅ | Ciudad principal de operación |
| `ciudades_cobertura` | array | ❌ | Ciudades donde opera (para transportistas y tour leaders) |
| `provincia` | string | ❌ | Provincia |
| `pais` | string | ✅ | País. Default: "España" |
| `direccion` | string | ❌ | Dirección completa |
| `coordenadas` | object | ❌ | `{lat, lng}` para mapas futuros |

### Bloque `clasificacion`

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| `estado` | enum | ✅ | Estado actual del proveedor |
| `nivel_estrategico` | enum | ✅ | Clasificación estratégica de VAA |
| `halal` | object | ✅ | Clasificación halal completa |
| `idiomas` | array | ✅ | Lista de idiomas con nivel |
| `etiquetas` | array | ❌ | Tags libres: ["grupo_golf", "temporada_alta", "favorito_abdu"] |

### Bloque `datos_especificos`

Datos propios del tipo de proveedor. Ver ejemplos en JSON.

### Bloque `referencias_futuras`

Campos preparados para fases v1.1+. En v1.0 contienen arrays vacíos o null.

| Campo | Uso futuro |
|-------|------------|
| `ids_presupuestos` | IDs de todos los presupuestos recibidos de este proveedor |
| `ids_expedientes_asignado` | IDs de expedientes donde fue seleccionado |
| `scoring_resumen` | Puntuación global (calculada en v1.1) |
| `num_incidencias` | Contador de incidencias (detalle en v1.1) |
| `num_negociaciones` | Contador de negociaciones (detalle en v1.1) |

---

## Ejemplos reales

### Ejemplo 1: Hotel en Sevilla (recién descubierto por internet)

```json
{
  "_meta": { "id_interno": "PRV-2026-0001", "tipo": "hotel", "estado": "en_evaluacion" },
  "identificacion": { "nombre_comercial": "Hotel Los Seises", "tipo": "hotel" },
  "ubicacion": { "ciudad": "Sevilla", "pais": "España" },
  "clasificacion": {
    "estado": "en_evaluacion",
    "nivel_estrategico": "en_evaluacion",
    "halal": { "nivel": "pendiente", "verificado_por_vaa": false }
  }
}
```

### Ejemplo 2: Transportista ya trabajado

```json
{
  "_meta": { "id_interno": "PRV-2026-0003", "tipo": "transporte", "estado": "activo" },
  "identificacion": { "nombre_comercial": "Viajes Alhambra SL", "tipo": "transporte" },
  "clasificacion": {
    "estado": "activo",
    "nivel_estrategico": "habitual",
    "halal": { "nivel": "apto_parcial", "verificado_por_vaa": true },
    "idiomas": [{ "idioma": "es", "nivel": "nativo" }, { "idioma": "ar", "nivel": "funcional" }]
  }
}
```

---

## Riesgos detectados

| Riesgo | Impacto | Mitigación |
|--------|---------|-----------|
| Proveedores duplicados | Medio | Validar email_principal + nombre_comercial antes de alta |
| Halal marcado como certificado sin documento | Crítico | Campo `verificado_por_vaa` separado. Nunca asumir. |
| Nivel estratégico asignado sin datos reales | Medio | Scoring bloqueado hasta tener evidencias. Asignación inicial = `en_evaluacion`. |
| Proveedor bloqueado sin motivo documentado | Medio | Campo `motivo_bloqueo` obligatorio si `estado = bloqueado`. |

---

## Recomendaciones para v1.1

1. **Añadir bloque `incidencias`**: Array de incidencias propias del proveedor con gravedad, tipo y resolución.
2. **Añadir bloque `scoring`**: Objeto con las 8 dimensiones de puntuación y fórmula calculada.
3. **Añadir bloque `negociaciones`**: Historial de rondas de negociación con aprendizajes.
4. **Añadir bloque `historico_precios`**: Referencias a presupuestos con métricas de variación temporal.
5. **Índice de deduplicación**: Implementar validación automática por `email_principal` antes de alta.

---

*Documento interno. No distribuir fuera de Bin Firnas Travel SL.*

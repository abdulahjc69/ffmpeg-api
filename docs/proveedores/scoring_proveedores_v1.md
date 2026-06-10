# Scoring de Proveedores VAA — v1.0

**Empresa:** Bin Firnas Travel SL  
**Marca:** Vive al Ándalus  
**Versión:** 1.0  
**Fecha creación:** 2026-06-10  
**Responsable:** Abdulah Jiménez Contreras  
**Documento paralelo:** `scoring_proveedores_v1.json`

---

## Finalidad

El scoring de proveedores es el sistema de puntuación que permite a VAA comparar, seleccionar y gestionar proveedores con criterios objetivos y auditables. No sustituye el juicio de Abdu — lo informa.

Un proveedor con scoring alto no está seleccionado automáticamente. Un proveedor con scoring bajo no está descartado automáticamente. El scoring es una herramienta de soporte a la decisión, nunca un automatismo.

**El scoring nunca se comunica al proveedor ni al cliente. Es dato estrictamente interno.**

---

## Principios fundamentales

### El scoring se calcula, no se escribe

El `score_total` es un campo calculado a partir de las puntuaciones de las 6 dimensiones y los ajustes por incidencias. **No puede editarse manualmente como valor global.** Solo se puede editar cada dimensión individualmente, y el total se recalcula.

### El scoring es provisional sin datos suficientes

Un proveedor recién dado de alta o con menos de 2 servicios reales tiene `estado_evaluacion = provisional`. Las decisiones críticas no deben basarse en scoring provisional.

### El scoring halal es independiente

El cumplimiento halal tiene su propio sistema de puntuación separado (`score_halal`), además de estar representado como dimensión dentro del scoring general. Un proveedor puede tener scoring general alto y score halal bajo — y eso es información crítica para VAA.

### El historial es inmutable

Cada evaluación queda registrada en `historial_evaluaciones`. No se borran entradas pasadas. El historial permite ver la evolución del proveedor a lo largo del tiempo.

### Abdu siempre decide

El scoring recomienda. Abdu decide. La decisión final de seleccionar o descartar un proveedor es siempre humana y queda documentada en `proveedores_seleccionados_v1`.

---

## Las 6 dimensiones del scoring general

El scoring general se calcula sobre **100 puntos totales** distribuidos en 6 dimensiones:

| # | Dimensión | Peso | Descripción |
|---|-----------|:----:|-------------|
| 1 | `rapidez_respuesta` | 15 pts | Tiempo de respuesta a solicitudes, cotizaciones y confirmaciones |
| 2 | `calidad_respuesta` | 20 pts | Precisión, claridad y utilidad de las respuestas. Documentación correcta. |
| 3 | `cumplimiento` | 25 pts | Cumple lo confirmado: fechas, servicios, condiciones acordadas |
| 4 | `halal` | 20 pts | Cumplimiento de requisitos halal en el servicio prestado |
| 5 | `idiomas` | 10 pts | Capacidad de comunicación en idiomas relevantes para los clientes VAA |
| 6 | `precio_competitividad` | 10 pts | Precio competitivo en relación a la calidad y el mercado |

**Total máximo: 100 puntos**

### Descripción detallada de cada dimensión

#### 1. `rapidez_respuesta` (15 pts)

| Puntos | Criterio |
|--------|---------|
| 13–15 | Responde en < 4h en horario laboral. Confirmaciones el mismo día. |
| 9–12 | Responde en < 24h. Confirmaciones en 1–2 días. |
| 5–8 | Responde en 1–3 días. Ocasionalmente hay que insistir. |
| 1–4 | Tarda > 3 días. Requiere múltiples seguimientos. |
| 0 | No responde o desaparece regularmente. |

#### 2. `calidad_respuesta` (20 pts)

| Puntos | Criterio |
|--------|---------|
| 17–20 | Respuestas completas, sin errores. Documentación siempre correcta. Anticipa necesidades. |
| 13–16 | Respuestas correctas. Documentación correcta en general. Errores puntuales menores. |
| 8–12 | Respuestas básicas. Documentación a veces incompleta o con errores. |
| 3–7 | Respuestas superficiales. Documentación frecuentemente incorrecta. |
| 0–2 | Respuestas inutilizables o documentación sistemáticamente errónea. |

#### 3. `cumplimiento` (25 pts)

| Puntos | Criterio |
|--------|---------|
| 22–25 | Cumple siempre lo confirmado. Sin sorpresas en servicio. |
| 17–21 | Cumple en general. Desviaciones menores y puntuales. |
| 11–16 | Algún incumplimiento relevante documentado. |
| 5–10 | Incumplimientos recurrentes. Requiere supervisión activa. |
| 0–4 | Incumplimientos graves o sistemáticos. |

#### 4. `halal` (20 pts)

| Puntos | Criterio |
|--------|---------|
| 18–20 | Cumplimiento halal impecable. Certificación vigente. Sin incidencias. |
| 13–17 | Cumplimiento halal bueno. Certificación o buenas prácticas documentadas. |
| 8–12 | Cumplimiento halal básico. Sin certificación formal pero sin incidencias. |
| 3–7 | Cumplimiento halal dudoso. Requiere verificación en cada servicio. |
| 0–2 | Incumplimiento halal documentado. No apto para grupos VAA con requisito halal. |

**Nota:** Esta dimensión evalúa el cumplimiento observado. El `score_halal` separado evalúa la certificación y estructura formal halal del proveedor.

#### 5. `idiomas` (10 pts)

| Puntos | Criterio |
|--------|---------|
| 9–10 | Comunica con fluidez en árabe o en el idioma principal de los clientes VAA. |
| 6–8 | Inglés fluido. Algo de árabe o francés. Comunicación sin fricciones. |
| 3–5 | Solo español. Puede ser suficiente para proveedores locales. |
| 0–2 | Barreras de comunicación que afectan a la operativa. |

#### 6. `precio_competitividad` (10 pts)

| Puntos | Criterio |
|--------|---------|
| 9–10 | Precio por debajo o en línea con el mercado para su categoría de calidad. |
| 6–8 | Precio ligeramente superior pero justificado por calidad o especialización. |
| 3–5 | Precio superior a la media. Requiere negociación. |
| 0–2 | Precio muy elevado o con prácticas de cobro inconsistentes. |

---

## Fórmula de cálculo

```
subtotal_base = rapidez_respuesta + calidad_respuesta + cumplimiento
              + halal + idiomas + precio_competitividad

ajuste_incidencias = Σ descuentos por incidencias cerradas

score_total = MAX(0, subtotal_base + ajuste_incidencias)
```

El `score_total` **nunca puede ser negativo**. El mínimo absoluto es 0.

---

## Scoring total — niveles de clasificación

| Puntuación | Nivel | Significado operativo |
|-----------|-------|-----------------------|
| 85–100 | ⭐⭐⭐⭐⭐ Excelente | Proveedor preferente. Primera opción para expedientes compatibles. |
| 70–84 | ⭐⭐⭐⭐ Bueno | Proveedor fiable. Segunda opción o alternativa sólida. |
| 55–69 | ⭐⭐⭐ Aceptable | Usar con supervisión activa. No para grupos grandes o VIP. |
| 40–54 | ⭐⭐ Deficiente | Usar solo si no hay alternativa. Abdu debe decidir explícitamente. |
| 0–39 | ⭐ Crítico | Revisar continuidad. Candidato a `en_observacion` o `bloqueado`. |

---

## Scoring halal (independiente — apoyo)

Para proveedores que operan en contextos halal, se aplica un scoring halal separado sobre **50 puntos**. Complementa la dimensión `halal` del scoring general con una evaluación estructural más profunda:

| Sub-dimensión | Peso | Descripción |
|--------------|:----:|-------------|
| `certificacion_documentada` | 20 pts | Dispone de certificado halal vigente y verificable |
| `ausencia_alcohol` | 15 pts | No sirve alcohol en mesa ni buffet cuando hay clientes VAA |
| `trazabilidad_ingredientes` | 10 pts | Puede acreditar origen halal de carnes y productos |
| `formacion_personal` | 5 pts | Personal formado en protocolo halal |

**Total halal máximo: 50 puntos**

| Puntuación halal | Nivel |
|-----------------|-------|
| 45–50 | Halal certificado y fiable |
| 35–44 | Halal aceptable con verificación |
| 20–34 | Halal dudoso — verificar en cada servicio |
| 0–19 | No apto para grupos VAA con requisito halal |

---

## Ajuste por incidencias

Las incidencias cerradas en `incidencias_proveedores_v1` generan descuentos sobre el `score_total`:

| Gravedad | Sin compensación | Con compensación |
|----------|:----------------:|:----------------:|
| `baja` | −2 pts | −1 pt |
| `media` | −5 pts | −2.5 pts |
| `alta` | −10 pts | −5 pts |
| `critica` | −20 pts | −10 pts |

**Regla especial `incumplimiento_halal`:** Cualquier incidencia de tipo `incumplimiento_halal` descuenta adicionalmente **−10 pts del score_halal**, independientemente de la gravedad y sin reducción por compensación. Este descuento es permanente.

**Cuándo se aplica el descuento:** Al cerrar la incidencia (estado `resuelta` o `cerrada_sin_resolucion`). Una incidencia `abierta` o `en_gestion` no genera descuento todavía.

---

## Estado de la evaluación

| Estado | Descripción |
|--------|-------------|
| `provisional` | Evaluación inicial sin servicio real. Menos de 2 mediciones. Scoring orientativo. |
| `activo` | Evaluación con al menos 2 servicios reales documentados. Scoring operativo. |
| `en_revision` | Scoring bajo revisión activa por incidencia reciente o cambio de condiciones. |

**Campo `datos_insuficientes`:** Si alguna dimensión no puede evaluarse por falta de datos (proveedor nuevo, servicio no prestado aún), se marca como `null` y el campo `datos_insuficientes = true` en el scoring del proveedor. El scoring provisional no debe usarse para decisiones críticas.

---

## Proceso de evaluación

| Momento | Acción |
|---------|--------|
| Alta del proveedor | Evaluación inicial provisional. `num_mediciones = 0`. |
| Tras primer servicio | Primera evaluación real. `num_mediciones = 1`. |
| Tras cada servicio posterior | Actualización incremental. `num_mediciones += 1`. |
| Tras incidencia cerrada | Ajuste inmediato por descuento. Registrar en `ajustes_por_incidencias[]`. |
| Revisión periódica | Abdu revisa proveedores con `score_total < 55` cada 6 meses. |

---

## Relación con otros documentos

| Documento | Relación |
|-----------|---------|
| `proveedores_maestro_v1` | El scoring se almacena en la ficha del proveedor. El `nivel_estrategico` refleja cualitativamente el scoring. |
| `incidencias_proveedores_v1` | Cada incidencia cerrada puede generar ajuste de scoring. El `id_incidencia` se referencia en `ajustes_por_incidencias[]`. |
| `presupuestos_proveedores_v1` | El scoring se considera al comparar presupuestos de proveedores equivalentes. |
| `proveedores_seleccionados_v1` | Al seleccionar proveedor para un expediente, el scoring es uno de los criterios. |
| `propuesta_comercial_v1` | El scoring **no aparece** en la propuesta. Dato interno. |
| `reserva_comercial_v1` | El scoring **no aparece** en la reserva. Dato interno. |

---

## Riesgos específicos

| Riesgo | Mitigación |
|--------|-----------|
| Scoring no actualizado tras incidencia cerrada | Al cerrar INC, verificar si procede ajuste. Referencia `id_incidencia` en el ajuste. |
| `score_total` editado manualmente sin recalcular | El campo `score_total` es calculado. Editar solo dimensiones individuales. |
| Scoring provisional usado para decisión crítica | Campo `datos_insuficientes` y `estado_evaluacion = provisional` alertan. |
| Scoring halal desactualizado si caduca certificación | Verificar `fecha_caducidad_certificado` anualmente. |
| Filtración del scoring al proveedor o cliente | `_interno: true` en raíz. Nunca en correos ni documentos externos. |

---

*Documento interno. No distribuir fuera de Bin Firnas Travel SL.*

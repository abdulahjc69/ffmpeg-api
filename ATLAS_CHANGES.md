# Vive al Ándalus — Atlas Andalusí en el mapa (4 jun 2026)

Backup versionado del trabajo. El archivo de producción se sube a mano a Hostinger
(cPanel → File Manager → reemplazar index.html). MD5 entregado: 4dafcce9a01ee4b8f502fa0aefcd87fb

## Qué cambió en index.html
- Nueva capa "Atlas Andalusí" sobre el mapa Leaflet: enclaves + monumentos reales de Notion,
  con coordenadas reales, clustering (Leaflet.markercluster), zoom por jerarquía al-Idrisi
  (nivel 1 medinas / 2 fortalezas / 3 enclaves / monumentos al máximo zoom), filtro por época,
  leyenda y popups honestos (nombre árabe, gancho, qué conserva, autenticidad).
- Las 8 ciudades reservables y el configurador/lead quedan INTACTOS (capa puramente aditiva).
- Híbrido: snapshot incrustado (window.ATLAS_FALLBACK = atlas_snapshot.json, 26 enclaves + 24
  monumentos) + fetch en vivo que lo sobreescribe con las ~300 fichas.

## Endpoint de datos (n8n)
- Workflow: "VAA · Atlas Andalusí · Datos del mapa (JSON)" (id VCmcIPWnyTf5iu5k, ACTIVO)
- URL: https://n8n-production-3cc5.up.railway.app/webhook/vivealandalus-atlas
- Lee bases Notion: Enclaves (ae759a52...) + Monumentos (427b5d32...), normaliza y responde JSON con CORS.

## PENDIENTE MANUAL (1 vez)
Compartir las bases del Atlas (o la página madre "Al-Ándalus Experience") con la integración
Notion "n8n Vive Andalucía". Hasta hacerlo, el endpoint da 404 y el mapa usa solo el snapshot.

## Validación
Parser (vm.Script) + ejecución en DOM simulado (incl. lang=ar): 0 errores; 50 popups OK.

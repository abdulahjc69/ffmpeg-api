FROM node:18-slim

# ── Sistema + FFmpeg + fuentes para drawtext ───────────────────────────────
# fonts-dejavu-core y fontconfig son obligatorios para que el filtro
# drawtext de FFmpeg pueda renderizar texto en los clips de vídeo.
# Sin ellos, cada clip falla o sale sin texto en pantalla.
RUN apt-get update && apt-get install -y \
    ffmpeg \
    fonts-dejavu-core \
    fontconfig \
    && fc-cache -fv \
    && rm -rf /var/lib/apt/lists/*

# ── Directorio de trabajo ──────────────────────────────────────────────────
WORKDIR /app

# ── Dependencias Node (package.json) ──────────────────────────────────────
# Copia package.json primero para aprovechar cache de capas Docker
COPY package*.json ./
RUN npm install --omit=dev

# ── Código fuente ──────────────────────────────────────────────────────────
COPY . .

# ── Puerto Railway ─────────────────────────────────────────────────────────
# Railway inyecta PORT=8080 en tiempo de ejecución.
# index.js lo lee con: process.env.PORT || 3000
ENV PORT=8080
EXPOSE 8080

# ── Arranque ───────────────────────────────────────────────────────────────
# npm start → ejecuta "node index.js" (definido en package.json scripts.start)
CMD ["npm", "start"]

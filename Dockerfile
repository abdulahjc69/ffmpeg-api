FROM node:18-slim

# ── Sistema base + FFmpeg + fuentes para drawtext ──────────────────────────
RUN apt-get update && apt-get install -y \
    ffmpeg \
    fonts-dejavu-core \
    fontconfig \
    && fc-cache -fv \
    && rm -rf /var/lib/apt/lists/*

# ── Directorio de trabajo ───────────────────────────────────────────────────
WORKDIR /app

# ── Dependencias Node ───────────────────────────────────────────────────────
COPY package*.json ./
RUN npm install --omit=dev

# ── Código fuente ───────────────────────────────────────────────────────────
COPY . .

# ── Puerto Railway ──────────────────────────────────────────────────────────
ENV PORT=8080
EXPOSE 8080

# ── Arranque ────────────────────────────────────────────────────────────────
CMD ["npm", "start"]

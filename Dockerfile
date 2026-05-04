FROM node:18-slim

# Instalar ffmpeg
RUN apt-get update && apt-get install -y ffmpeg && rm -rf /var/lib/apt/lists/*

# Crear carpeta app
WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar resto del código
COPY . .

# Puerto Railway
ENV PORT=8080
EXPOSE 8080

# Arrancar servidor
CMD ["npm", "start"]

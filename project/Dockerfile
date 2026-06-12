# ==========================================
# Etapa 1: Compilación del Frontend (React)
# ==========================================
FROM node:20 AS frontend-builder
WORKDIR /app/frontend

# Copiar archivos de dependencias
COPY frontend/package*.json ./
RUN npm install

# Copiar el código fuente del frontend y compilar
COPY frontend/ ./
RUN npm run build

# ==========================================
# Etapa 2: Servidor Backend y Ejecución
# ==========================================
# Se utiliza node:20-slim (Debian) en lugar de Alpine para garantizar compatibilidad
# con el módulo nativo sqlite3 y evitar fallos de segmentación (SIGSEGV).
FROM node:20-slim AS runner
WORKDIR /app

# Crear directorio de datos para persistencia de SQLite
RUN mkdir -p /data

# Copiar dependencias del backend e instalar
# En Debian, node-pre-gyp descarga e instala el binario precompilado de sqlite3 sin compilar
COPY backend/package*.json ./backend/
RUN cd backend && npm install --only=production

# Copiar código fuente del backend
COPY backend/ ./backend/

# Copiar la build del frontend a la carpeta pública del backend
COPY --from=frontend-builder /app/frontend/dist ./backend/public

# Variables de entorno por defecto
ENV PORT=3000
ENV DATABASE_PATH=/data/grimorio.db
ENV NODE_ENV=production

EXPOSE 3000

# Comando para iniciar la aplicación
CMD ["node", "backend/server.js"]

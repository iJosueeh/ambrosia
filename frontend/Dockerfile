# Etapa de construcción
FROM node:20-alpine AS build

# Establece el directorio de trabajo
WORKDIR /app/frontend

# Copia los archivos package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código fuente del frontend
COPY . .

# Construye la aplicación React
RUN npm run build

# Etapa de servicio
FROM nginx:alpine

# Copia los archivos de configuración de Nginx (crearemos este archivo luego)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos estáticos construidos desde la etapa de construcción
COPY --from=build /app/frontend/dist /usr/share/nginx/html

# Expone el puerto que Nginx usará para servir la aplicación
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
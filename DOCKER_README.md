# 🚀 Guía de Instalación con Docker

Esta guía te ayudará a levantar el proyecto Ambrosia usando Docker.

## 📋 Prerrequisitos

- [Docker](https://www.docker.com/get-started) instalado
- [Docker Compose](https://docs.docker.com/compose/install/) instalado
- Git

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/iJosueeh/ambrosia.git
cd ambrosia
```

### 2. Configurar variables de entorno ⚠️ OBLIGATORIO

**IMPORTANTE:** Debes crear el archivo `.env` con las credenciales de la base de datos.

```bash
# En Windows (PowerShell)
Copy-Item .env.example .env

# En Linux/Mac
cp .env.example .env
```

El archivo `.env` contiene las credenciales de Supabase y otras configuraciones necesarias. **Sin este archivo, Docker no podrá levantar el proyecto.**

### 3. Levantar los servicios

```bash
docker-compose up -d
```

Este comando:
- 🏗️ Compilará el backend (Java/Spring Boot)
- 🏗️ Compilará el frontend (React/Vite)
- 🚀 Levantará ambos servicios

### 4. Acceder a la aplicación

- **Frontend**: http://localhost:80
- **Backend API**: http://localhost:8080/api/v1

## 📝 Comandos Útiles

### Ver logs de los servicios

```bash
# Ver todos los logs
docker-compose logs -f

# Ver logs solo del backend
docker-compose logs -f backend

# Ver logs solo del frontend
docker-compose logs -f frontend
```

### Detener los servicios

```bash
docker-compose down
```

### Reconstruir las imágenes (después de cambios en el código)

```bash
docker-compose up -d --build
```

### Limpiar todo (contenedores, imágenes, volúmenes)

```bash
docker-compose down -v
docker system prune -a
```

## 🔧 Solución de Problemas

### El backend no se conecta a la base de datos

Verifica que las credenciales de Supabase en el archivo `.env` o `docker-compose.yml` sean correctas.

### El frontend no puede comunicarse con el backend

Asegúrate de que ambos servicios estén corriendo:

```bash
docker-compose ps
```

### Errores de compilación en el backend

```bash
# Reconstruir solo el backend
docker-compose up -d --build backend
```

### Errores de compilación en el frontend

```bash
# Reconstruir solo el frontend
docker-compose up -d --build frontend
```

## 📚 Estructura del Proyecto

```
ambrosia/
├── backend/              # API Spring Boot
│   ├── Dockerfile
│   └── src/
├── frontend/             # React + Vite
│   ├── Dockerfile
│   ├── nginx.conf
│   └── src/
├── docker-compose.yml    # Configuración de Docker Compose
└── .env.example         # Variables de entorno de ejemplo
```

## 🎯 Credenciales por Defecto

### Admin
- **Email**: admin@ambrosia.com
- **Password**: admin123

## 💡 Notas Importantes

- El backend se compila automáticamente dentro del contenedor Docker
- El frontend se construye para producción y se sirve con Nginx
- Los cambios en el código requieren reconstruir las imágenes (`docker-compose up -d --build`)
- Para desarrollo local sin Docker, consulta el README principal del proyecto

## 🆘 Ayuda

Si tienes problemas, revisa los logs con `docker-compose logs -f` o contacta al equipo de desarrollo.

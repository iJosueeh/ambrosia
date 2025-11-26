# Ambrosia Backend - Arquitectura Hexagonal

Backend del proyecto Ambrosia construido con **Spring Boot 3.x** y **arquitectura hexagonal**.

## 🏗️ Arquitectura

Este proyecto sigue los principios de **Arquitectura Hexagonal** (también conocida como Ports & Adapters), que proporciona:

- ✅ **Separación clara de responsabilidades**
- ✅ **Independencia de frameworks**
- ✅ **Alta testabilidad**
- ✅ **Flexibilidad para cambios**
- ✅ **Escalabilidad**

### Estructura del Proyecto

```
com.ambrosia.ambrosia/
├── application/
│   ├── port/
│   │   ├── in/          # Casos de Uso (26 interfaces + 12 commands)
│   │   └── out/         # Puertos de Salida (5 interfaces)
│   └── service/         # Implementaciones de Casos de Uso (18 services)
│
├── domain/
│   ├── model/           # Entidades de Dominio
│   └── repository/      # Puertos de Repositorio
│
└── infrastructure/
    ├── adapter/
    │   ├── in/web/      # Adaptadores de Entrada (Controllers + DTOs)
    │   └── out/         # Adaptadores de Salida
    │       ├── persistence/   # Adaptadores JPA
    │       ├── security/      # Adaptadores de Seguridad
    │       ├── storage/       # Adaptadores de Almacenamiento
    │       ├── export/        # Adaptadores de Exportación
    │       └── notification/  # Adaptadores de Notificación
    ├── config/          # Configuración de Spring
    └── util/            # Utilidades de Infraestructura
```

## 📦 Capas de la Arquitectura

### 1. **Application Layer** (Capa de Aplicación)

Contiene la lógica de aplicación y los casos de uso del sistema.

#### Casos de Uso (Ports In)
Define las operaciones que la aplicación ofrece:

- **Usuario**: Registrar, Actualizar, Obtener, Listar, Eliminar
- **Autenticación**: Autenticar usuario
- **Recursos**: Crear, Listar, Obtener
- **Foros**: Crear, Listar
- **Comentarios**: Crear, Listar
- **Profesionales**: Registrar, Obtener
- **Tests**: Listar, Guardar resultados
- **Administración**: Obtener analíticas

#### Puertos de Salida (Ports Out)
Define las dependencias externas:

- `EmailServicePort`: Envío de emails
- `FileStoragePort`: Almacenamiento de archivos
- `ExportServicePort`: Exportación de datos
- `TokenGeneratorPort`: Generación de tokens JWT
- `PasswordEncoderPort`: Encriptación de contraseñas

#### Services
Implementan los casos de uso y contienen la lógica de negocio.

### 2. **Domain Layer** (Capa de Dominio)

Contiene las entidades de negocio y las reglas de dominio.

#### Entidades
- Usuario, Profesional, Rol
- Recurso, CategoriaRecurso
- Foro, Comentario, CategoriaForo
- TestEvaluacion, Pregunta, ResultadoTest
- Y más...

#### Repository Ports
Interfaces que definen las operaciones de persistencia sin depender de la implementación.

### 3. **Infrastructure Layer** (Capa de Infraestructura)

Contiene los detalles de implementación y frameworks.

#### Adaptadores de Entrada (In)
- **Controllers**: Endpoints REST
- **DTOs**: Objetos de transferencia de datos

#### Adaptadores de Salida (Out)
- **Persistence**: Implementaciones JPA de repositorios
- **Security**: JWT Token Generator, Password Encoder
- **Storage**: Almacenamiento local de archivos
- **Export**: Exportación a Excel/PDF
- **Notification**: Servicio de emails

#### Configuración
- Security, JWT, CORS, etc.

## 🚀 Tecnologías

- **Java 21**
- **Spring Boot 3.x**
- **Spring Security** (JWT Authentication)
- **Spring Data JPA**
- **H2 Database** (desarrollo)
- **PostgreSQL** (producción)
- **Lombok**
- **Bean Validation**
- **Maven**

## 📋 Requisitos

- Java 21 o superior
- Maven 3.8+
- PostgreSQL (para producción)

## ⚙️ Configuración

### Variables de Entorno

Crear un archivo `application.properties` o `application.yml`:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/ambrosia
spring.datasource.username=your_username
spring.datasource.password=your_password

# JWT
jwt.secret=your_secret_key_here
jwt.expiration.ms=86400000

# File Upload
file.upload-dir=uploads
```

## 🏃 Ejecución

### Desarrollo

```bash
# Compilar
./mvnw clean compile

# Ejecutar tests
./mvnw test

# Ejecutar aplicación
./mvnw spring-boot:run
```

### Producción

```bash
# Construir JAR
./mvnw clean package

# Ejecutar JAR
java -jar target/ambrosia-0.0.1-SNAPSHOT.jar
```

### Docker

```bash
# Construir imagen
docker build -t ambrosia-backend .

# Ejecutar contenedor
docker run -p 8080:8080 ambrosia-backend
```

## 🧪 Testing

El proyecto incluye:

- **Tests Unitarios**: Para casos de uso y lógica de negocio
- **Tests de Integración**: Para endpoints y flujos completos
- **Tests de Arquitectura**: Validación de la estructura hexagonal

```bash
# Ejecutar todos los tests
./mvnw test

# Ejecutar solo tests de integración
./mvnw test -Dtest=*IntegrationTest
```

## 📚 Documentación de API

La API REST está documentada con Swagger/OpenAPI.

Una vez iniciada la aplicación, acceder a:
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## 🔐 Seguridad

- **Autenticación**: JWT (JSON Web Tokens)
- **Autorización**: Role-based (USER, PROFESSIONAL, ADMIN)
- **Encriptación**: BCrypt para contraseñas
- **CORS**: Configurado para frontend

## 📊 Casos de Uso Principales

### Autenticación
```java
POST /api/auth/login
{
  "correo": "user@example.com",
  "contrasena": "password"
}
```

### Recursos
```java
GET /api/recursos
POST /api/recursos
GET /api/recursos/{id}
```

### Foros
```java
GET /api/foros
POST /api/foros
GET /api/foros/{id}/comentarios
```

## 🎯 Beneficios de la Arquitectura Hexagonal

1. **Testabilidad**: Fácil crear tests unitarios sin dependencias externas
2. **Flexibilidad**: Cambiar implementaciones sin afectar la lógica de negocio
3. **Mantenibilidad**: Código bien organizado y fácil de entender
4. **Escalabilidad**: Estructura clara para crecer el equipo y el proyecto
5. **Independencia**: El dominio no depende de frameworks

## 🔄 Flujo de una Petición

```
1. Controller (Infrastructure/In)
   ↓
2. Use Case (Application/Port/In)
   ↓
3. Service (Application/Service)
   ↓
4. Domain Model (Domain/Model)
   ↓
5. Repository Port (Domain/Repository)
   ↓
6. Repository Adapter (Infrastructure/Out)
   ↓
7. Database
```

## 📝 Validación

Los Commands incluyen validación con Bean Validation:

```java
@Value
public class RegistrarUsuarioCommand {
    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 100)
    String nombre;
    
    @NotBlank @Email
    String email;
    
    @NotBlank @Size(min = 6)
    String password;
}
```

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Equipo

Desarrollado por el equipo de Ambrosia.

---

**Versión**: 1.0.0  
**Última actualización**: 2025-11-26

# Ambrosia

## Descripción del Proyecto

Ambrosia es una aplicación web completa (full-stack) diseñada para ayudar a personas con problemas de trastornos alimenticios. Combina un robusto backend desarrollado con Spring Boot y un frontend interactivo construido con React y TypeScript, ofreciendo una experiencia de usuario moderna y eficiente.

## Características

    *   Autenticación de usuarios (registro, inicio de sesión).
    *   Gestión de perfiles de usuario.
    *   Cuestionarios interactivos (como el `AssessmentQuiz`).
    *   Visualización de recursos y artículos.
    *   Panel de administración (si aplica).
    *   Integración con bases de datos para persistencia de datos.

## Tecnologías Utilizadas

### Backend (Spring Boot)

*   **Java**: Lenguaje de programación principal.
*   **Spring Boot**: Framework para el desarrollo rápido de aplicaciones Java.
*   **Maven**: Herramienta de gestión de proyectos y dependencias.
*   **Spring Data JPA**: Para la interacción con la base de datos.
*   **Spring Security**: Para la autenticación y autorización.

### Frontend (React con TypeScript)

*   **React**: Librería para construir interfaces de usuario.
*   **TypeScript**: Superset de JavaScript que añade tipado estático.
*   **Vite**: Herramienta de construcción rápida para proyectos frontend.
*   **Tailwind CSS**: Framework CSS para un diseño rápido y responsivo.
*   **Framer Motion**: Librería para animaciones y transiciones.
*   **Lucide React**: Colección de iconos.

## Configuración e Instalación

Sigue estos pasos para configurar y ejecutar el proyecto en tu máquina local.

### Prerrequisitos

Asegúrate de tener instalado lo siguiente:

*   **Java Development Kit (JDK)** (versión 17 o superior)
*   **Maven** (versión 3.x o superior)
*   **Node.js** (versión 18.x o superior)
*   **npm** o **Yarn** (npm es el recomendado)
*   **PostgreSQL** (versión 15 o superior)

### Backend

1.  **Clona el repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/ambrosia.git
    cd ambrosia/backend
    ```
2.  **Configura la base de datos:**
    *   Ejemplo para `src/main/resources/application.properties`:
        ```properties
        spring.datasource.url=jdbc:postgresql://localhost:5432/ambrosia_db
        spring.datasource.username=root
        spring.datasource.password=your_password
        spring.jpa.hibernate.ddl-auto=update
        spring.jpa.show-sql=true
        ```
3.  **Construye el proyecto:**
    ```bash
    mvn clean install
    ```

### Frontend

1.  **Navega al directorio del frontend:**
    ```bash
    cd ../frontend
    ```
2.  **Instala las dependencias:**
    ```bash
    npm install
    # o yarn install
    ```
3.  **Configura las variables de entorno:**
    *   Crea un archivo `.env` en el directorio `frontend/` si es necesario.
    *   Ejemplo para `.env`:
        ```
        VITE_API_BASE_URL=http://localhost:8080/api
        ```

## Ejecución de la Aplicación

### Backend

1.  **Desde el directorio `backend/`:**
    ```bash
    mvn spring-boot:run
    ```
    El backend se ejecutará en `http://localhost:8080` (o el puerto configurado).

### Frontend

1.  **Desde el directorio `frontend/`:**
    ```bash
    npm run dev
    # o yarn dev
    ```
    El frontend se ejecutará en `http://localhost:5173` (o el puerto configurado por Vite).

## Estructura del Proyecto

```
.
├── .git/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/ambrosia/ambrosia/
│   │   │   │   ├── AmbrosiaApplication.java
│   │   │   │   ├── controllers/
│   │   │   │   ├── models/
│   │   │   │   ├── repository/
│   │   │   │   ├── services/
│   │   │   │   └── utils/
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       ├── static/
│   │   │       └── templates/
│   │   └── test/
│   ├── pom.xml
│   └── ...
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   │   └── Ambrosia_Logo2.png
│   │   ├── context/
│   │   ├── modules/
│   │   │   ├── admin/
│   │   │   ├── auth/
│   │   │   ├── community/
│   │   │   ├── home/
│   │   │   └── resources/
│   │   │       ├── components/
│   │   │       │   └── AssessmentQuiz.tsx
│   │   │       ├── pages/
│   │   │       └── services/
│   │   ├── routes/
│   │   │   └── AppRoutes.tsx
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── utils/
│   │   ├── styles/
│   │   │   └── main.css
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── ...
├── package.json (root)
└── README.md
```

## Contribución

Si deseas contribuir a este proyecto, por favor, sigue estos pasos:

1.  **Fork el repositorio**
2.  **Crea una rama para tu contribución**
3.  **Realiza los cambios necesarios**
4.  **Abre un Pull Request**

## Licencia

MIT License

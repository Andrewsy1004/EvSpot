# 🎉 EVSpot

**EVSpot** es una plataforma integral para la reserva y gestión de salones de eventos, diseñada para conectar a administradores y usuarios en un entorno eficiente, accesible y colaborativo.

---

## ✨ **Características principales**

- 🛠️ **Gestión de salones**: Configuración de horarios, precios y características específicas de cada espacio.
- 🔍 **Exploración optimizada**: Los usuarios pueden buscar salones, realizar reservas de manera sencilla y compartir reseñas.
- 📋 **Panel personal**: Consulta de reservas anteriores y futuras en un entorno intuitivo.
- 📱 **Diseño responsivo**: Acceso desde cualquier dispositivo, ya sea computadora, tableta o smartphone.
- 🤝 **Confianza y colaboración**: Enfocado en crear una comunidad transparente y confiable.

---

## 🛠️ **Tecnologías utilizadas**

### 🎨 **Frontend**
- ⚛️ **React**: Construcción de una interfaz dinámica y modular.
- 💨 **Tailwind CSS**: Diseño rápido, atractivo y responsivo.
- 🌐 **Zustand**: Gestión del estado global de la aplicación.

### ⚙️ **Backend**
- 🟢 **Node.js**: Lógica del servidor con un enfoque escalable.
- 🚀 **Express.js**: API REST eficiente para conectar frontend y backend.
- 🐘 **PostgreSQL**: Base de datos relacional para un manejo robusto de datos.
- 🐳 **Docker**: Contenedor para la gestión de la base de datos y simplificación del entorno de desarrollo.

---

## 📦 **Instalación y configuración**

### 🔧 **Requisitos previos**
- [📥 Node.js](https://nodejs.org/) instalado.
- [🐳 Docker](https://www.docker.com/) instalado.
- 🗝️ Clave de conexión a la base de datos (configurada en `.env`).

### 📜 **Pasos para instalar**
1. Clonar el repositorio

3. Ejecutar servidor
```
    cd Backend
    docker compose up -d
    npm install
    npm run start
```

4. Clonar el archivo ```.env.template``` y renombar la copia a ```
.env```

5. Llenar las variables de entorno definidas en el ```.env```

6. Ejecutar CLiente 
```
   Cd Frontend
   npm install
   npm run dev
```

7. Abrir en el navegador
```
   Hacer uso del link que te muestra la terminal
   http://localhost:5173/
```






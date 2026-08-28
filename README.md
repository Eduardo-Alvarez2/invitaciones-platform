#  Invitto - Plataforma SaaS de Invitaciones Digitales

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue?logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-Backend-lightgrey?logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/React-Frontend-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Mercado Pago](https://img.shields.io/badge/Mercado_Pago-API-009EE3?logo=mercadopago&logoColor=white)](https://www.mercadopago.com.ar/)

**Invitto** es una aplicación web Full-Stack moderna (SaaS) diseñada para la creación, personalización y gestión integral de invitaciones digitales para eventos. Permite a los usuarios diseñar tarjetas interactivas, gestionar confirmaciones de asistencia (RSVP) en tiempo real y activar funciones premium mediante pasarela de pagos automatizada.

---

##  Características Principales

* **Autenticación Segura:** Sistema de usuarios con Flask-JWT-Extended (Access y Refresh tokens).
* **Pasarela de Pagos (Mercado Pago):** Integración con preferencias de pago y webhooks automáticos para activar cuentas/tarjetas de manera instantánea tras la aprobación.
* **Gestión de Invitados (RSVP Web):** Formularios interactivos para que los invitados confirmen asistencia, cantidad de acompañantes y dejen mensajes personalizados.
* **Panel de Control (Dashboard):** Vista administrativa para que los organizadores controlen estadísticas de asistencia, estados de pago y detalles de su evento.
* **Diseño Responsivo y Moderno:** Interfaz desarrollada con React y Tailwind CSS, optimizada para dispositivos móviles y de escritorio.

---

##  Tecnologías Utilizadas

### **Backend**
* **Python / Flask:** API RESTful modular estructurada con Blueprints.
* **SQLAlchemy & SQLite:** ORM para la gestión de base de datos relacional.
* **Mercado Pago Python SDK:** Procesamiento de pagos y webhooks.
* **Flask-JWT-Extended:** Seguridad y manejo de sesiones.

### **Frontend**
* **React:** Librería principal para la interfaz de usuario.
* **React Router Dom:** Enrutamiento dinámico (vistas públicas y privadas).
* **Tailwind CSS & Lucide Icons:** Estilos modernos y componentes visuales.
* **Axios:** Cliente HTTP con interceptores para renovación automática de tokens.

---

##  Guía de Instalación y Configuración Local

Si querés correr este proyecto en tu entorno local, seguí estos pasos:

### 1. Clonar el repositorio
```bash
git clone [https://github.com/Eduardo-Alvarez2/invitaciones-platform.git](https://github.com/Eduardo-Alvarez2/invitaciones-platform.git)
cd invitaciones-platform

### 2. Configurar el Backend

cd backend
python -m venv venv
# En Windows:
venv\Scripts\activate
# En Mac/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

### Creá un archivo .env dentro de la carpeta backend basándote en este ejemplo:

SECRET_KEY=tu_clave_secreta_flask
JWT_SECRET_KEY=tu_clave_secreta_jwt
MP_ACCESS_TOKEN=tu_access_token_de_mercado_pago

### Iniciar el servidor de desarrollo Flask:

python app.py

### 3. Configurar el Frontend
Abrí otra terminal y dirigite a la carpeta frontend:

cd frontend
npm install

### Iniciar el servidor de React:

npm run dev


Autor
Desarrollado por [Alvarez Eduardo Daniel]

GitHub: @Eduardo-Alvarez2

LinkedIn: https://www.linkedin.com/in/eduardo-alvarez-b0a926329/


import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    # 🔐 Seguridad
    SECRET_KEY = os.environ.get("SECRET_KEY") or "super-secret-key"
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY") or "super-jwt-key"

    #  Mercado Pago 
    MP_ACCESS_TOKEN = os.environ.get("MP_ACCESS_TOKEN") or "APP_USR-4131245617882232-042909-c3543a9be4908deead55425a265327e4-3367644238"
    MP_PUBLIC_KEY = os.environ.get("MP_PUBLIC_KEY") or "APP_USR-4b579fea-287d-4cfb-8372-e8a31a08b132"
    # 🗄️ Base de datos
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(basedir, 'invitaciones.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # 📁 Archivos
    UPLOAD_FOLDER = "uploads"

    # 🌐 CORS
    CORS_ORIGINS = ["http://localhost:5173"]
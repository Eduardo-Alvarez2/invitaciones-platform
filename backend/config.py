import os
from datetime import timedelta

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    # Seguridad
    SECRET_KEY = os.environ.get("SECRET_KEY") or "super-secret-key"
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY") or "super-jwt-key"

    # Duración de los Tokens JWT (Agregados acá adentro)
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)    
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)

    # CONFIGURACIÓN DE CORREO (Gmail)
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_PORT = 587
    MAIL_USE_TLS = True
    MAIL_USERNAME = os.environ.get("MAIL_USERNAME") or "alvarez.edu26@gmail.com"
    # Acá va el token de 16 letras que te da Google para aplicaciones de terceros, no tu contraseña normal
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD") or "fdrw uusb ihnh ceem"
    MAIL_DEFAULT_SENDER = os.environ.get("MAIL_USERNAME") or "alvarez.edu26@gmail.com"

    #  Mercado Pago 
    MP_ACCESS_TOKEN = os.environ.get("MP_ACCESS_TOKEN") or "APP_USR-4131245617882232-042909-c3543a9be4908deead55425a265327e4-3367644238"
    MP_PUBLIC_KEY = os.environ.get("MP_PUBLIC_KEY") or "APP_USR-4b579fea-287d-4cfb-8372-e8a31a08b132"
    # Base de datos
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(basedir, 'invitaciones.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Archivos
    UPLOAD_FOLDER = "uploads"

    # CORS
    CORS_ORIGINS = ["http://localhost:5173"]
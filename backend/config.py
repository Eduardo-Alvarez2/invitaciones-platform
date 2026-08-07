import os
from datetime import timedelta
from dotenv import load_dotenv

# Carga explícita del archivo .env
basedir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(basedir, '.env'))

class Config:
    # Seguridad
    SECRET_KEY = os.environ.get("SECRET_KEY") or "clave-secreta-temporal-local"
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY") or "clave-jwt-temporal-local"

    # Duración de los Tokens JWT
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)    
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)

    # CONFIGURACIÓN DE CORREO (Brevo / Mail corporativo)
    MAIL_SERVER = os.environ.get("MAIL_SERVER", 'smtp-relay.brevo.com')
    MAIL_PORT = int(os.environ.get("MAIL_PORT", 587))
    MAIL_USE_TLS = os.environ.get("MAIL_USE_TLS", "True").lower() in ["true", "on", "1"]
    MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")
    # Usa MAIL_DEFAULT_SENDER del .env, y si no existe usa MAIL_USERNAME
    MAIL_DEFAULT_SENDER = os.environ.get("MAIL_DEFAULT_SENDER") or os.environ.get("MAIL_USERNAME")

    # Mercado Pago
    MP_ACCESS_TOKEN = os.environ.get("MP_ACCESS_TOKEN")
    MP_PUBLIC_KEY = os.environ.get("MP_PUBLIC_KEY")
    
    # Base de datos
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL") or f"sqlite:///{os.path.join(basedir, 'invitaciones.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Archivos
    UPLOAD_FOLDER = "uploads"

    # CORS
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "http://localhost:5173").split(",")
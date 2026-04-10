import os

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    # 🔐 Seguridad
    SECRET_KEY = "super-secret-key"
    JWT_SECRET_KEY = "super-secret-key"

    # 🗄️ Base de datos
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(basedir, 'invitaciones.db')}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # 📁 Archivos
    UPLOAD_FOLDER = "uploads"

    # 🌐 CORS
    CORS_ORIGINS = ["http://localhost:5173"]
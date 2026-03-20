from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database import db
from werkzeug.security import generate_password_hash, check_password_hash

class Usuario(db.Model):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True)
    nombre = Column(String(120), nullable=False)
    email = Column(String(120), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)

    eventos = relationship("Evento", back_populates="usuario", cascade="all, delete-orphan")

    # Método para setear contraseña
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    # Método para verificar contraseña
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
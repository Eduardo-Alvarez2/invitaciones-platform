from sqlalchemy import Column, Integer, String, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime, timedelta
import random  # 👈 Para generar el código de 6 dígitos aleatorio
from database import db
from werkzeug.security import generate_password_hash, check_password_hash

class Usuario(db.Model):
    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True)
    nombre = Column(String(120), nullable=False)
    email = Column(String(120), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    fecha_creacion = Column(DateTime, default=datetime.utcnow)

    # CAMPOS PARA LA VERIFICACIÓN POR MAIL
    verificado = Column(Boolean, default=False, nullable=False)
    codigo_verificacion = Column(String(6), nullable=True)
    codigo_expiracion = Column(DateTime, nullable=True)

    eventos = relationship("Evento", back_populates="usuario", cascade="all, delete-orphan")

    # Método para setear contraseña
    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    # Método para verificar contraseña
    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    #  NUEVO MÉTODO: Genera un código de 6 dígitos y le da 15 minutos de vida
    def generar_codigo_verificacion(self):
        # Genera un número aleatorio entre 100000 y 999999 y lo pasa a string
        self.codigo_verificacion = str(random.randint(100000, 999999))
        # El código expira en 15 minutos a partir de ahora
        self.codigo_expiracion = datetime.utcnow() + timedelta(minutes=15)
        return self.codigo_verificacion
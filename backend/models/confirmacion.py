from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import db

class Confirmacion(db.Model):
    __tablename__ = "confirmaciones"

    id = Column(Integer, primary_key=True)
    evento_id = Column(Integer, ForeignKey("eventos.id"), nullable=False)
    nombre = Column(String(120), nullable=False)
    telefono = Column(String(20), nullable=True)
    cantidad = Column(Integer, nullable=False)
    asiste = Column(Boolean, nullable=False)
    mensaje = Column(String(300), nullable=True)
    fecha_confirmacion = Column(DateTime, default=datetime.utcnow)

    evento = relationship("Evento", back_populates="confirmaciones")
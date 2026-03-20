from sqlalchemy import Column, Integer, String, Time, ForeignKey
from sqlalchemy.orm import relationship
from database import db

class EventoCronograma(db.Model):
    __tablename__ = "evento_cronograma"

    id = Column(Integer, primary_key=True)

    evento_id = Column(Integer, ForeignKey("eventos.id"), nullable=False)

    titulo = Column(String(120), nullable=False)
    descripcion = Column(String(250), nullable=True)

    hora = Column(Time, nullable=False)

    evento = relationship("Evento", back_populates="cronograma")
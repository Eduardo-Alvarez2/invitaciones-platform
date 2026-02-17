from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from database import db

class Evento(db.Model):
    __tablename__ = "eventos"

    id = Column(Integer, primary_key=True)
    nombre = Column(String(120), nullable=False)
    fecha = Column(DateTime, nullable=False)
    lugar = Column(String(150), nullable=False)
    direccion = Column(String(200), nullable=False)
    mensaje_principal = Column(Text, nullable=True)
    imagen_portada = Column(String(250), nullable=True)
    slug = Column(String(150), unique=True, nullable=False)
    activo = Column(Boolean, default=True)


    def to_dict(self):
     return {
        "id": self.id,
        "nombre": self.nombre,
        "fecha": self.fecha.strftime("%Y-%m-%d"),
        "lugar": self.lugar,
        "direccion": self.direccion,
        "slug": self.slug,
        "mensaje_principal": self.mensaje_principal,
        "imagen_portada": self.imagen_portada,
        "activo": self.activo
     }
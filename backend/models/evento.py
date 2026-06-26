from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import db

class Evento(db.Model):
    __tablename__ = "eventos"

    id = Column(Integer, primary_key=True)
    usuario_id = Column(Integer, ForeignKey("usuarios.id"), nullable=False)
    nombre = Column(String(120), nullable=False)
    fecha = Column(DateTime, nullable=False)
    lugar = Column(String(150), nullable=False)
    direccion = Column(String(200), nullable=False)
    mensaje_principal = Column(Text, nullable=True)
    imagen_portada = Column(String(250), nullable=True)
    slug = Column(String(150), unique=True, nullable=False)
    cancion = Column(String(250), nullable=True)
    activo = Column(Boolean, default=True)
    template = Column(String(50), nullable=False, default="classic")
    pagado = db.Column(db.Boolean, default=False)
    payment_id = db.Column(db.String(100), nullable=True) # ID que te da Mercado Pago
    status_pago = db.Column(db.String(50), default="pendiente")

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
        "activo": self.activo,
        "pagado": self.pagado,
        "payment_id": self.payment_id,
        "status_pago": self.status_pago
     }
    
    confirmaciones = relationship("Confirmacion", back_populates="evento", cascade="all, delete-orphan")
    usuario = relationship("Usuario", back_populates="eventos")
    imagenes = relationship("ImagenEvento", back_populates="evento", cascade="all, delete-orphan")
    cronograma = relationship("EventoCronograma", back_populates="evento", cascade="all, delete-orphan")

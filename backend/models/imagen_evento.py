from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import db

class ImagenEvento(db.Model):
    __tablename__ = "imagenes_evento"

    id = db.Column(db.Integer, primary_key=True)

    evento_id = db.Column(
        db.Integer,
        db.ForeignKey("eventos.id"),
        nullable=False
    )

    url = db.Column(db.String(250), nullable=False)

    evento = db.relationship("Evento", back_populates="imagenes")
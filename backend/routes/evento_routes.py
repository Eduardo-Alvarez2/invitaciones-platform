from flask import Blueprint, request, jsonify
from database import db
from models.evento import Evento
from datetime import datetime
from marshmallow import ValidationError
from schema.evento_schema import EventoSchema
from utils.slug import generar_slug_unico

evento_bp = Blueprint("evento_bp", __name__)

evento_schema = EventoSchema()

# CREATE
@evento_bp.route("/eventos", methods=["POST"])
def crear_evento():
    json_data = request.get_json()

    if not json_data:
        return jsonify({"error": "No se enviaron datos"}), 400

    evento_schema = EventoSchema()

    try:
        data = evento_schema.load(json_data)
    except ValidationError as err:
        return jsonify(err.messages), 400

    data["slug"] = generar_slug_unico(data["nombre"])

    nuevo_evento = Evento(**data)

    db.session.add(nuevo_evento)
    db.session.commit()

    return evento_schema.dump(nuevo_evento), 201

@evento_bp.route("/eventos", methods=["GET"])
def listar_eventos():
    eventos = Evento.query.all()
    
    return jsonify(evento_schema.dump(eventos, many=True)), 200

# READ - uno
@evento_bp.route("/eventos/<int:id>", methods=["GET"])
def obtener_evento(id):
    evento = Evento.query.get(id)

    if not evento:
        return jsonify({"error": "Evento no encontrado"}), 404

    return jsonify(evento_schema.dump(evento)), 200

# READ - por slug
@evento_bp.route("/eventos/slug/<string:slug>", methods=["GET"])
def obtener_evento_por_slug(slug):
    evento = Evento.query.filter_by(slug=slug).first()

    if not evento:
        return jsonify({"error": "Evento no encontrado"}), 404

    return jsonify(evento_schema.dump(evento)), 200


# UPDATE
@evento_bp.route("/eventos/<int:id>", methods=["PUT"])
def actualizar_evento(id):
    evento = Evento.query.get(id)

    if not evento:
        return jsonify({"error": "Evento no encontrado"}), 404

    json_data = request.get_json()

    if not json_data:
        return jsonify({"error": "No se enviaron datos"}), 400

    try:
        data = evento_schema.load(json_data, partial=True)
    except ValidationError as err:
        return jsonify(err.messages), 400

    for key, value in data.items():
        setattr(evento, key, value)

    db.session.commit()

    return jsonify(evento_schema.dump(evento)), 200


# DELETE
@evento_bp.route("/eventos/<int:id>", methods=["DELETE"])
def eliminar_evento(id):
    evento = Evento.query.get(id)

    if not evento:
        return jsonify({"error": "Evento no encontrado"}), 404

    db.session.delete(evento)
    db.session.commit()

    return jsonify({"mensaje": "Evento eliminado"}), 200
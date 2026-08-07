from flask import Blueprint, request, jsonify
from database import db
from models.evento import Evento
from models.confirmacion import Confirmacion
from marshmallow import ValidationError
from schema.confirmacion_schema import ConfirmacionSchema
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

confirmacion_bp = Blueprint("confirmacion", __name__)



@confirmacion_bp.route("/eventos/<string:slug>/confirmar", methods=["POST"])
def confirmar_asistencia(slug):
    evento = Evento.query.filter_by(slug=slug, activo=True).first()

    if not evento:
        return jsonify({"error": "Evento no encontrado"}), 404
    # Validar que esté activo
    if not evento.activo:
        return jsonify({"error": "El evento no está activo"}), 400

    # Validar que no haya pasado la fecha
    if evento.fecha < datetime.utcnow():
        return jsonify({"error": "El evento ya finalizó"}), 400 

    schema = ConfirmacionSchema()

    try:
        data = schema.load(request.get_json())
    except ValidationError as err:
        return jsonify(err.messages), 400

    # Regla de negocio
    if not data["asiste"]:
        data["cantidad"] = 0

    # Buscar si ya existe confirmación con ese teléfono para este evento
    confirmacion_existente = Confirmacion.query.filter_by(
        evento_id=evento.id,
        telefono=data["telefono"]
    ).first()

    if confirmacion_existente:
        # Actualizar
        confirmacion_existente.nombre = data["nombre"]
        confirmacion_existente.cantidad = data["cantidad"]
        confirmacion_existente.asiste = data["asiste"]
        confirmacion_existente.mensaje = data.get("mensaje")

        db.session.commit()

        return jsonify({"mensaje": "Confirmación actualizada"}), 200

    # Si no existe, crear nueva
    nueva_confirmacion = Confirmacion(
        evento_id=evento.id,
        nombre=data["nombre"],
        telefono=data["telefono"],
        cantidad=data["cantidad"],
        asiste=data["asiste"],
        mensaje=data.get("mensaje")
    )

    db.session.add(nueva_confirmacion)
    db.session.commit()

    return jsonify({"mensaje": "Confirmación registrada"}), 201


@confirmacion_bp.route("/admin/eventos/<string:slug>/confirmaciones", methods=["GET"])
@jwt_required()
def listar_confirmaciones(slug):
    user_id = int(get_jwt_identity())

    evento = Evento.query.filter_by(slug=slug).first()

    if not evento:
        return jsonify({"error": "Evento no encontrado"}), 404

    # Validar dueño
    if evento.usuario_id != user_id:
        return jsonify({"error": "No tienes permiso"}), 403

    confirmaciones = Confirmacion.query.filter_by(evento_id=evento.id).all()

    total_confirmados = sum(1 for c in confirmaciones if c.asiste)
    total_no_asisten = sum(1 for c in confirmaciones if not c.asiste)
    total_personas = sum(c.cantidad for c in confirmaciones if c.asiste)

    schema = ConfirmacionSchema(many=True)
    resultado = schema.dump(confirmaciones)

    return jsonify({
        "evento": evento.nombre,
        "total_confirmados": total_confirmados,
        "total_no_asisten": total_no_asisten,
        "total_personas": total_personas,
        "confirmaciones": resultado
    }), 200


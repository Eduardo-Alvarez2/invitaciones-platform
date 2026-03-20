from flask import Blueprint, request, jsonify
from models.cronograma import EventoCronograma
from database import db
from models.evento import Evento
from models.imagen_evento import ImagenEvento
from datetime import datetime
from marshmallow import ValidationError
from schema.evento_schema import EventoSchema
from utils.slug import generar_slug_unico
from flask_jwt_extended import jwt_required, get_jwt_identity

evento_bp = Blueprint("evento_bp", __name__)

evento_schema = EventoSchema()

# CREATE
@evento_bp.route("/eventos", methods=["POST"])
@jwt_required()
def crear_evento():

    user_id = int(get_jwt_identity())

    json_data = request.get_json()

    if not json_data:
        return jsonify({"error": "No se enviaron datos"}), 400

    evento_schema = EventoSchema()

    try:
        data = evento_schema.load(json_data)
    except ValidationError as err:
        return jsonify(err.messages), 400

    # generar slug único
    slug = generar_slug_unico(data["nombre"])

    nuevo_evento = Evento(
        usuario_id=user_id,
        nombre=data["nombre"],
        fecha=data["fecha"],
        lugar=data["lugar"],
        direccion=data["direccion"],
        mensaje_principal=data.get("mensaje_principal"),
        imagen_portada=data.get("imagen_portada"),
        template=data.get("template", "classic"),
        slug=slug,
        activo=True
    )

    db.session.add(nuevo_evento)
    db.session.commit()

    return jsonify({
        "mensaje": "Evento creado",
        "evento": nuevo_evento.to_dict()
    }), 201

@evento_bp.route("/eventos", methods=["GET"])
@jwt_required()
def listar_eventos():
    user_id = int(get_jwt_identity())

    eventos = Evento.query.filter_by(usuario_id=user_id).all()

    return jsonify(evento_schema.dump(eventos, many=True)), 200

# READ - uno
@evento_bp.route("/eventos/<int:id>", methods=["GET"])
@jwt_required()
def obtener_evento(id):
    user_id = int(get_jwt_identity())

    evento = Evento.query.get_or_404(id)

    if evento.usuario_id != user_id:
        return jsonify({"error": "No tienes permiso para ver este evento"}), 403
    
    return jsonify(evento_schema.dump(evento)), 200


# UPDATE
@evento_bp.route("/eventos/<int:id>", methods=["PUT"])
@jwt_required()
def actualizar_evento(id):
    user_id = int(get_jwt_identity())

    evento = Evento.query.get_or_404(id)

    if not evento:
        return jsonify({"error": "Evento no encontrado"}), 404

    json_data = request.get_json()

    # Verificar propiedad
    if evento.usuario_id != user_id:
        return jsonify({"error": "No tienes permiso para modificar este evento"}), 403

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
@jwt_required()
def eliminar_evento(id):
    user_id = int(get_jwt_identity())

    evento = Evento.query.get_or_404(id)

    # Verificar que el evento pertenece al usuario
    if evento.usuario_id != user_id:
        return jsonify({"error": "No tienes permiso para eliminar este evento"}), 403

    db.session.delete(evento)
    db.session.commit()

    return jsonify({"mensaje": "Evento eliminado"}), 200


@evento_bp.route("/eventos/<int:id>/estado", methods=["PATCH"])
@jwt_required()
def cambiar_estado_evento(id):
    user_id = int(get_jwt_identity())

    evento = Evento.query.get_or_404(id)

    if evento.usuario_id != user_id:
        return jsonify({"error": "No tienes permiso"}), 403

    json_data = request.get_json()

    if "activo" not in json_data:
        return jsonify({"error": "Debes enviar el campo 'activo'"}), 400

    evento.activo = json_data["activo"]

    db.session.commit()

    return jsonify({
        "mensaje": "Estado actualizado",
        "activo": evento.activo
    }), 200


# READ - por slug
@evento_bp.route("/eventos/slug/<string:slug>", methods=["GET"])
def obtener_evento_por_slug(slug):

    evento = Evento.query.filter_by(slug=slug, activo=True).first()

    if not evento:
        return jsonify({"error": "Evento no encontrado"}), 404

    # base del evento
    evento_data = evento_schema.dump(evento)

    # -------------------------
    # CRONOGRAMA
    # -------------------------
    items = EventoCronograma.query.filter_by(evento_id=evento.id)\
        .order_by(EventoCronograma.hora).all()

    cronograma = []

    for item in items:
        cronograma.append({
            "id": item.id,
            "hora": item.hora.strftime("%H:%M"),
            "titulo": item.titulo,
            "descripcion": item.descripcion
        })

    evento_data["cronograma"] = cronograma

    # -------------------------
    # GALERIA
    # -------------------------
    imagenes = []

    for img in evento.imagenes:
        imagenes.append({
            "id": img.id,
            "url": img.url_imagen
        })

    evento_data["galeria"] = imagenes

    # -------------------------
    # PORTADA
    # -------------------------
    evento_data["portada"] = evento.imagen_portada

    return jsonify(evento_data), 200



@evento_bp.route("/eventos/<int:id>/portada", methods=["POST"])
@jwt_required()
def subir_portada(id):

    import os
    import uuid
    from werkzeug.utils import secure_filename

    user_id = int(get_jwt_identity())

    evento = Evento.query.get_or_404(id)

    if evento.usuario_id != user_id:
        return jsonify({"error": "No tienes permiso"}), 403

    if "file" not in request.files:
        return jsonify({"error": "No se envió archivo"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "Nombre de archivo vacío"}), 400

    extensiones_permitidas = {"jpg", "jpeg", "png"}

    extension = file.filename.rsplit(".", 1)[1].lower()

    if extension not in extensiones_permitidas:
        return jsonify({"error": "Formato no permitido"}), 400

    # generar nombre único
    nombre_archivo = f"{uuid.uuid4()}.{extension}"

    carpeta = "uploads/eventos"

    os.makedirs(carpeta, exist_ok=True)

    ruta_archivo = os.path.join(carpeta, secure_filename(nombre_archivo))

    # borrar portada anterior si existe
    if evento.imagen_portada:
        try:
            os.remove(evento.imagen_portada.lstrip("/"))
        except:
            pass

    file.save(ruta_archivo)

    evento.imagen_portada = f"/{ruta_archivo}"

    db.session.commit()

    return jsonify({
        "mensaje": "Portada subida",
        "url": evento.imagen_portada
    }), 201

@evento_bp.route("/eventos/<int:id>/portada", methods=["DELETE"])
@jwt_required()
def eliminar_portada(id):

    import os

    user_id = int(get_jwt_identity())

    evento = Evento.query.get_or_404(id)

    if evento.usuario_id != user_id:
        return jsonify({"error": "No tienes permiso"}), 403

    if not evento.imagen_portada:
        return jsonify({"error": "El evento no tiene portada"}), 400

    try:
        os.remove(evento.imagen_portada.lstrip("/"))
    except:
        pass

    evento.imagen_portada = None

    db.session.commit()

    return jsonify({
        "mensaje": "Portada eliminada"
    }), 200


@evento_bp.route("/eventos/<int:id>/imagenes", methods=["POST"])
@jwt_required()
def subir_imagen_galeria(id):

    import os
    import uuid
    from werkzeug.utils import secure_filename

    user_id = int(get_jwt_identity())

    evento = Evento.query.get_or_404(id)

    if evento.usuario_id != user_id:
        return jsonify({"error": "No tienes permiso"}), 403

    if len(evento.imagenes) >= 3:
        return jsonify({"error": "Máximo 3 imágenes en galería"}), 400

    if "file" not in request.files:
        return jsonify({"error": "No se envió archivo"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "Nombre de archivo vacío"}), 400

    extensiones_permitidas = {"jpg", "jpeg", "png"}

    extension = file.filename.rsplit(".", 1)[1].lower()

    if extension not in extensiones_permitidas:
        return jsonify({"error": "Formato no permitido"}), 400

    nombre_archivo = f"{uuid.uuid4()}.{extension}"

    carpeta = "uploads/eventos"

    os.makedirs(carpeta, exist_ok=True)

    ruta_archivo = os.path.join(carpeta, secure_filename(nombre_archivo))

    file.save(ruta_archivo)

    nueva_imagen = ImagenEvento(
        evento_id=evento.id,
        url_imagen=f"/{ruta_archivo}"
    )

    db.session.add(nueva_imagen)
    db.session.commit()

    return jsonify({
        "mensaje": "Imagen agregada a galería",
        "url": nueva_imagen.url_imagen
    }), 201

@evento_bp.route("/eventos/<int:id>/imagenes", methods=["GET"])
@jwt_required()
def listar_imagenes_galeria(id):

    user_id = int(get_jwt_identity())

    evento = Evento.query.get_or_404(id)

    if evento.usuario_id != user_id:
        return jsonify({"error": "No tienes permiso"}), 403

    imagenes = []

    for img in evento.imagenes:
        imagenes.append({
            "id": img.id,
            "url": img.url_imagen
        })

    return jsonify(imagenes), 200

@evento_bp.route("/eventos/<int:id>/imagenes/<int:imagen_id>", methods=["DELETE"])
@jwt_required()
def eliminar_imagen_galeria(id, imagen_id):

    import os

    user_id = int(get_jwt_identity())

    evento = Evento.query.get_or_404(id)

    if evento.usuario_id != user_id:
        return jsonify({"error": "No tienes permiso"}), 403

    imagen = ImagenEvento.query.get_or_404(imagen_id)

    if imagen.evento_id != evento.id:
        return jsonify({"error": "La imagen no pertenece al evento"}), 400

    try:
        os.remove(imagen.url_imagen.lstrip("/"))
    except:
        pass

    db.session.delete(imagen)
    db.session.commit()

    return jsonify({
        "mensaje": "Imagen eliminada"
    }), 200

@evento_bp.route("/eventos/<int:id>/cronograma", methods=["POST"])
@jwt_required()
def crear_item_cronograma(id):

    user_id = int(get_jwt_identity())

    evento = Evento.query.get_or_404(id)

    if evento.usuario_id != user_id:
        return jsonify({"error": "No tienes permiso"}), 403

    data = request.get_json()

    hora = data.get("hora")
    titulo = data.get("titulo")
    descripcion = data.get("descripcion")

    if not hora or not titulo:
        return jsonify({"error": "hora y titulo son obligatorios"}), 400

    nuevo_item = EventoCronograma(
        evento_id=evento.id,
        hora=datetime.strptime(hora, "%H:%M").time(),
        titulo=titulo,
        descripcion=descripcion
    )

    db.session.add(nuevo_item)
    db.session.commit()

    return jsonify({
        "mensaje": "Item de cronograma creado"
    }), 201


@evento_bp.route("/eventos/<int:id>/cronograma", methods=["GET"])
@jwt_required()
def listar_cronograma(id):

    user_id = int(get_jwt_identity())

    evento = Evento.query.get_or_404(id)

    if evento.usuario_id != user_id:
        return jsonify({"error": "No tienes permiso"}), 403

    items = EventoCronograma.query.filter_by(evento_id=id).order_by(EventoCronograma.hora).all()

    resultado = []

    for item in items:
        resultado.append({  
            "id": item.id,
            "hora": item.hora.strftime("%H:%M"),
            "titulo": item.titulo,
            "descripcion": item.descripcion
        })

    return jsonify(resultado), 200
from flask import Blueprint, request, jsonify, current_app
from models.cronograma import EventoCronograma
from database import db
from models.evento import Evento
from models.imagen_evento import ImagenEvento
from datetime import datetime
from marshmallow import ValidationError
from schema.evento_schema import EventoSchema
from utils.slug import generar_slug_unico
from flask_jwt_extended import jwt_required, get_jwt_identity
import mercadopago

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


@evento_bp.route("/eventos/slug/<string:slug>", methods=["GET"])
def obtener_evento_por_slug(slug):
    # 1. Buscamos el evento principal
    evento = Evento.query.filter_by(slug=slug, activo=True).first()

    if not evento:
        print(f"❌ DEBUG: No se encontró evento con slug: {slug}")
        return jsonify({"error": "Evento no encontrado"}), 404

    print(f"🔍 DEBUG: Evento encontrado: {evento.nombre} (ID: {evento.id})")

    # Convertimos la base del evento a diccionario
    evento_data = evento_schema.dump(evento)

    # ---------------------------------------------------------
    # 🕒 DEBUG CRONOGRAMA
    # ---------------------------------------------------------
    todos_los_items = EventoCronograma.query.all()
    print(f"🕒 DEBUG TOTAL: Hay {len(todos_los_items)} registros en la tabla cronograma.")
    
    # Verificamos uno por uno para ver por qué no machea el ID
    for item in todos_los_items:
        print(f"   -> Item ID: {item.id} tiene evento_id: {item.evento_id} (Tipo: {type(item.evento_id)})")

    items_filtrados = EventoCronograma.query.filter_by(evento_id=evento.id).order_by(EventoCronograma.hora).all()
    
    cronograma = []
    for item in items_filtrados:
        cronograma.append({
            "id": item.id,
            "hora": item.hora.strftime("%H:%M") if item.hora else "",
            "titulo": item.titulo,
            "descripcion": item.descripcion
        })
    evento_data["cronograma"] = cronograma

    # ---------------------------------------------------------
    # 🖼️ DEBUG GALERIA
    # ---------------------------------------------------------
    todas_las_fotos = ImagenEvento.query.all()
    print(f"🖼️ DEBUG TOTAL: Hay {len(todas_las_fotos)} fotos en la tabla imagenes_evento.")
    
    for foto in todas_las_fotos:
        print(f"   -> Foto ID: {foto.id} tiene evento_id: {foto.evento_id} (Tipo: {type(foto.evento_id)})")

    fotos_filtradas = ImagenEvento.query.filter_by(evento_id=evento.id).all()
    
    imagenes = []
    for img in fotos_filtradas:
        # Usamos .url que confirmamos que es el nombre en tu modelo
        url_raw = img.url if img.url else ""
        # Limpiamos barras de Windows y barras duplicadas
        url_limpia = url_raw.lstrip("/").replace("\\", "/")
        imagenes.append({
            "id": img.id,
            "url": f"/{url_limpia}"
        })
    evento_data["imagenes"] = imagenes

    # ---------------------------------------------------------
    # 📸 PORTADA (Normalización)
    # ---------------------------------------------------------
    if evento.imagen_portada:
        portada_limpia = evento.imagen_portada.lstrip("/").replace("\\", "/")
        evento_data["foto_portada"] = f"/{portada_limpia}"
    else:
        evento_data["foto_portada"] = None

    print(f"✅ DEBUG: Respuesta final armada para ID {evento.id}")
    return jsonify(evento_data), 200

@evento_bp.route("/eventos/<int:id>/portada", methods=["POST"])
@jwt_required()
def subir_portada(id):
    import os
    import uuid
    from werkzeug.utils import secure_filename
    from flask import current_app # <--- Importante para leer el UPLOAD_FOLDER

    user_id = int(get_jwt_identity())
    evento = Evento.query.get_or_404(id)

    if evento.usuario_id != user_id:
        return jsonify({"error": "No tienes permiso"}), 403

    if "file" not in request.files:
        return jsonify({"error": "No se envió archivo"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "Nombre de archivo vacío"}), 400

    # 1. Validar extensión
    extensiones_permitidas = {"jpg", "jpeg", "png"}
    extension = file.filename.rsplit(".", 1)[1].lower()
    if extension not in extensiones_permitidas:
        return jsonify({"error": "Formato no permitido"}), 400

    # 2. Definir rutas usando la configuración centralizada de app.py
    nombre_archivo = f"{uuid.uuid4()}.{extension}"
    
    # Ruta absoluta para guardar el archivo físicamente
    ruta_base = current_app.config["UPLOAD_FOLDER"] 
    carpeta_eventos = os.path.join(ruta_base, "eventos")
    os.makedirs(carpeta_eventos, exist_ok=True)
    
    ruta_fisica = os.path.join(carpeta_eventos, secure_filename(nombre_archivo))

    # 3. Borrar portada anterior si existe
    if evento.imagen_portada:
        # Quitamos la barra inicial para que os.path lo reconozca
        path_anterior = os.path.join(ruta_base, evento.imagen_portada.replace("/uploads/", ""))
        if os.path.exists(path_anterior):
            try:
                os.remove(path_anterior)
            except:
                pass

    # 4. Guardar archivo y actualizar Base de Datos
    file.save(ruta_fisica)

    # Guardamos el formato "/uploads/eventos/nombre.jpg" para que React lo pida fácil
    evento.imagen_portada = f"/uploads/eventos/{nombre_archivo}"

    db.session.commit()

    return jsonify({
        "mensaje": "Portada subida",
        "url": evento.imagen_portada
    }), 201

@evento_bp.route("/eventos/<int:id>/portada", methods=["DELETE"])
@jwt_required()
def eliminar_portada(id):
    import os
    from flask import current_app
    
    user_id = int(get_jwt_identity())
    evento = Evento.query.get_or_404(id)

    if evento.usuario_id != user_id:
        return jsonify({"error": "No tienes permiso"}), 403

    if evento.imagen_portada:
        # Construimos la ruta real: quitamos '/uploads/' y unimos con el UPLOAD_FOLDER
        nombre_real = evento.imagen_portada.replace("/uploads/", "")
        ruta_real = os.path.join(current_app.config["UPLOAD_FOLDER"], nombre_real)
        
        if os.path.exists(ruta_real):
            os.remove(ruta_real)

    evento.imagen_portada = None
    db.session.commit()
    return jsonify({"mensaje": "Portada eliminada"}), 200


@evento_bp.route("/eventos/<int:id>/imagenes", methods=["POST"])
@jwt_required()
def subir_imagen_galeria(id):
    import os
    import uuid
    from werkzeug.utils import secure_filename
    from flask import current_app

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

    # Lógica de rutas unificada
    nombre_archivo = f"{uuid.uuid4()}.{extension}"
    ruta_base = current_app.config["UPLOAD_FOLDER"]
    carpeta_eventos = os.path.join(ruta_base, "eventos")
    os.makedirs(carpeta_eventos, exist_ok=True)

    ruta_fisica = os.path.join(carpeta_eventos, secure_filename(nombre_archivo))
    
    # Guardar archivo físico
    file.save(ruta_fisica)

    # Guardar en DB con ruta relativa estándar
    nueva_imagen = ImagenEvento(
        evento_id=evento.id,
        url=f"/uploads/eventos/{nombre_archivo}"
    )

    db.session.add(nueva_imagen)
    db.session.commit()

    return jsonify({
        "mensaje": "Imagen agregada a galería",
        "url": nueva_imagen.url
    }), 201

@evento_bp.route("/eventos/<int:id>/imagenes", methods=["GET"])
@jwt_required()
def listar_imagenes_galeria(id):
    user_id = int(get_jwt_identity())

    # 1. Buscamos el evento
    evento = Evento.query.get_or_404(id)

    # 2. Verificamos propiedad
    if evento.usuario_id != user_id:
        return jsonify({"error": "No tienes permiso para ver estas imágenes"}), 403

    imagenes = []

    # 3. Recorremos la relación 'imagenes' del modelo Evento
    for img in evento.imagenes:
        # Normalizamos la URL por si quedó alguna barra invertida de Windows
        url_normalizada = img.url.replace("\\", "/") if img.url else ""
        
        imagenes.append({
            "id": img.id,
            "url": url_normalizada
        })

    return jsonify(imagenes), 200

@evento_bp.route("/eventos/<int:id>/imagenes/<int:imagen_id>", methods=["DELETE"])
@jwt_required()
def eliminar_imagen_galeria(id, imagen_id):
    import os
    from flask import current_app

    user_id = int(get_jwt_identity())
    evento = Evento.query.get_or_404(id)

    if evento.usuario_id != user_id:
        return jsonify({"error": "No tienes permiso"}), 403

    imagen = ImagenEvento.query.get_or_404(imagen_id)

    if imagen.url:
        nombre_real = imagen.url.replace("/uploads/", "")
        ruta_real = os.path.join(current_app.config["UPLOAD_FOLDER"], nombre_real)
        
        if os.path.exists(ruta_real):
            os.remove(ruta_real)

    db.session.delete(imagen)
    db.session.commit()
    return jsonify({"mensaje": "Imagen eliminada"}), 200

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

@evento_bp.route("/eventos/<int:id>/cronograma/sync", methods=["POST"])
@jwt_required()
def sincronizar_cronograma(id):
    user_id = int(get_jwt_identity())
    evento = Evento.query.get_or_404(id)

    if evento.usuario_id != user_id:
        return jsonify({"error": "No tienes permiso"}), 403

    data = request.get_json()
    items = data.get("items", [])

    try:
        # Borramos lo que había antes para este evento
        EventoCronograma.query.filter_by(evento_id=id).delete()

        # Guardamos la nueva lista
        for item in items:
            if item.get("titulo") and item.get("hora"):
                # Manejamos el formato de hora por si viene con segundos o sin ellos
                hora_str = item["hora"][:5] # Tomamos solo HH:MM
                nuevo_item = EventoCronograma(
                    evento_id=id,
                    hora=datetime.strptime(hora_str, "%H:%M").time(),
                    titulo=item["titulo"],
                    descripcion=item.get("descripcion", "")
                )
                db.session.add(nuevo_item)

        db.session.commit()
        return jsonify({"mensaje": "Cronograma actualizado"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


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

#----------------mercado pago----------------

@evento_bp.route("/eventos/<int:id>/pagar", methods=["POST"])
@jwt_required()
def crear_preferencia_pago(id):
    # Inicializamos el SDK con el Token de tu Config
    sdk = mercadopago.SDK(current_app.config["MP_ACCESS_TOKEN"])
    
    user_id = int(get_jwt_identity())
    evento = Evento.query.get_or_404(id)

    if evento.usuario_id != user_id:
        return jsonify({"error": "No tienes permiso"}), 403

    # Configuramos la preferencia
    preference_data = {
        "items": [
            {
                "title": f"Activación Invitación: {evento.nombre}",
                "quantity": 1,
                "unit_price": 30000.0,  # El precio 
                "currency_id": "ARS"
            }
        ],
        "back_urls": {
            "success": f"http://localhost:5173/dashboard/evento/{id}?status=success",
            "failure": f"http://localhost:5173/checkout/{id}?status=failure",
            "pending": f"http://localhost:5173/checkout/{id}?status=pending"
        },
        "auto_return": "approved",
        "external_reference": str(id),  # CLAVE: Para saber qué evento se pagó después
        "notification_url": "https://situation-mouth-step.ngrok-free.dev/api/webhook-pago"
    }

    try:
        preference_result = sdk.preference().create(preference_data)
        preference = preference_result["response"]
        
        # Devolvemos el link (init_point) al frontend
        return jsonify({
            "id": preference["id"],
            "init_point": preference["init_point"]
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@evento_bp.route("/webhook-pago", methods=["POST"])
def webhook_pago():
    # Mercado Pago envía notificaciones por query params o body
    # El 'topic' o 'type' nos dice qué pasó.
     data = request.args.to_dict() # Para notificaciones simples
    
    # Si la notificación es de un pago
     payment_id = request.args.get('data.id') or request.args.get('id')
     topic = request.args.get('type') or request.args.get('topic')

     if topic == 'payment' and payment_id:
        # 1. Consultamos el estado real del pago a Mercado Pago
        sdk = mercadopago.SDK(current_app.config["MP_ACCESS_TOKEN"])
        payment_info = sdk.payment().get(payment_id)
        payment_data = payment_info["response"]

        # 2. Sacamos el ID del evento que guardamos en 'external_reference'
        evento_id = payment_data.get("external_reference")
        status = payment_data.get("status")

        if evento_id and status == "approved":
            # 3. Buscamos el evento y lo activamos
            evento = Evento.query.get(int(evento_id))
            if evento:
                evento.pagado = True
                evento.status_pago = "approved"
                evento.payment_id = str(payment_id)
                db.session.commit()
                print(f"✅ Evento {evento_id} activado por pago exitoso.")

     # Siempre responder 200 o 201 a Mercado Pago para que no siga reintentando
     return jsonify({"status": "received"}), 200


from flask import Blueprint, request, jsonify
from models.usuarios import Usuario
from database import db
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from flask_mailman import EmailMessage
from datetime import datetime
import re  # Para validar la fortaleza de la contraseña y el formato del mail


auth_bp = Blueprint("auth", __name__)

def es_password_segura(password):
    """
    Valida que la contraseña cumpla con:
    - Mínimo 8 caracteres
    - Al menos una letra mayúscula
    - Al menos un número
    - Al menos un carácter especial (@$!%*?&.)
    """
    if len(password) < 8:
        return False, "La contraseña debe tener al menos 8 caracteres."
    if not re.search(r"[A-Z]", password):
        return False, "La contraseña debe incluir al menos una letra mayúscula."
    if not re.search(r"\d", password):
        return False, "La contraseña debe incluir al menos un número."
    if not re.search(r"[@$!%*?&.]", password):
        return False, "La contraseña debe incluir al menos un carácter especial (@$!%*?&.)."
    return True, ""

def es_email_valido(email):
    """ Valida el formato del correo electrónico usando regex """
    regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(regex, email) is not None


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    nombre = data.get("nombre")
    email = data.get("email")
    password = data.get("password")

    if not nombre or not email or not password:
        return jsonify({"error": "Todos los campos son obligatorios"}), 400

    if not es_email_valido(email):
        return jsonify({"error": "El formato del correo electrónico no es válido."}), 400

    es_segura, mensaje_error = es_password_segura(password)
    if not es_segura:
        return jsonify({"error": mensaje_error}), 400

    usuario_existente = Usuario.query.filter_by(email=email).first()
    if usuario_existente:
        return jsonify({"error": "El email ya está registrado"}), 400

    # Creamos el usuario (verificado arranca en False por defecto )
    nuevo_usuario = Usuario(
        nombre=nombre,
        email=email
    )
    nuevo_usuario.set_password(password)

    #  Generamos el código de 6 dígitos temporal
    codigo = nuevo_usuario.generar_codigo_verificacion()

    db.session.add(nuevo_usuario)
    db.session.commit()

    #  Enviamos el correo electrónico con el código
    try:
        msg = EmailMessage(
            subject="Activa tu cuenta - ProyectoTarjetasInvitacion",
            body=f"Hola {nombre},\n\nGracias por registrarte. Tu código de activación es: {codigo}\n\nEste código vencerá en 15 minutos.",
            to=[email]
        )
        msg.send()
    except Exception as e:
        print(f"Error enviando el correo: {e}")
        # En desarrollo, imprimimos el error pero no frenamos el flujo por si no configuraste el SMTP todavía
        return jsonify({
            "mensaje": "Usuario registrado. Error al enviar el mail de activación.", 
            "codigo_desarrollo": codigo  # Te lo dejo acá para que lo veas en la consola del navegador si falla el SMTP
        }), 201

    return jsonify({"mensaje": "Usuario registrado. Revisa tu correo para activar tu cuenta."}), 201



@auth_bp.route("/verify", methods=["POST"])
def verify():
    data = request.get_json()
    email = data.get("email")
    codigo_ingresado = data.get("codigo")

    if not email or not codigo_ingresado:
        return jsonify({"error": "El email y el código son obligatorios."}), 400

    usuario = Usuario.query.filter_by(email=email).first()

    if not usuario:
        return jsonify({"error": "Usuario no encontrado."}), 404

    if usuario.verificado:
        return jsonify({"mensaje": "La cuenta ya se encuentra verificada."}), 200

    # Verificamos si el código coincide y si no expiró
    if usuario.codigo_verificacion != codigo_ingresado:
        return jsonify({"error": "El código ingresado es incorrecto."}), 400

    if usuario.codigo_expiracion < datetime.utcnow():
        return jsonify({"error": "El código ha expirado. Por favor, solicita uno nuevo."}), 400

    # Si pasó los controles, activamos al usuario de forma definitiva
    usuario.verificado = True
    usuario.codigo_verificacion = None  # Limpiamos el código usado
    usuario.codigo_expiracion = None
    db.session.commit()

    return jsonify({"mensaje": "Cuenta activada con éxito. Ya puedes iniciar sesión."}), 200

@auth_bp.route("/resend-code", methods=["POST"])
def resend_code():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "El email es obligatorio."}), 400

    usuario = Usuario.query.filter_by(email=email).first()

    if not usuario:
        return jsonify({"error": "No existe ninguna cuenta con este correo electrónico."}), 404

    if usuario.verificado:
        return jsonify({"mensaje": "Esta cuenta ya se encuentra activada. Puedes iniciar sesión."}), 200

    # Generamos un nuevo código y actualizamos la expiración (15 mins más)
    codigo = usuario.generar_codigo_verificacion()
    db.session.commit()

    # Intentamos reenviar el correo limpio (sin eñes ni tildes)
    try:
        msg = EmailMessage(
            subject="Nuevo codigo de activacion - Invitaciones Digitales",
            body=f"Hola {usuario.nombre},\n\nSolicitaste un nuevo codigo de activacion. Tu codigo es: {codigo}\n\nEste codigo vencera en 15 minutos.",
            to=[email]
        )
        msg.send()
    except Exception as e:
        print(f"Error reenviando el correo: {e}")
        return jsonify({
            "mensaje": "No se pudo enviar el mail, pero se genero un nuevo codigo.",
            "codigo_desarrollo": codigo  # Por si sigue fallando el SMTP, lo ves en la consola
        }), 201

    return jsonify({"mensaje": "Se ha enviado un nuevo código de activación a tu correo."}), 200


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email y contraseña son obligatorios"}), 400

    usuario = Usuario.query.filter_by(email=email).first()

    if not usuario or not usuario.check_password(password):
        return jsonify({"error": "Credenciales inválidas"}), 401

    # CONTROL CRUCIAL: Bloquear si no está verificado
    if not usuario.verificado:
        return jsonify({"error": "Tu cuenta aún no ha sido activada. Por favor, verifica tu correo."}), 403

    access_token = create_access_token(identity=str(usuario.id))
    refresh_token = create_refresh_token(identity=str(usuario.id))

    return jsonify({
        "mensaje": "Login exitoso",
        "access_token": access_token,
        "refresh_token": refresh_token,
        "user": {
            "id": usuario.id,
            "nombre": usuario.nombre,
            "email": usuario.email
        }
    }), 200


# 5. NUEVA RUTA: Recibe el Refresh Token vencido y otorga un Access Token nuevo
@auth_bp.route("/refresh", methods=["POST"])
@jwt_required(refresh=True)  # Exige de forma estricta un Refresh Token válido
def refresh():
    # Obtiene la identidad guardada dentro del Refresh Token actual
    usuario_id = get_jwt_identity()
    
    # Genera un nuevo Access Token de corta duración
    nuevo_access_token = create_access_token(identity=usuario_id)
    
    return jsonify({
        "access_token": nuevo_access_token
    }), 
    
# ==========================================
#  RECUPERACIÓN DE CONTRASEÑA
# ==========================================

@auth_bp.route("/forgot-password", methods=["POST"])
def forgot_password():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"error": "El correo electrónico es obligatorio."}), 400

    if not es_email_valido(email):
        return jsonify({"error": "El formato del correo electrónico no es válido."}), 400

    usuario = Usuario.query.filter_by(email=email).first()

    # Si no existe el usuario, respondemos con el mismo mensaje por seguridad (evita mapeo de mails)
    if not usuario:
        return jsonify({"mensaje": "Si el correo esta registrado, recibiras un codigo para restablecer tu contraseña."}), 200

    # Reutilizamos tu método existente para generar código de 6 dígitos
    codigo = usuario.generar_codigo_verificacion()
    db.session.commit()

    try:
        msg = EmailMessage(
            subject="Recuperacion de contraseña - Invitaciones Digitales",
            body=f"Hola {usuario.nombre},\n\nSolicitaste restablecer tu contraseña. Tu codigo de verificacion es: {codigo}\n\nEste codigo vencera en 15 minutos.\nSi no solicitaste este cambio, ignora este correo.",
            to=[email]
        )
        msg.send()
    except Exception as e:
        print(f"Error enviando el correo de recuperación: {e}")
        return jsonify({
            "mensaje": "Se genero el codigo pero fallo el envio del mail.",
        }), 200

    return jsonify({"mensaje": "Si el correo esta registrado, recibiras un codigo para restablecer tu contraseña."}), 200


@auth_bp.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.get_json()
    email = data.get("email")
    codigo_ingresado = data.get("codigo")
    nueva_password = data.get("password")

    if not email or not codigo_ingresado or not nueva_password:
        return jsonify({"error": "Todos los campos son obligatorios."}), 400

    usuario = Usuario.query.filter_by(email=email).first()

    if not usuario:
        return jsonify({"error": "Usuario no encontrado."}), 404

    # Validaciones del código
    if usuario.codigo_verificacion != codigo_ingresado:
        return jsonify({"error": "El código ingresado es incorrecto."}), 400

    if usuario.codigo_expiracion < datetime.utcnow():
        return jsonify({"error": "El código ha expirado. Por favor, solicita uno nuevo."}), 400

    # Validamos la fortaleza de la nueva contraseña con tu misma función
    es_segura, mensaje_error = es_password_segura(nueva_password)
    if not es_segura:
        return jsonify({"error": mensaje_error}), 400

    # Aplicamos la nueva contraseña y limpiamos el código usado
    usuario.set_password(nueva_password)
    usuario.codigo_verificacion = None
    usuario.codigo_expiracion = None
    
    # Si por alguna razón el usuario no estaba verificado, al recuperar la clave lo marcamos como activo
    usuario.verificado = True
    
    db.session.commit()

    return jsonify({"mensaje": "Contraseña actualizada con éxito. Ya puedes iniciar sesión."}), 200
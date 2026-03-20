from flask import Blueprint, request, jsonify
from models.usuarios import Usuario
from database import db
from flask_jwt_extended import create_access_token
from marshmallow import ValidationError

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    nombre = data.get("nombre")
    email = data.get("email")
    password = data.get("password")

    if not nombre or not email or not password:
        return jsonify({"error": "Todos los campos son obligatorios"}), 400

    usuario_existente = Usuario.query.filter_by(email=email).first()
    if usuario_existente:
        return jsonify({"error": "El email ya está registrado"}), 400

    nuevo_usuario = Usuario(
        nombre=nombre,
        email=email
    )
    nuevo_usuario.set_password(password)

    db.session.add(nuevo_usuario)
    db.session.commit()

    return jsonify({"mensaje": "Usuario registrado correctamente"}), 201


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

    access_token = create_access_token(identity=str(usuario.id))

    return jsonify({
        "mensaje": "Login exitoso",
        "access_token": access_token
    }), 200
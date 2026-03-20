from flask import Flask, send_from_directory
from flask_jwt_extended import JWTManager
from database import db
from flask_migrate import Migrate
from flask_cors import CORS

import os

import models
def create_app():
    app = Flask(__name__)
    
    CORS(app, resources={r"/*": {"origins": "*"}})

    UPLOAD_FOLDER = "uploads"

    @app.route("/uploads/<filename>")
    def uploaded_file(filename):
       return send_from_directory(UPLOAD_FOLDER, filename)

    basedir = os.path.abspath(os.path.dirname(__file__))

    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(basedir, 'invitaciones.db')}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["JWT_SECRET_KEY"] = "super-secret-key"  # Cambia esto por una clave segura en producción

    jwt = JWTManager(app)
    db.init_app(app)
    Migrate(app, db)

    
    from models.confirmacion import Confirmacion
    from models.evento import Evento
    from routes.evento_routes import evento_bp
    from routes.auth_routes import auth_bp
    from routes.confirmacion_routes import confirmacion_bp


    app.register_blueprint(evento_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api")
    app.register_blueprint(confirmacion_bp, url_prefix="/api")

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
from flask import Flask, send_from_directory
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS

from database import db
from config import Config

import os
import models


def create_app():
    app = Flask(__name__)

    # CONFIG
    app.config.from_object(Config)

    # 🌐 CORS 
    CORS(app, 
         resources={r"/api/*": {"origins": ["http://localhost:5173"]}},
         supports_credentials=True)
    
    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config["UPLOAD_FOLDER"] = os.path.join(basedir, "uploads")

    # 📁 SERVIR ARCHIVOS SUBIDOS
    @app.route("/uploads/<path:filename>")
    def uploaded_file(filename):
        return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

    # 🔐 JWT + DB
    jwt = JWTManager(app)
    db.init_app(app)
    Migrate(app, db)

    # IMPORT MODELOS e INYECCIÓN DE RUTAS (Blueprints)
    with app.app_context():
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
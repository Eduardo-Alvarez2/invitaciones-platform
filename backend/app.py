from flask import Flask
from database import db
from flask_migrate import Migrate
import os

def create_app():
    app = Flask(__name__)

    basedir = os.path.abspath(os.path.dirname(__file__))

    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{os.path.join(basedir, 'invitaciones.db')}"
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)
    Migrate(app, db)

    from models.confirmacion import Confirmacion
    from models.evento import Evento
    from routes.evento_routes import evento_bp

    app.register_blueprint(evento_bp)

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
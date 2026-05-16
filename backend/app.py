import os
from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db
from auth import auth_bp
from batches import batches_bp
from scan import scan_bp
from admin import admin_bp

UPLOADS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'uploads')

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app, origins=["http://localhost:3000", "http://192.168.1.33:3000"], supports_credentials=True)

    db.init_app(app)
    JWTManager(app)

    app.register_blueprint(auth_bp,    url_prefix='/auth')
    app.register_blueprint(batches_bp, url_prefix='/batches')
    app.register_blueprint(scan_bp,    url_prefix='/scan')
    app.register_blueprint(admin_bp,   url_prefix='/admin')

    @app.route('/uploads/<path:filename>')
    def uploaded_file(filename):
        return send_from_directory(UPLOADS_DIR, filename)

    with app.app_context():
        db.create_all()
        os.makedirs(UPLOADS_DIR, exist_ok=True)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=False, port=8000, use_reloader=False)

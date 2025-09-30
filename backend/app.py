from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from routes.auth import auth_bp
from routes.brands import brands_bp
from routes.products import products_bp
from routes.messages import messages_bp
from routes.admin import admin_bp
from database import init_db

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for development
    CORS(app, 
         origins=["http://localhost:5173", "http://127.0.0.1:5173"],
         allow_credentials=True,
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         expose_headers=["Content-Type", "Authorization"])
    JWTManager(app)
    init_db(app)

    # Add a test route
    @app.route('/api/test', methods=['GET'])
    def test():
        return jsonify({"message": "Backend is working!"})

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(brands_bp, url_prefix='/api/brands')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(messages_bp, url_prefix='/api/messages')
    app.register_blueprint(admin_bp, url_prefix='/api/admin')

    return app

if __name__ == '__main__':
    app = create_app()
    # Enable debug mode and allow external access
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        ssl_context=None  # Disable SSL for development
    )
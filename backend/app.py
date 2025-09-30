from flask import Flask
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

    # Initialize extensions with proper CORS settings
    CORS(app, resources={
        r"/api/*": {
            "origins": ["https://symmetrical-space-spork-4jpqw5p4qv5gh74j5-5173.app.github.dev"],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"]
        }
    })
    JWTManager(app)
    init_db(app)

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
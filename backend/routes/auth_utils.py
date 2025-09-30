# Add Flask-JWT-Extended decorator for protected routes
from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity

def admin_required():
    def wrapper(fn):
        @wraps(fn)
        def decorator(*args, **kwargs):
            verify_jwt_in_request()
            identity = get_jwt_identity()
            if identity != current_app.config['ADMIN_USERNAME']:
                return jsonify(message="Admin access required"), 403
            return fn(*args, **kwargs)
        return decorator
    return wrapper
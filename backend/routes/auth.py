from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    print(f"Login attempt - Username: {username}")
    print(f"Expected username: {current_app.config['ADMIN_USERNAME']}")
    print(f"Password match: {password == current_app.config['ADMIN_PASSWORD']}")

    if (username == current_app.config['ADMIN_USERNAME'] and 
        password == current_app.config['ADMIN_PASSWORD']):
        access_token = create_access_token(identity=username)
        print("Login successful, returning token")
        return jsonify({'access_token': access_token}), 200
    
    print("Invalid credentials")
    return jsonify({"message": "Invalid credentials"}), 401

# Add more auth routes as needed
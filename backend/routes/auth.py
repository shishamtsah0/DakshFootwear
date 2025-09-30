from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        # Print request details
        print("Received login request")
        print("Request headers:", dict(request.headers))
        
        # Get JSON data
        data = request.get_json()
        print("Request data:", data)
        
        if not data:
            print("No JSON data received")
            return jsonify({"message": "No data provided"}), 400

        username = data.get('username')
        password = data.get('password')

        print(f"Received credentials - Username: {username}, Password length: {len(password) if password else 0}")
        print(f"Expected credentials - Username: {current_app.config['ADMIN_USERNAME']}")
        
        # Check credentials
        if (username == current_app.config['ADMIN_USERNAME'] and 
            password == current_app.config['ADMIN_PASSWORD']):
            print("Credentials match, generating token")
            access_token = create_access_token(
                identity=username,
                expires_delta=timedelta(hours=24)
            )
            return jsonify({
                "access_token": access_token,
                "username": username
            }), 200
        
        print("Invalid credentials")
        return jsonify({"message": "Invalid credentials"}), 401
        
    except Exception as e:
        print(f"Error in login route: {str(e)}")
        return jsonify({"message": f"Server error: {str(e)}"}), 500

# Add more auth routes as needed
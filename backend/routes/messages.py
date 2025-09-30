from flask import Blueprint, request, jsonify
from database_manager import DatabaseManager
from models.models import Message
from routes.auth_utils import admin_required

messages_bp = Blueprint('messages', __name__)

@messages_bp.route('/', methods=['POST'])
def create_message():
    """Create a new message from contact form"""
    try:
        data = request.get_json()
        message = Message.from_dict(data)
        DatabaseManager.add_message(message)
        return jsonify({"message": "Message sent successfully"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@messages_bp.route('/', methods=['GET'])
@admin_required()
def get_messages():
    """Get all messages (admin only)"""
    try:
        messages = DatabaseManager.get_messages()
        return jsonify([message.to_dict() for message in messages]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
from flask import Blueprint, request, jsonify
from database_manager import DatabaseManager
from models.models import BrandSection
from routes.auth_utils import admin_required

brands_bp = Blueprint('brands', __name__)

@brands_bp.route('/', methods=['GET'])
def get_brands():
    """Get all brand sections"""
    try:
        brand_sections = DatabaseManager.get_brand_sections()
        return jsonify([section.to_dict() for section in brand_sections]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@brands_bp.route('/', methods=['POST'])
@admin_required()
def create_brand():
    """Create a new brand section"""
    try:
        data = request.get_json()
        brand_section = BrandSection.from_dict(data)
        DatabaseManager.add_brand_section(brand_section)
        return jsonify(brand_section.to_dict()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@brands_bp.route('/<name>', methods=['PUT'])
@admin_required()
def update_brand(name):
    """Update a brand section"""
    try:
        data = request.get_json()
        brand_section = BrandSection.from_dict(data)
        DatabaseManager.update_brand_section(name, brand_section)
        return jsonify(brand_section.to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@brands_bp.route('/<name>', methods=['DELETE'])
@admin_required()
def delete_brand(name):
    """Delete a brand section"""
    try:
        DatabaseManager.delete_brand_section(name)
        return jsonify({"message": "Brand section deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
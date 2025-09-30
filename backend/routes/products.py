from flask import Blueprint, request, jsonify
from database_manager import DatabaseManager
from models.models import Product
from routes.auth_utils import admin_required

products_bp = Blueprint('products', __name__)

@products_bp.route('/', methods=['GET'])
def get_products():
    """Get all products, optionally filtered by brand section"""
    try:
        brand_section = request.args.get('brand_section')
        products = DatabaseManager.get_products(brand_section)
        return jsonify([product.to_dict() for product in products]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@products_bp.route('/<product_id>', methods=['GET'])
def get_product(product_id):
    """Get a specific product by ID"""
    try:
        product = DatabaseManager.get_product(product_id)
        if product:
            return jsonify(product.to_dict()), 200
        return jsonify({"error": "Product not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@products_bp.route('/', methods=['POST'])
@admin_required()
def create_product():
    """Create a new product"""
    try:
        data = request.get_json()
        product = Product.from_dict(data)
        DatabaseManager.add_product(product)
        return jsonify(product.to_dict()), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@products_bp.route('/<product_id>', methods=['PUT'])
@admin_required()
def update_product(product_id):
    """Update a product"""
    try:
        data = request.get_json()
        product = Product.from_dict(data)
        DatabaseManager.update_product(product_id, product)
        return jsonify(product.to_dict()), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@products_bp.route('/<product_id>', methods=['DELETE'])
@admin_required()
def delete_product(product_id):
    """Delete a product"""
    try:
        DatabaseManager.delete_product(product_id)
        return jsonify({"message": "Product deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
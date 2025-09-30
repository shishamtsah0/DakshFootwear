from flask import Blueprint, jsonify
from database_manager import DatabaseManager
from routes.auth_utils import admin_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/dashboard', methods=['GET'])
@admin_required()
def get_dashboard_data():
    """Get all data needed for admin dashboard"""
    try:
        brand_sections = DatabaseManager.get_brand_sections()
        products = DatabaseManager.get_products()
        messages = DatabaseManager.get_messages()
        
        return jsonify({
            "brand_sections": [section.to_dict() for section in brand_sections],
            "products": [product.to_dict() for product in products],
            "messages": [message.to_dict() for message in messages],
            "stats": {
                "total_brands": len(brand_sections),
                "total_products": len(products),
                "total_messages": len(messages)
            }
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
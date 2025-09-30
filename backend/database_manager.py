from datetime import datetime
from database import get_db
from bson import ObjectId
from models.models import BrandSection, Product, Message

class DatabaseManager:
    @staticmethod
    def init_collections():
        db = get_db()
        # Create indexes
        db.brand_sections.create_index([("name", 1)], unique=True)
        db.products.create_index([("name", 1)])
        db.products.create_index([("brand_section", 1)])
        db.messages.create_index([("created_at", -1)])

    # Brand Sections
    @staticmethod
    def get_brand_sections():
        db = get_db()
        return [BrandSection.from_dict(doc) for doc in db.brand_sections.find()]

    @staticmethod
    def add_brand_section(brand_section):
        db = get_db()
        db.brand_sections.insert_one(brand_section.to_dict())

    @staticmethod
    def update_brand_section(name, brand_section):
        db = get_db()
        db.brand_sections.update_one(
            {"name": name},
            {"$set": brand_section.to_dict()}
        )

    @staticmethod
    def delete_brand_section(name):
        db = get_db()
        db.brand_sections.delete_one({"name": name})

    # Products
    @staticmethod
    def get_products(brand_section=None):
        db = get_db()
        query = {"brand_section": brand_section} if brand_section else {}
        return [Product.from_dict(doc) for doc in db.products.find(query)]

    @staticmethod
    def get_product(product_id):
        db = get_db()
        doc = db.products.find_one({"_id": ObjectId(product_id)})
        return Product.from_dict(doc) if doc else None

    @staticmethod
    def add_product(product):
        db = get_db()
        db.products.insert_one(product.to_dict())

    @staticmethod
    def update_product(product_id, product):
        db = get_db()
        db.products.update_one(
            {"_id": ObjectId(product_id)},
            {"$set": product.to_dict()}
        )

    @staticmethod
    def delete_product(product_id):
        db = get_db()
        db.products.delete_one({"_id": ObjectId(product_id)})

    # Messages
    @staticmethod
    def add_message(message):
        db = get_db()
        db.messages.insert_one(message.to_dict())

    @staticmethod
    def get_messages():
        db = get_db()
        return [Message.from_dict(doc) for doc in db.messages.find().sort("created_at", -1)]
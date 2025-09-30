from bson import ObjectId

class BrandSection:
    def __init__(self, name, logo_url, banner_url, description, order=None, is_visible=True):
        self.name = name
        self.logo_url = logo_url
        self.banner_url = banner_url
        self.description = description
        self.order = order
        self.is_visible = is_visible

    def to_dict(self):
        return {
            "name": self.name,
            "logo_url": self.logo_url,
            "banner_url": self.banner_url,
            "description": self.description,
            "order": self.order,
            "is_visible": self.is_visible
        }

    @staticmethod
    def from_dict(data):
        return BrandSection(
            name=data.get("name"),
            logo_url=data.get("logo_url"),
            banner_url=data.get("banner_url"),
            description=data.get("description"),
            order=data.get("order"),
            is_visible=data.get("is_visible", True)
        )

class Product:
    def __init__(self, name, description, brand_section, images, sizes, price, status="available"):
        self.name = name
        self.description = description
        self.brand_section = brand_section
        self.images = images  # List of image URLs
        self.sizes = sizes    # List of available sizes
        self.price = price
        self.status = status  # "available", "coming_soon", "out_of_stock"

    def to_dict(self):
        return {
            "name": self.name,
            "description": self.description,
            "brand_section": self.brand_section,
            "images": self.images,
            "sizes": self.sizes,
            "price": self.price,
            "status": self.status
        }

    @staticmethod
    def from_dict(data):
        return Product(
            name=data.get("name"),
            description=data.get("description"),
            brand_section=data.get("brand_section"),
            images=data.get("images", []),
            sizes=data.get("sizes", []),
            price=data.get("price"),
            status=data.get("status", "available")
        )

class Message:
    def __init__(self, name, email, message, created_at=None):
        self.name = name
        self.email = email
        self.message = message
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self):
        return {
            "name": self.name,
            "email": self.email,
            "message": self.message,
            "created_at": self.created_at
        }

    @staticmethod
    def from_dict(data):
        return Message(
            name=data.get("name"),
            email=data.get("email"),
            message=data.get("message"),
            created_at=data.get("created_at")
        )
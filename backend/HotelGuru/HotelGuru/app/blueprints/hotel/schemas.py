from marshmallow import Schema, fields
from app.blueprints.room.schemas import RoomResponseSchema

class HotelRequestSchema(Schema):
    """Séma hotel létrehozásához vagy frissítéséhez"""
    name = fields.String(required=True)
    address_id = fields.Integer(required=True)

class HotelResponseSchema(Schema):
    """Séma a hotel adatainak visszaadásához"""
    id = fields.Integer()
    name = fields.String()
    address_id = fields.Integer()

class RoomSearchQuerySchema(Schema):
    """Séma a szabad szobák kereséséhez"""
    start_date = fields.Date(required=True)
    end_date = fields.Date(required=True)
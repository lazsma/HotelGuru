from marshmallow import Schema, fields
from apiflask.validators import OneOf
from enum import Enum

# Enumok a szobatípusokhoz és szolgáltatásokhoz
class RoomType(str, Enum):
    SINGLE = "Egyágyas"
    TWIN = "Kétágyas"
    DOUBLE = "Duplaágyas"

class RoomServiceEnum(str, Enum):
    WELLNESS = "Wellness"
    MASSAGE = "Masszázs"
    ROOM_SERVICE = "Szobaszerviz"
    MINIBAR = "Minibár"

class RoomRequestSchema(Schema):
    is_available = fields.Boolean(load_default=True)
    status = fields.String(allow_none=True)
    note = fields.String(allow_none=True)
    location = fields.String(allow_none=True)
    room_number = fields.String(required=True)
    price = fields.Float(required=True)
    room_type = fields.String(validate=OneOf([e.value for e in RoomType]), required=True)
    hotel_id = fields.Integer(required=True)
    capacity = fields.Integer(required=True)
    # Generikus szolgáltatások listaként (opcionális)
    services = fields.List(fields.String(validate=OneOf([e.value for e in RoomServiceEnum])), allow_none=True)

class RoomResponseSchema(Schema):
    id = fields.Integer()
    is_available = fields.Boolean()
    status = fields.String()
    note = fields.String()
    location = fields.String()
    room_number = fields.String()
    price = fields.Float()
    room_type = fields.String()
    hotel_id = fields.Integer()
    capacity = fields.Integer()
    services = fields.List(fields.String())

# Sémák a részleges frissítésekhez (update és status)
class RoomUpdateDetailsSchema(Schema):
    price = fields.Float(required=True)
    location = fields.String(allow_none=True)
    room_type = fields.String(validate=OneOf([e.value for e in RoomType]), required=True)

class RoomStatusSchema(Schema):
    is_available = fields.Boolean(required=True)
    status = fields.String(allow_none=True)
    note = fields.String(allow_none=True)
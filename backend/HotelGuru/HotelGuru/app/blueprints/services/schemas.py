from marshmallow import Schema, fields
from apiflask.fields import Integer, String, Float,Boolean


class ServiceResponseSchema(Schema):
    id: fields.Integer
    name: fields.String
    price:fields.Float
    active:fields.Boolean

class ServiceUpdateSchema(Schema):
    name:fields.String
    price = fields.Float(required=True)
    location = fields.String(allow_none=True)
    active:fields.Boolean

from email.policy import default
from marshmallow import Schema, fields
from apiflask.fields import String, Email, Nested, Integer, List
from apiflask.validators import Length, OneOf, Email
from app.models.user import User

class RoleSchema(Schema):
    id = fields.Integer()
    name = fields.String()
    
class AddressSchema(Schema):
    city= fields.String()
    street= fields.String()
    postalcode = fields.Integer()

class UserRequestSchema(Schema):
    name = fields.String()
    email = String(validate=Email())
    szemely_igazolvany_szam=fields.Integer()
    password = fields.String()
    phone = fields.String()
    address = fields.Nested(AddressSchema)

class PayloadSchema(Schema):
    user_id = fields.Integer()
    roles  = fields.List(fields.Nested(RoleSchema))
    exp = fields.Integer()

class UserResponseSchema(Schema):
    id = fields.Integer()
    name = fields.String()
    szemely_igazolvany_szam=fields.Integer()
    email = fields.String()
    phone = fields.String()
    hotel_id = fields.Integer(allow_none=True)
    roles = fields.List(fields.Nested(RoleSchema))
    address = fields.Nested(AddressSchema)
    token = fields.String()
 
class UserLoginSchema(Schema):
    email = String(validate=Email())
    password = fields.String()
    


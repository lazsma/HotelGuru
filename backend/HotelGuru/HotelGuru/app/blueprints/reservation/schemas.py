from marshmallow import Schema, fields
from apiflask.fields import String, Email, Nested, Integer, List
from apiflask.validators import Length, OneOf, Email

class ReservationRequestSchema(Schema):
    user_id = fields.Integer()
    room_id = fields.Integer()
    check_in_date = fields.Date()
    check_out_date = fields.Date()
    
class ReservationResponseSchema(Schema):
    id = fields.Integer()
    user_id = fields.Integer() # TODO: Return Nested UserResponseSchema instead of user_id
    room_id = fields.Integer() # TODO: Return Nested RoomResponseSchema instead of room_id
    reservation_datetime = fields.String()
    check_in_date = fields.String()
    check_out_date = fields.String()

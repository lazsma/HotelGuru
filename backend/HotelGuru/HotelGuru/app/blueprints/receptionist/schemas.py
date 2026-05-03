from marshmallow import Schema
from apiflask.fields import Integer, String, Float

class ReceptionistDashboardSchema(Schema):
    id = Integer()
    guestName = String(attribute="user.name")
    roomNumber = String(attribute="room.room_number")
    checkIn = String(attribute="check_in_date")
    checkOut = String(attribute="check_out_date")
    status = String(attribute="status.name")

class StatusUpdateSchema(Schema):
    status = String(required=True)

class InvoiceResponseSchema(Schema):
    reservation_id = Integer()
    user_id = Integer()
    room_id = Integer()
    nights = Integer()
    room_cost = Float()
    extra_cost = Float()
    total_cost = Float()
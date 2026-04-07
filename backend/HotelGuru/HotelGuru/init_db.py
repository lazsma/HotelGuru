
from __future__ import annotations
from datetime import datetime, date

from app import db
from app import create_app
from config import Config

app = create_app(config_class=Config)
app.app_context().push()

# Clear existing data
meta = db.metadata
for table in reversed(meta.sorted_tables):
    db.session.execute(table.delete())
db.session.commit()

#Role
from app.models.role import Role

db.session.add_all([ Role(name="Administrator"), 
                     Role(name="Receptionist"), 
                     Role(name="Janitor"), 
                     Role(name="User") ])
db.session.commit()
    
#Address
from app.models.address import Address
db.session.add(Address( city = "Veszprem",  street = "Egyetem u. 1", postalcode=8200))
db.session.commit()

#User
from app.models.user import User, UserRole
db.session.add(User(
    name="Admin", 
    email="admin@hotelguru.com", 
    szemely_igazolvany_szam=12345678, 
    password="adminpass", 
    phone="1234567890", 
    address_id=1, 
    hotel_id=1)
)
db.session.commit()

#Hotel
from app.models.hotel import Hotel
db.session.add(Hotel(name="Hotel Teszt", address=db.session.get(Address, 1)))

#Room
from app.models.room import Room
db.session.add_all([
    Room(
        room_number="101", 
        price=10000,
        capacity=1,
        room_description="Room with one bed",
        hotel=db.session.get(Hotel, 1)
    ), 
    Room(
        room_number="201", 
        price=10000, 
        capacity=2,
        room_description="Room with two beds",
        hotel=db.session.get(Hotel, 1)
    )
])
db.session.commit()

#Reservation
from app.models.reservation import Reservation
db.session.add(Reservation(
    user_id=1, 
    room_id=1, 
    check_in_date=date.today(), 
    check_out_date=date.today(),
    reservation_datetime=datetime.now()
))
db.session.commit()

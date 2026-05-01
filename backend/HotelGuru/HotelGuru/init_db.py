from __future__ import annotations
from datetime import datetime, date
import stat

from app import db
from app import create_app
from config import Config

app = create_app(config_class=Config)
app.app_context().push()

db.drop_all()
db.create_all()

# Role
from app.models.role import Role
db.session.add_all([ 
    Role(name="Administrator"), 
    Role(name="Receptionist"), 
    Role(name="Janitor"), 
    Role(name="User") 
])
db.session.commit()

# Address
from app.models.address import Address
addr1 = Address(city="Veszprem", street="Egyetem u. 1", postalcode=8200)
addr2 = Address(city="Budapest", street="Vaci ut 45", postalcode=1134)
addr3 = Address(city="Balatonfured", street="Parti setany 10", postalcode=8230)
db.session.add_all([addr1, addr2, addr3])
db.session.commit()

# Hotel
from app.models.hotel import Hotel
hotel1 = Hotel(name="Hotel Guru Veszprem", address=addr1)
hotel2 = Hotel(name="Grand Hotel Budapest", address=addr2)
hotel3 = Hotel(name="Balaton Wellness Resort", address=addr3)
db.session.add_all([hotel1, hotel2, hotel3])
db.session.commit()

# User
from app.models.user import User, UserRole
admin_user = User(
    name="Admin", 
    email="admin@hotelguru.com", 
    szemely_igazolvany_szam=12345678, 
    password="adminpass", 
    phone="1234567890", 
    address_id=addr1.id, 
    hotel_id=hotel1.id
)
db.session.add(admin_user)
db.session.commit()

# Room
from app.models.room import Room
room1 = Room(room_number="101", price=15000, room_type="Standard", is_available=True, status=None, hotel=hotel1)
db.session.add_all([
    room1, 
    Room(room_number="102", price=15000, room_type="Standard", is_available=False, status="Maintenance", hotel=hotel1),
    Room(room_number="103", price=25000, room_type="Premium", is_available=True, status=None, hotel=hotel1),
    
    Room(room_number="201", price=30000, room_type="Business", is_available=True, status=None, hotel=hotel2),
    Room(room_number="202", price=30000, room_type="Business", is_available=False, status="Cleaning", hotel=hotel2),
    Room(room_number="VIP-1", price=75000, room_type="Suite", is_available=True, status=None, hotel=hotel2),

    Room(room_number="301", price=20000, room_type="Family", is_available=True, status=None, hotel=hotel3),
    Room(room_number="302", price=20000, room_type="Family", is_available=True, status=None, hotel=hotel3)
])
db.session.commit()

#Reservation
from app.models.reservation import Reservation, StatusEnum
db.session.add(Reservation(
    user_id=admin_user.id, 
    room_id=room1.id, 
    check_in_date=date.today(), 
    check_out_date=date.today(),
    reservation_datetime=datetime.now(),
    status=StatusEnum.New,
    people=1
))
db.session.commit()

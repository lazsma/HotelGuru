from app.extensions import db, Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import String, Integer
from sqlalchemy import ForeignKey, Column, Table
from typing import List, Optional

from werkzeug.security import generate_password_hash, check_password_hash


#több - több kapcsolat miatt kell ez a tabla
UserRole = Table(
    "userroles",
    Base.metadata,
    Column("user_id", ForeignKey("users.id")),
    Column("role_id", ForeignKey("roles.id"))
)

#foglaláshoz -----------tábla és id neveket át kell írni

# UserReservation = Table(
#     "userreservations",
#     Base.metadata,
#     Column("user_id", ForeignKey("users.id")),
#     Column("role_id", ForeignKey("roles.id"))
# )

class User(db.Model):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(String(30))
    email: Mapped[str] = mapped_column(String(50), unique=True)

    szemely_igazolvany_szam : Mapped[int]

    password: Mapped[str] = mapped_column(String(30))
    phone : Mapped[str] = mapped_column(String(30))
   
    roles: Mapped[List["Role"]] = relationship(secondary=UserRole, back_populates="users")
    
   # ------------ki melyik hotelben dolgozik....hotel user kapcsolat--------------------
    hotel_id : Mapped[Optional[int]] = mapped_column(ForeignKey("hotels.id"))
    hotel : Mapped[Optional["Hotel"]] = relationship(back_populates="users",lazy=True) #lazy=True 
   
    # Foglalás
    reservations: Mapped[List["Reservation"]] = relationship(back_populates="user", lazy=True)

    address_id: Mapped[int] = mapped_column(ForeignKey("addresses.id"))
    address : Mapped["Address"] = relationship(back_populates="user", lazy=True)
    
    def __repr__(self) -> str:
        return f"User(id={self.id!r}, name={self.name!s}, email={self.email!r})"
    
    def set_password(self, password):
        self.password = generate_password_hash(password)
        
    def check_password(self, password):
        return check_password_hash(self.password, password)

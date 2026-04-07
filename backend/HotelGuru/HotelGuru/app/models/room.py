from __future__ import annotations

from typing import List

from sqlalchemy import ForeignKey  
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import String

from app.extensions import db
from app.models.user import UserRole

class Room(db.Model):
    __tablename__ = "rooms"
    id: Mapped[int] = mapped_column(primary_key=True)
    room_number: Mapped[str] = mapped_column(String(30))
    price: Mapped[float] = mapped_column()
    capacity: Mapped[int] = mapped_column()
    room_description: Mapped[str] = mapped_column(String(255))
    
    hotel_id: Mapped[int] = mapped_column(ForeignKey("hotels.id"), nullable=False)
    hotel: Mapped[List["Hotel"]] = relationship(back_populates="rooms")
    
    reservations: Mapped[List["Reservation"]] = relationship(back_populates="room", lazy=True)

    def __repr__(self) -> str:
        return f"Room(id={self.id!r}, number={self.room_number!s}, price={self.price!r})"

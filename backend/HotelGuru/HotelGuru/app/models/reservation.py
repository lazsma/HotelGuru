from __future__ import annotations
from datetime import datetime, date
from app.extensions import db
from sqlalchemy import ForeignKey  
from sqlalchemy.orm import Mapped, mapped_column, relationship
import sqlalchemy.types as SATypes
from typing import List, Optional

class Reservation(db.Model):
    __tablename__ = "reservations"
    
    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    user: Mapped["User"] = relationship(back_populates="reservations")

    room_id: Mapped[int] = mapped_column(ForeignKey("rooms.id"), nullable=False)
    room: Mapped["Room"] = relationship(back_populates="reservations")

    reservation_datetime: Mapped[datetime] = mapped_column(SATypes.DateTime, default=datetime.now())
    check_in_date: Mapped[date] = mapped_column(SATypes.Date)
    check_out_date: Mapped[date] = mapped_column(SATypes.Date)

    def __repr__(self) -> str:
        return f"Reservation(id={self.id}, \
        user_id={self.user_id!r}, \
        room_id={self.room_id!r}, \
        checkin={self.check_in_date:%Y.%m.%d!s}, \
        checkout={self.check_out_date:%Y.%m.%d!s})"
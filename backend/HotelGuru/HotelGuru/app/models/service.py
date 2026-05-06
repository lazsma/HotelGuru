from app.extensions import db, Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.types import String, Integer,Float
from sqlalchemy import ForeignKey, Column, Table
from typing import List, Optional


RoomService = Table(
    "roomroomservice",
    Base.metadata,
    Column("room_id", ForeignKey("rooms.id")),
    Column("roomservice_id", ForeignKey("roomservice.id"))
)

class Service(db.Model):
    __tablename__ = "roomservice"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50))
    
    # Ár
    price: Mapped[float] = mapped_column(Float)     

    # Active?
    active: Mapped[bool] = mapped_column(Boolean, default=False) 

    rooms: Mapped[List["Room"]] = relationship(secondary=RoomService, back_populates="roomservices")

    def __repr__(self) -> str:
        return f"Service(id={self.id}, name={self.name!r}, price={self.price!r},active={self.active!r}"

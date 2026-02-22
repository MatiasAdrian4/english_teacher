from datetime import datetime
from typing import Literal

from pydantic import BaseModel, EmailStr


class BookingCreate(BaseModel):
    slot_id: int
    name: str
    email: EmailStr
    phone: str
    payment_method: Literal["mercadopago", "paypal"]


class BookingRead(BookingCreate):
    id: int
    booking_reference: str
    created_at: datetime

    model_config = {"from_attributes": True}

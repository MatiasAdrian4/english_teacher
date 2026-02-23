import random
import string
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


def _generate_reference() -> str:
    """Generate a random 6-character alphanumeric booking reference."""
    chars = string.ascii_uppercase + string.digits
    return "".join(random.choices(chars, k=6))


class Booking(Base):
    __tablename__ = "bookings"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    booking_reference: Mapped[str] = mapped_column(
        String(6), nullable=False, default=_generate_reference, index=True, unique=True
    )
    slot_id: Mapped[int] = mapped_column(ForeignKey("slots.id"), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(150), nullable=False)
    payment_method: Mapped[str] = mapped_column(
        String(20), nullable=False
    )  # "mercadopago" | "paypal"
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

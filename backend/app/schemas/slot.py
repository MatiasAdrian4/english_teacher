from datetime import datetime

from pydantic import BaseModel


class SlotBase(BaseModel):
    start_time: datetime
    end_time: datetime
    is_available: bool = True


class SlotCreate(SlotBase):
    pass


class SlotRead(SlotBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, computed_field

Level = Literal[
    "beginner",
    "pre-intermediate",
    "intermediate",
    "upper-intermediate",
    "advanced",
    "proficient",
]


class SlotBase(BaseModel):
    title: str
    description: str | None = None
    start_time: datetime
    end_time: datetime
    price: float
    required_level: Level
    max_students: int = 1
    is_available: bool = True


class SlotCreate(SlotBase):
    pass


class SlotRead(SlotBase):
    id: int
    created_at: datetime

    @computed_field
    @property
    def class_type(self) -> str:
        return "grupal" if self.max_students > 1 else "individual"

    model_config = {"from_attributes": True}

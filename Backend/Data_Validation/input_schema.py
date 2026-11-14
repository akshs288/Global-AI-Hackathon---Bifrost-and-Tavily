from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import date

class Model1(BaseModel):

    model_config = ConfigDict(extra="ignore")

    company_name: str = Field(..., min_length=1)

    user_role: Optional[str] = None

    agenda: str = Field(..., min_length=2)

    participants: list[str] = Field(
        default_factory=list
    )

    meeting_date: Optional[date] = None

    meeting_type: Optional[str] = None

    expected_duration_minutes: Optional[int] = Field(
        default=None,
        gt=0
    )

    location: Optional[str] = None
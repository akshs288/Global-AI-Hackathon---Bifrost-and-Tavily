from pydantic import BaseModel,Field
from typing import Optional
from datetime import datetime

class Model1(BaseModel):
    company_name : str = Field(...,min_length=1)
    agenda: str= Field(...,min_length=2)
    participants: list[str] = Field(default_factory=list)
    
    meeting_datetime : Optional[datetime] = None
    meeting_type:Optional[str] = None
    
    expected_duration_minutes:Optional[int] = Field(default=None)   # This should be integer of minutes how many minutes
    
    location:Optional[str] = None


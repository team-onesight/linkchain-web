from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class LinkResponse(BaseModel):
    link_id: int
    url: str
    title: Optional[str]
    description: Optional[str]
    views: int
    created_by: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True

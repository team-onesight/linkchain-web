from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class LinkResponse(BaseModel):
    link_id: UUID
    url: str
    title: Optional[str]
    description: Optional[str]

    class Config:
        from_attributes = True


class CreateLinkRequest(BaseModel):
    url: str

class CreateLinkResponse(BaseModel):
    link_id: str
    user_id: int

    class Config:
        from_attributes = True

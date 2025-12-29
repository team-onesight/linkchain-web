from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel

from schemas.tag import TagResponse


class LinkResponse(BaseModel):
    link_id: UUID
    url: str
    title: Optional[str]
    description: Optional[str]
    tags: List[TagResponse] = []

    class Config:
        from_attributes = True

class LinkViewRegisterResponse(BaseModel):
    message: str

    class Config:
        from_attributes = True


class CreateLinkRequest(BaseModel):
    url: str

class CreateLinkResponse(BaseModel):
    link_id: str
    user_id: int

    class Config:
        from_attributes = True

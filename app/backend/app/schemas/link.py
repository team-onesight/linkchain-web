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
    created_by_user_id: Optional[int]
    created_by_username: Optional[str]

    class Config:
        from_attributes = True


class LinkDetailResponse(BaseModel):
    link_id: UUID
    url: str
    title: Optional[str]
    description: Optional[str]
    views: int
    created_by_user_id: Optional[int]
    created_by_username: Optional[str]
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

class SearchLinkResponse(BaseModel):
    items: List[LinkResponse]
    total: int
    page: int
    size: int
    total_pages: int

    class Config:
        from_attributes = True

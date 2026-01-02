from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class GroupItem(BaseModel):
    """
    Group에 들어갈 link item 정의
    """

    link_id: UUID
    url: str
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    views: int
    created_at: datetime

    class Config:
        from_attributes = True


class GroupResponse(BaseModel):
    """
    Date별 user link history 그룹 정의
    """
    group_title: str
    items: list[GroupItem]
from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel

from schemas.tag import TagResponse


class GroupItem(BaseModel):
    """
    Group에 들어갈 개별 link item 정의
    """

    link_id: UUID
    url: str
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    views: int
    created_at: datetime
    created_by_user_id: Optional[int]
    created_by_username: Optional[str]
    tags: List[TagResponse] = []

    class Config:
        from_attributes = True


class GroupResponse(BaseModel):
    """
    그룹별 링크 목록 및 메타데이터 응답 모델
    """

    group_id: int
    group_title: str
    total_links: int
    items: List[GroupItem]

    class Config:
        from_attributes = True

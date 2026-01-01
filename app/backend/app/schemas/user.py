from datetime import date, datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class UserRequest(BaseModel):
    """
    user 요청값  정의
    """

    username: str
    password: str

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    """
    user에게 응답값 정의
    """

    user_id: int
    username: str

    class Config:
        from_attributes = True


class UserLinkHistoryRequest(BaseModel):
    """
    user link history 요청값 정의
    """

    user_id: int

    class Config:
        from_attributes = True


class UserLinkHistoryItem(BaseModel):
    """
    user link history item 정의
    """

    link_id: UUID
    url: str
    title: Optional[str] = None
    description: Optional[str] = None
    views: int
    created_at: datetime # 최근 방문 시점

    class Config:
        from_attributes = True


class UserLinkHistoryGroup(BaseModel):
    """
    Date별 user link history 그룹 정의
    """
    date: date
    items: list[UserLinkHistoryItem]

class UserLinkHistoryResponse(BaseModel):
    """
    user link history 응답값 정의
    """
    total: int
    link_groups: list[UserLinkHistoryGroup]
    
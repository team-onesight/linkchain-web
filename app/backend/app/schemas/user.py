from datetime import datetime
from pydantic import BaseModel
from uuid import UUID

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
    title: str
    description: str
    views: int
    created_at: datetime

    class Config:
        from_attributes = True


class UserLinkHistoryResponse(BaseModel):
    """
    user link history 응답값 정의
    """
    links: list[UserLinkHistoryItem]
    total: int
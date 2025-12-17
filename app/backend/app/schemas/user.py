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

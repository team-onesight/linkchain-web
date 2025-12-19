from pydantic import BaseModel


class LoginRequest(BaseModel):
    username: str
    password: str

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    user_id: int
    username: str

    class Config:
        from_attributes = True


class LogoutResponse(BaseModel):
    message: str

    class Config:
        from_attributes = True


class AuthCheckResponse(BaseModel):
    user_id: int
    username: str

    class Config:
        from_attributes = True

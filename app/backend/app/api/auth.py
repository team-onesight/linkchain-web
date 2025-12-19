from typing import Annotated, Callable

from core.deps import get_di_user_service, get_user_session
from fastapi import APIRouter, Depends, HTTPException, Request
from schemas.auth import AuthCheckResponse, LoginRequest, LoginResponse, LogoutResponse
from schemas.user import UserRequest, UserResponse
from services.user import UserService

router = APIRouter()


@router.post("/auth/join", response_model=UserResponse)
def create_user(
    user_req: UserRequest,
    service: Annotated[UserService, Depends(get_di_user_service)],
):
    """
    Docstring for create_user

    :param user_req: Description
    :type user_req: UserRequest
    :param service: Description
    :type service: UserService
    """
    try:
        new_user = service.join_user(user_req.username, user_req.password)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e)) from e

    return UserResponse.from_orm(new_user)


@router.post("/auth/login", response_model=LoginResponse)
def login(
    login_req: LoginRequest,
    service: Annotated[UserService, Depends(get_di_user_service)],
    create_user_session: Annotated[Callable, Depends(get_user_session)],
):
    """
    login기능
    :param login_req: Description
    :type login_req: LoginRequest
    :param service: 의존성이 주입된 userservice
    :type service: Annotated[UserService, Depends(get_di_user_service)]
    :param create_user_session: 의존성이 주입된 user session 생성 메소드
    :type create_user_session: Annotated[Callable, Depends(get_user_session)]
    """
    try:
        login_user = service.login(login_req.username, login_req.password)
        create_user_session(login_user)

        return LoginResponse(user_id=login_user.user_id, username=login_user.username)
    except Exception as e:
        print(e)
        raise HTTPException(status_code=401, detail="invalid credentials") from e


@router.post("/auth/logout", response_model=LogoutResponse)
def logout(request: Request):
    request.session.clear()

    return LogoutResponse(message="logout success")


@router.get("/auth", response_model=AuthCheckResponse)
def get_auth(request: Request):
    """
    세션 유효성 검증
    :param request: Description
    :type request: Request
    """
    session_user = request.session.get("user")
    if not session_user:
        raise HTTPException(status_code=401, detail="Not authenticated")

    return AuthCheckResponse(
        user_id=session_user["user_id"], username=session_user["username"]
    )

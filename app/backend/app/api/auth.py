from typing import Annotated

from core.deps import get_di_user_service
from fastapi import APIRouter, Depends, HTTPException
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

from typing import Annotated

from core.deps import get_di_user_service
from fastapi import APIRouter, Depends, HTTPException, Request
from schemas.user import UserResponse
from services.user import UserService

router = APIRouter(prefix="/users")


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: str,
    service: Annotated[UserService, Depends(get_di_user_service)],
):
    print(user_id)
    user = service.get_user_by_id(user_id)

    return UserResponse(  # TODO need to add more fields link Related Links
        user_id=user.user_id,
        username=user.username,
    )


def _get_user_session_from_request(
    request: Request,
):
    user_session = request.session.get("user")
    if not user_session:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return user_session

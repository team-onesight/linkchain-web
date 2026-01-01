from typing import Annotated, Optional

from core.deps import get_di_link_service, get_di_user_service
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from schemas.common import Page
from schemas.link import LinkResponse
from schemas.user import UserResponse
from services.link import LinkService
from services.user import UserService

router = APIRouter(prefix="/users")


@router.get("/{user_id}", response_model=UserResponse)
def get_user(
    user_id: int,
    service: Annotated[UserService, Depends(get_di_user_service)],
):
    user = service.get_user_by_id(user_id)

    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    return UserResponse(
        user_id=user.user_id,
        username=user.username,
    )


@router.get("/{user_id}/links", response_model=Page[LinkResponse])
def get_user_links(
    user_id: int,
    service: Annotated[LinkService, Depends(get_di_link_service)],
    cursor: Annotated[
        Optional[int], Query(description="마지막으로 받은 map_id")
    ] = None,
    size: Annotated[int, Query(ge=1, le=100)] = 20,
):
    return service.get_links(user_id, cursor, size)


def _get_user_session_from_request(
    request: Request,
):
    user_session = request.session.get("user")
    if not user_session:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return user_session

import logging
from typing import Annotated, Optional

from core.deps import get_di_link_service
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from schemas.common import Page
from schemas.link import CreateLinkRequest, LinkResponse
from core.deps import get_di_link_service, get_current_user_from_session
from fastapi import APIRouter, Depends, HTTPException
from schemas.link import CreateLinkRequest, CreateLinkResponse, LinkResponse
from services.link import LinkService

from api.session_utils import get_user_id_from_session

router = APIRouter(prefix="/links")


@router.get("/my", response_model=Page[LinkResponse])
def get_my_links(
    request: Request,
    service: Annotated[LinkService, Depends(get_di_link_service)],
    cursor: Annotated[
        Optional[int], Query(description="마지막으로 받은 map_id")
    ] = None,
    size: Annotated[int, Query(ge=1, le=100)] = 20,
):
    user_id = get_user_id_from_session(request)
    return service.get_links(user_id, cursor, size)


@router.get("/{link_id}", response_model=LinkResponse)
def read_link(
    link_id: str,
    service: Annotated[LinkService, Depends(get_di_link_service)],
):
    if not link_id:
        raise HTTPException(status_code=400, detail="Invalid link")

    link = service.get_link(int(link_id))

    if not link:
        raise HTTPException(status_code=404, detail="Link not found")

    return link


@router.post("", response_model=CreateLinkResponse)
def create_link(
    create_link_request: CreateLinkRequest,
    service: Annotated[LinkService, Depends(get_di_link_service)],
    current_user: Annotated[dict, Depends(get_current_user_from_session)]
):
    current_user_id = current_user["user_id"]
    link = service.create_link(url=create_link_request.url, user_id=current_user_id)

    if not link:
        raise HTTPException(status_code=409, detail="Link already exists")

    return CreateLinkResponse(link_id=str(link.link_id), user_id=link.user_id)


"""
@router.get("/links/{link_id}", response_model=LinkResponse)
def read_link(link_id: str, db: Session = Depends(get_db)):
    if not link_id:
        raise HTTPException(status_code=400, detail="Invalid link")

    service = LinkService(db)
    link = service.get_link(int(link_id))
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    return link
"""

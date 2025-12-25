import logging
from typing import Annotated, Optional

from core.deps import get_di_link_service
from fastapi import APIRouter, Depends, HTTPException, Query, Request
from schemas.common import Page
from schemas.link import CreateLinkRequest, LinkResponse
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


@router.post("", response_model=dict)
def create_link(body: CreateLinkRequest):
    logging.warn("Creating link with data: %s", body)
    return {
        "link_id": 1,
        "url": body.url,
        "title": body.title,
        "description": body.description,
    }

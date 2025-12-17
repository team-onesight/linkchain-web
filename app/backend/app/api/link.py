import logging

from core.deps import get_di_link_service
from fastapi import APIRouter, Depends, HTTPException
from schemas.link import CreateLinkRequest, LinkResponse
from services.link import LinkService

router = APIRouter()


@router.get("/links/{link_id}", response_model=LinkResponse)
def read_link(link_id: str, service: LinkService = Depends(get_di_link_service)):
    if not link_id:
        raise HTTPException(status_code=400, detail="Invalid link")

    link = service.get_link(int(link_id))

    if not link:
        raise HTTPException(status_code=404, detail="Link not found")

    return link


@router.post("/links", response_model=dict)
def create_link(body: CreateLinkRequest):
    logging.warn("Creating link with data: %s", body)
    return {
        "link_id": 1,
        "url": body.url,
        "title": body.title,
        "description": body.description,
    }


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

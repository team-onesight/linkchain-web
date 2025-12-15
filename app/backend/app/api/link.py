from fastapi import APIRouter, Depends, HTTPException

from core.deps import get_di_link_service
from schemas.link import LinkResponse
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

'''
@router.get("/links/{link_id}", response_model=LinkResponse)
def read_link(link_id: str, db: Session = Depends(get_db)):
    if not link_id:
        raise HTTPException(status_code=400, detail="Invalid link")

    service = LinkService(db)
    link = service.get_link(int(link_id))
    if not link:
        raise HTTPException(status_code=404, detail="Link not found")
    return link
'''

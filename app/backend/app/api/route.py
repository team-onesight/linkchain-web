from fastapi import APIRouter

from api import auth, link

endpoint_router = APIRouter()

endpoint_router.include_router(link.router, prefix="/links", tags=["links"])
endpoint_router.include_router(auth.router, prefix="/auth", tags=["auth"])
# endpoint_router.include_router(users.router, prefix="/users", tags=["users"])

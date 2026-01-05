import time

from fastapi import Request
from starlette.responses import JSONResponse, Response


async def dispatch(request: Request, call_next) -> Response:
    # 인증 제외 경로
    public_paths = (
        "/api/v1/groups",
        "/api/v1/links",
        "/docs",
        "/openapi.json",
        "/api/v1/auth/join",
        "/api/v1/auth/login",
    )
    if any(request.url.path.startswith(path) for path in public_paths):
        return await call_next(request)

    session = request.session
    user = session.get("user")
    expired_time = session.get("expired_time")

    if not user or not expired_time:
        return JSONResponse(status_code=401, content={"detail": "Not authenticated"})

    now = int(time.time())
    if expired_time < now:
        session.clear()
        return JSONResponse(
            status_code=401,
            content={"detail": "Session expired"},
        )

    session["expired_time"] = now + (60 * 60)

    response: Response = await call_next(request)
    return response

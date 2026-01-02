from fastapi import HTTPException


def get_session(request):
    user_session = request.session.get("user")
    if not user_session:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return user_session

def get_user_id_from_session(request):
    user_session = get_session(request)
    return user_session["user_id"]

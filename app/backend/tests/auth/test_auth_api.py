def test_login_success(client):
    """
    login 테스트
    :param client: Description
    """
    payload = {"username": "test", "password": "test"}
    res = client.post("/api/v1/auth/login", json=payload)

    assert res.status_code == 200
    assert res.json()["message"] == "login success"


def test_login_fail(client):
    """
    user 정보 불일치시 login fail
    :param client: Description
    """
    payload = {"username": "wrong", "password": "wrong"}
    res = client.post("/api/v1/auth/login", json=payload)

    assert res.status_code == 401
    assert res.json()["detail"] == "invalid credentials"


def test_logout(client):
    """
    logout test -> session 삭제
    :param client: Description
    """
    payload = {"username": "test", "password": "test"}
    res = client.post("/api/v1/auth/login", json=payload)

    res = client.post("/api/v1/auth/logout")
    assert res.status_code == 200
    assert res.json()["message"] == "logout success"

    res = client.get("/api/v1/auth")
    assert res.status_code == 401


def test_auth_check_requires_login(client):
    """
    login상태 아닐때 session 유효성검사
    :param client: Description
    """
    res = client.get("/api/v1/auth")

    assert res.status_code == 401
    

def test_get_auth_authenticated(client):
    """
    login 후 session 유효성검사
    :param client: Description
    """
    payload = {"username": "test", "password": "test"}
    res = client.post("/api/v1/auth/login", json=payload)

    res = client.get("/api/v1/auth")
    data = res.json()

    assert res.status_code == 200
    assert data["authenticated"] is True
    assert data["user_id"] == 1
    assert data["username"] == "test"

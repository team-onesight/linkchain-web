from fastapi.testclient import TestClient
from main import app


def test_join_is_excluded_from_auth_middleware():
    client = TestClient(app)

    response = client.post("/api/v1/auth/join", json={})

    assert response.status_code == 422


def test_protected_path_without_session():
    client = TestClient(app)

    response = client.get("/api/v1/auth")

    assert response.status_code == 401
    assert response.json()["detail"] == "Not authenticated"

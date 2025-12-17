# api/join 테스트

def test_create_user_api(client):
    response = client.post("/api/v1/join", json={"username": "testuser_api", "password": "123456"})
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == "testuser_api"

def test_create_user_duplicate_api(client):
    client.post("/api/v1/join", json={"username": "duplicate_api", "password": "123456"})
    response = client.post("/api/v1/join", json={"username": "duplicate_api", "password": "123456"})
    assert response.status_code == 400
    assert response.json()["detail"] == "user already exists"


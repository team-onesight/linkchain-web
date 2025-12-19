# def test_unauthenticated_request_returns_401(client):
#     res = client.get("/api/v1/auth")

#     assert res.status_code == 401
#     assert res.json()["detail"] == "Not authenticated"

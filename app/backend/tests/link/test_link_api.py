from unittest.mock import MagicMock

import pytest
from core.deps import get_current_user_from_session, get_di_link_service
from fastapi.testclient import TestClient


@pytest.fixture
def mock_link_service():
    return MagicMock()


@pytest.fixture
def client(mock_link_service):
    """
    테스트용 클라이언트 - middleware 없이 dependency만 주입
    """
    # 테스트용 앱 생성 (middleware 제외) -> 미들웨어 인증을 하면 401 에러 발생
    from fastapi import FastAPI
    from api import link
    
    test_app = FastAPI()
    test_app.include_router(link.router, prefix="/api/v1", tags=["v1"])
    
    # Service mock
    test_app.dependency_overrides[get_di_link_service] = lambda: mock_link_service
    
    # session 주입 user mock
    test_app.dependency_overrides[get_current_user_from_session] = (
        lambda: {"user_id": 1, "username": "test"}
    )
    
    with TestClient(test_app) as client:
        yield client
    
    test_app.dependency_overrides.clear()


def test_create_link_success(client, mock_link_service):
    # given
    mock_link_service.create_link.return_value = MagicMock(
        link_id="abc",
        user_id=1,
    )

    # when
    response = client.post(
        "/api/v1/links",
        json={"url": "https://namu.wiki"},
    )

    # then
    assert response.status_code == 200
    assert response.json() == {
        "link_id": "abc",
        "user_id": 1,
    }

    mock_link_service.create_link.assert_called_once_with(
        url="https://namu.wiki",
        user_id=1,
        username="test"
    )


def test_create_link_conflict(client, mock_link_service):
    # given
    mock_link_service.create_link.return_value = None

    # when
    response = client.post(
        "/api/v1/links",
        json={"url": "https://namu.wiki"},
    )

    # then
    assert response.status_code == 409
    assert response.json()["detail"] == "Link already exists"

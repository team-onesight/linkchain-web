from unittest.mock import MagicMock

import pytest
from fastapi.testclient import TestClient

from core.deps import get_di_user_service, get_user_session
from main import app


@pytest.fixture
def mock_user_service():
    return MagicMock()


@pytest.fixture
def mock_create_user_session():
    return MagicMock()


@pytest.fixture
def client(mock_user_service, mock_create_user_session):
    app.dependency_overrides[get_di_user_service] = lambda: mock_user_service
    app.dependency_overrides[get_user_session] = lambda: mock_create_user_session

    with TestClient(app) as client:
        yield client

    app.dependency_overrides.clear()


def test_join_user_success(client, mock_user_service):
    # given
    mock_user_service.join_user.return_value = MagicMock(
        user_id=1,
        username="test",
    )

    # when
    response = client.post(
        "/api/v1/auth/join",
        json={"username": "test", "password": "test"},
    )

    # then
    assert response.status_code == 200
    assert response.json()["username"] == "test"

    mock_user_service.join_user.assert_called_once_with(
        "test",
        "test",
    )


def test_join_user_duplicate(client, mock_user_service):
    # given
    mock_user_service.join_user.side_effect = ValueError("user already exists")

    # when
    response = client.post(
        "/api/v1/auth/join",
        json={"username": "test", "password": "test"},
    )

    # then
    assert response.status_code == 400
    assert response.json()["detail"] == "user already exists"


def test_login_success(client, mock_user_service, mock_create_user_session):
    # given
    mock_user_service.login.return_value = MagicMock(
        user_id=1,
        username="test",
    )

    # when
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "test", "password": "test"},
    )

    # then
    assert response.status_code == 200
    assert response.json()["username"] == "test"

    mock_create_user_session.assert_called_once()


def test_login_invalid_credentials(client, mock_user_service):
    # given
    mock_user_service.login.side_effect = ValueError("invalid credentials")

    # when
    response = client.post(
        "/api/v1/auth/login",
        json={"username": "test", "password": "1234"},
    )

    # then
    assert response.status_code == 401
    assert response.json()["detail"] == "invalid credentials"

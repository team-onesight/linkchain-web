from unittest.mock import MagicMock, patch

import pytest
from services.user import UserService


@pytest.fixture
def user_repository():
    return MagicMock()


@pytest.fixture
def service(user_repository):
    return UserService(user_repository=user_repository)


def test_join_user_success(service, user_repository):
    # given
    user_repository.get_user_by_username.return_value = None
    user_repository.create_user.return_value = MagicMock(username="testuser")

    # when
    user = service.join_user("testuser", "password")

    # then
    assert user.username == "testuser"
    user_repository.create_user.assert_called_once()


def test_join_user_duplicate(service, user_repository):
    # given
    user_repository.get_user_by_username.return_value = MagicMock()

    # when / then
    with pytest.raises(ValueError, match="user already exists"):
        service.join_user("testuser", "password")


@patch("services.user.pwd_context.verify", return_value=True)
def test_login_success(mock_verify, service, user_repository):
    # given
    user_repository.get_user_by_username.return_value = MagicMock(
        password="hashed", # noqa: S106
        username="testuser",
    )

    # when
    user = service.login("testuser", "password")

    # then
    assert user.username == "testuser"
    mock_verify.assert_called_once()


@patch("services.user.pwd_context.verify", return_value=False)
def test_login_invalid_password(mock_verify, service, user_repository):
    # given
    user_repository.get_user_by_username.return_value = MagicMock(
        password="hashed" # noqa: S106
    )

    # when / then
    with pytest.raises(ValueError, match="invalid credentials"):
        service.login("testuser", "wrong")

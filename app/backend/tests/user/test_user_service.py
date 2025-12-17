import pytest
from repositories.user import UserRepository
from services.user import UserService


def test_join_user_success(db_session):
    repo = UserRepository(db_session)
    service = UserService(repo)

    user = service.join_user("testuser_service", "password")
    assert user.username == "testuser_service"
    assert user.user_id is not None
    assert user.created_at is not None


def test_join_user_duplicate(db_session):
    repo = UserRepository(db_session)
    service = UserService(repo)

    # user 생성
    service.join_user("duplicate_user", "password")

    # 중복 생성 시 ValueError
    with pytest.raises(ValueError, match="user already exists"):
        service.join_user("duplicate_user", "password")

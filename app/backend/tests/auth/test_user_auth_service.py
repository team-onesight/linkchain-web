import pytest
from core.deps import get_di_user_service
from models.user import User
from passlib.context import CryptContext
from repositories.user import UserRepository
from services.user import UserService

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def test_login_success(db_session):
    """
    services/user.py 의 login 서비스에 대한 test
    :param db_session: Description
    """
    hashed_password = pwd_context.hash("test1")

    user = User(
        username="test1",
        password=hashed_password,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)


    service = UserService(UserRepository(db_session))
    result = service.login("test1", "test1")

    assert result.user_id == user.user_id
    assert result.username == "test1"


def test_login_user_not_found(db_session):
    """
    user가 존재하지 않을때 test
    :param db_session: Description
    """
    hashed_password = pwd_context.hash("test1")

    user = User(
        username="test1",
        password=hashed_password,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    service = get_di_user_service(db_session)

    with pytest.raises(ValueError):
        service.login("not-exist", "password")


def test_login_password_mismatch(db_session):
    """
    패스워드 불일치시 login test
    :param db_session: Description
    """
    hashed_password = pwd_context.hash("test1")

    user = User(
        username="test1",
        password=hashed_password,
    )
    db_session.add(user)
    db_session.commit()

    service = get_di_user_service(db_session)

    with pytest.raises(ValueError):
        service.login("test1", "wrong-password")

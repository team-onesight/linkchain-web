# 공용 fixture

import pytest
from core.deps import get_di_user_service
from db.session import TestingSessionLocal, engine
from fastapi.testclient import TestClient
from main import app
from repositories.user import UserRepository
from services.user import UserService

# 실제 PostgreSQL DB 연결 -> db/session.py에서 TestingSessionLocal을 만들고 이를 import하여 사용


@pytest.fixture(scope="session")
def db_engine():
    # 필요 시 테이블 생성
    # Base.metadata.create_all(bind=engine)
    yield engine
    # 테스트 종료 후 테이블 삭제
    # Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def db_session(db_engine):
    """
    각 테스트마다 트랜잭션 rollback
    """
    connection = db_engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture()
def client(db_session):
    """
    test용 실제 DB 세션 의존성 주입
    """

    def override_get_di_user_service():
        repo = UserRepository(db_session)
        return UserService(repo)

    app.dependency_overrides[get_di_user_service] = override_get_di_user_service
    yield TestClient(app)
    app.dependency_overrides.clear()

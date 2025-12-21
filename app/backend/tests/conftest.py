import os
import sys

import pytest
from api.auth import router as auth_router
from api.link import router as link_router
from core.auth import dispatch
from core.deps import get_db, get_di_user_service
from db.base import Base
from db.session import TestingSessionLocal, engine
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.testclient import TestClient
from repositories.user import UserRepository
from services.user import UserService
from starlette.middleware.sessions import SessionMiddleware

# 환경 변수 로드
current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(current_dir)  # tests/의 상위 폴더인 backend/
env_path = os.path.join(root_dir, ".env.local")

if os.path.exists(env_path):
    load_dotenv(env_path)
else:
    print(f"Warning: .env file not found at {env_path}")

os.environ.setdefault("DB_HOST", "localhost")
os.environ.setdefault("DB_PORT", "5432")
os.environ.setdefault("DB_NAME", "linkchain")
os.environ.setdefault("DB_USER", "postgres")
os.environ.setdefault("DB_PASSWORD", "postgres")

if root_dir not in sys.path:
    sys.path.append(root_dir)


# DB fixture
@pytest.fixture(scope="session")
def db_engine():
    yield engine


@pytest.fixture(scope="function")
def db_session(db_engine):
    connection = db_engine.connect()
    transaction = connection.begin()
    session = TestingSessionLocal(bind=connection)
    yield session
    session.close()
    transaction.rollback()
    connection.close()


TEST_SECRET_KEY = "test-secret"  # noqa: S105


# TestClient fixture
@pytest.fixture
def client(db_session):
    Base.metadata.create_all(bind=engine)

    app = FastAPI()

    app.add_middleware(
        SessionMiddleware,
        secret_key=TEST_SECRET_KEY,
        session_cookie="session_auth",
        max_age=60 * 60,
        https_only=False,
    )
    app.middleware(dispatch)

    app.include_router(link_router, prefix="/api/v1", tags=["v1"])
    app.include_router(auth_router, prefix="/api/v1", tags=["v1"])

    def override_get_di_user_service():
        repo = UserRepository(db_session)
        return UserService(repo)

    app.dependency_overrides[get_di_user_service] = override_get_di_user_service
    app.dependency_overrides[get_db] = lambda: db_session

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()

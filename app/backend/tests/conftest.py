import os
import sys

import pytest
from core.deps import get_di_user_service
from db.session import TestingSessionLocal, engine
from dotenv import load_dotenv
from fastapi.testclient import TestClient
from main import app
from repositories.user import UserRepository
from services.user import UserService

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


@pytest.fixture()
def client(db_session):
    def override_get_di_user_service():
        repo = UserRepository(db_session)
        return UserService(repo)

    app.dependency_overrides[get_di_user_service] = override_get_di_user_service
    yield TestClient(app)
    app.dependency_overrides.clear()

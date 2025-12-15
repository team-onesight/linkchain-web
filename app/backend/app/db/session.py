from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from core.config import settings

DATABASE_URL = (
    f"postgresql://{settings.db_user}:{settings.db_password}"
    f"@{settings.db_host}:{settings.db_port}/{settings.db_name}"
)

# 커넥션 풀
engine = create_engine(
    DATABASE_URL,
    pool_size=10,        # 최소 커넥션
    max_overflow=20,     # 풀 초과 커넥션 허용
    pool_timeout=30,     # 풀에서 커넥션 가져올 때 최대 대기시간
    pool_pre_ping=True   # 커넥션 유효성 확인
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

from typing import List, Optional

from models.user import User
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session


class UserRepository:
    """
    UserRepository
    user_info 테이블의 데이터를 조작하기 위해 필요한 메소드 정의
    """

    def __init__(self, db: Session):
        self.db = db

    def get_user_by_username(self, username: str) -> Optional[User]:
        return self.db.query(User).filter(User.username == username).first()

    def get_user_by_id(self, user_id: int) -> Optional[User]:
        return self.db.query(User).filter(User.user_id == user_id).first()

    def create_user(self, username: str, hashed_password: str):
        new_user = User(username=username, password=hashed_password)
        try:
            self.db.add(new_user)
            self.db.commit()
            self.db.refresh(new_user)
        except IntegrityError as e:
            self.db.rollback()
            raise e

        return new_user

    def get_user_embedding(self, user_id: int) -> Optional[List[float]]:
        user_embedding = (
            self.db.query(User.user_embedding)
            .filter(User.user_id == user_id)
            .scalar()
        )

        return user_embedding

    def get_similar_users(self, user_embedding: List[float], user_id: int, count: int=3):
        similarity_expr = 1 - User.user_embedding.cosine_distance(user_embedding)

        query = (
            select(
                User.user_id,
                User.username,
                similarity_expr.label("similarity"),
            )
            .where(User.user_id != user_id)
            .where(User.user_embedding.isnot(None))
            .order_by(similarity_expr.desc())
            .limit(count)
        )

        return self.db.execute(query).all()

from models.user import User
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session


class UserRepository:
    """
    UserRepository
    user_info 테이블의 데이터를 조작하기 위해 필요한 메소드 정의
    """

    def __init__(self, db: Session):
        self.db = db

    def get_userinfo(self, username: str):
        return self.db.query(User).filter(User.username == username).first()

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

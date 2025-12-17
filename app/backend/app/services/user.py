from passlib.context import CryptContext
from repositories.user import UserRepository
from sqlalchemy.exc import IntegrityError

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UserService:
    """
    UserService
    repository를 통해 반환된 결과값에 대해 서비스 로직 구현
    """

    def __init__(self, repository: UserRepository):
        self.repository = repository

    def join_user(self, username: str, password: str):
        existing_username = self.repository.get_username_from_db(username)
        if existing_username:
            raise ValueError("user already exists")

        hashed_password = pwd_context.hash(password)
        try:
            new_user = self.repository.create_user(username, hashed_password)
        except IntegrityError as e:
            raise ValueError("user create fail") from e

        return new_user

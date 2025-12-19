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
        existing_username = self.repository.get_userinfo_by_username(username)
        if existing_username:
            raise ValueError("user already exists")

        hashed_password = pwd_context.hash(password)
        try:
            new_user = self.repository.create_user(username, hashed_password)
        except IntegrityError as e:
            raise ValueError("user create fail") from e

        return new_user

    def get_user_by_id(self, user_id: str):
        """
        Docstring for get_user_by_id
        :param self: Description
        :param user_id: Description
        :type user_id: str
        """
        user = self.repository.get_user_by_id(user_id)
        return user

    def login(self, username: str, password: str):
        """
        Docstring for login
        :param self: Description
        :param username: Description
        :type username: str
        :param password: Description
        :type password: str
        """
        try:
            valid_user = self.repository.get_userinfo_by_username(username)
            auth = pwd_context.verify(password, valid_user.password)
            if not valid_user or not auth:
                raise ValueError("invalid credentials")
        except Exception as e:
            raise ValueError("invalid credentials") from e

        return valid_user

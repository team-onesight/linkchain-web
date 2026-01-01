from collections import defaultdict
from datetime import date
from passlib.context import CryptContext
from repositories.link_history import LinkHistoryRepository
from repositories.user import UserRepository
from schemas.user import UserLinkHistoryItem, UserLinkHistoryGroup, UserLinkHistoryResponse
from sqlalchemy.exc import IntegrityError

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UserService:
    """
    UserService
    user repository를 통해 반환된 결과값에 대해 서비스 로직 구현
    """

    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def join_user(self, username: str, password: str):
        existing_username = self.user_repository.get_user_by_username(username)
        if existing_username:
            raise ValueError("user already exists")

        hashed_password = pwd_context.hash(password)
        try:
            new_user = self.user_repository.create_user(username, hashed_password)
        except IntegrityError as e:
            raise ValueError("user create fail") from e

        return new_user

    def get_user_by_id(self, user_id: int):
        """
        Docstring for get_user_by_id
        :param self: Description
        :param user_id: Description
        :type user_id: int
        """
        user = self.user_repository.get_user_by_id(user_id)
        return user
    
    def is_username_available(self, username: str) -> bool:
        """
        username 중복 확인
        :param username: username
        :type username: str
        """
        return not self.user_repository.get_user_by_username(username)

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
            valid_user = self.user_repository.get_user_by_username(username)
            auth = pwd_context.verify(password, valid_user.password)
            if not valid_user or not auth:
                raise ValueError("invalid credentials")
        except Exception as e:
            raise ValueError("invalid credentials") from e

        return valid_user


class UserLinkHistoryService:
    """
    UserLinkHistoryService
    link_history repository를 통해 반환된 결과값에 대해 서비스 로직 구현
    """

    def __init__(self, link_history_repository: LinkHistoryRepository):
        self.link_history_repository = link_history_repository

    def get_user_link_history(self, user_id: int) -> UserLinkHistoryResponse:
        """
        user link history 조회
        :param user_id: user_id
        :type user_id: int
        """
        total = self.link_history_repository.count_distinct_links_by_user(user_id)
        records = self.link_history_repository.find_recently_visited_links_by_user(user_id) # noqa: E501

        grouped: dict[date, list[UserLinkHistoryItem]] = defaultdict(list)

        for record in records:
            link = UserLinkHistoryItem(
                    link_id=record.link_id,
                    url=record.url,
                    title=record.title,
                    description=record.description,
                    views=record.views,
                    created_at=record.visited_at, # 최근 방문 시점
                )
            
            grouped[record.visited_at.date()].append(link)

        link_groups = [
            UserLinkHistoryGroup(date=group_date, items=items)
            for group_date, items in grouped.items()
        ]
        
        link_groups.sort(key=lambda x: x.date, reverse=True)

        return UserLinkHistoryResponse(total=total, link_groups=link_groups)

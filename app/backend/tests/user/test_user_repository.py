from repositories.user import UserRepository


def test_create_and_get_user(db_session):
    repo = UserRepository(db_session)

    # User 생성
    new_user = repo.create_user("testuser_repo", "hashed_password")
    assert new_user.username == "testuser_repo"
    assert new_user.user_id is not None
    assert new_user.created_at is not None

    # User 조회
    fetched_user = repo.get_username_from_db("testuser_repo")
    assert fetched_user.username == new_user.username

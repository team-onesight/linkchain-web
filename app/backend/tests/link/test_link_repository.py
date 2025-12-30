from unittest.mock import MagicMock

import pytest
from repositories.link import LinkRepository
from sqlalchemy.exc import IntegrityError


@pytest.fixture
def db_session():
    return MagicMock()


@pytest.fixture
def repository(db_session):
    return LinkRepository(db=db_session)


def test_create_link_success(repository, db_session):
    # when
    result = repository.create_link(
        link_id="abc",
        url="https://namu.wiki",
        created_by=1,
    )

    # then
    db_session.add.assert_called_once()
    db_session.commit.assert_called_once()
    db_session.refresh.assert_called_once()
    assert result is not None


def test_create_link_integrity_error(repository, db_session):
    # given
    db_session.commit.side_effect = IntegrityError("err", None, None)

    # when / then
    with pytest.raises(IntegrityError):
        repository.create_link(
            link_id="abc",
            url="https://namu.wiki",
            created_by=1,
        )

    db_session.rollback.assert_called_once()

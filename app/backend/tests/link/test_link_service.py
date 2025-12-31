from unittest.mock import MagicMock

import pytest
from services.link import LinkService


@pytest.fixture
def link_repository():
    return MagicMock()


@pytest.fixture
def link_user_map_repository():
    return MagicMock()


@pytest.fixture
def service(link_repository, link_user_map_repository):
    return LinkService(
        link_repository=link_repository,
        link_user_map_repository=link_user_map_repository,
    )


def test_create_link_when_mapping_exists(service, link_user_map_repository):
    # given
    link_user_map_repository.get_link_user_map.return_value = MagicMock()

    # when
    result = service.create_link(
        url="https://name.wiki",
        user_id=1,
        username="test"
    )

    # then
    assert result is None
    link_user_map_repository.get_link_user_map.assert_called_once()
    service.link_repository.create_link.assert_not_called()


def test_create_link_when_new_link_created(
    service,
    link_repository,
    link_user_map_repository,
):
    # given
    link_user_map_repository.get_link_user_map.return_value = None
    link_repository.get_link_from_db.return_value = None

    link_user_map_repository.create_link_user_map.return_value = MagicMock(
        link_id="abc",
        user_id=1,
    )

    # when
    result = service.create_link(
        url="https://namu.wiki",
        user_id=1,
        username="test"
    )

    # then
    assert result is not None

    link_repository.create_link.assert_called_once()
    link_user_map_repository.create_link_user_map.assert_called_once()

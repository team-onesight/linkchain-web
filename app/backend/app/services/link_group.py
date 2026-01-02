from collections import defaultdict
from repositories.link_group import LinkGroupRepository
from schemas.link_group import GroupItem, GroupResponse


class GroupService:
    def __init__(self, link_group_repository: LinkGroupRepository):
        self.repo = link_group_repository

    def get_groups(self) -> list[GroupResponse]:
        rows = self.repo.get_group_link_rows()

        grouped: dict[str, list[GroupItem]] = defaultdict(list)

        for group_title, link in rows:
            grouped[group_title].append(
                GroupItem.model_validate(link)
            )

        return [
            GroupResponse(group_title=group_title, items=items)
            for group_title, items in grouped.items()
        ]

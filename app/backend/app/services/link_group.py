from collections import defaultdict

from repositories.link_group import LinkGroupRepository
from schemas.link_group import GroupItem, GroupResponse


class GroupService:
    def __init__(self, link_group_repository: LinkGroupRepository):
        self.repo = link_group_repository

    def get_groups(self) -> list[GroupResponse]:
        group_meta = self.repo.get_groups_with_link_count()
        meta_cache = {
            row.group_id: {"title": row.group_title, "total": row.total_links}
            for row in group_meta
        }

        rows = self.repo.get_top_5_links_per_group()

        grouped_data = defaultdict(list)
        for row in rows:
            item = GroupItem.model_validate(row)
            grouped_data[row.group_id].append(item)

        result = []
        for g_id, items in grouped_data.items():
            if g_id in meta_cache:
                result.append(
                    GroupResponse(
                        group_id=g_id,
                        group_title=meta_cache[g_id]["title"],
                        total_links=meta_cache[g_id]["total"],
                        items=items,
                    )
                )

        return sorted(result, key=lambda x: x.group_id)

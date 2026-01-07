from collections import defaultdict

from repositories.link_group import LinkGroupRepository
from repositories.tag import TagRepository
from schemas.link_group import GroupItem, GroupResponse


class GroupService:
    def __init__(
        self,
        link_group_repository: LinkGroupRepository,
        tag_repository: TagRepository,
    ):
        self.repo = link_group_repository
        self.tag_repo = tag_repository

    def get_groups(self) -> list[GroupResponse]:
        group_meta = self.repo.get_groups_with_link_count()
        meta_cache = {
            row.group_id: {"title": row.group_title, "total": row.total_links}
            for row in group_meta
        }

        rows = self.repo.get_top_5_links_per_group()
        link_ids = [row.link_id for row in rows]
        tags_by_link_id = defaultdict(list)
        if link_ids:
            tags_data = self.tag_repo.get_tags_by_link_ids(link_ids)
            for link_id, tag in tags_data:
                tags_by_link_id[link_id].append(tag)

        grouped_data = defaultdict(list)
        for row in rows:
            item_data = dict(row._mapping)
            item_data["tags"] = tags_by_link_id.get(row.link_id, [])
            item = GroupItem.model_validate(item_data)
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

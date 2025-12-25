from repositories.tag import TagRepository


class TagService:
    def __init__(self, repository: TagRepository):
        self.repository = repository

    def get_tags(self, limit: int = 5):
        return self.repository.get_tags(limit)

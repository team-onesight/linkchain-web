from pydantic import BaseModel


class TagResponse(BaseModel):
    tag_id: int
    tag_name: str

    class Config:
        from_attributes = True

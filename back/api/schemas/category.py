from pydantic import BaseModel

class CategoryCreate(BaseModel):
    video_id: int
    category_name: str
    category_number: int
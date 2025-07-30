from pydantic import BaseModel
from typing import Optional

class VideoCreate(BaseModel):
    channel_id: int
    create_user_id: int

class VideoResponse(BaseModel):
    video_id: int
    title: str
    description: Optional[str] = None
    url: str
    thumbnail: Optional[str] = None
    channel_id: int
    create_user_id: int
    views: int = 0
    likes: int = 0
    dislikes: int = 0
    duration: Optional[str] = None
    upload_date: Optional[str] = None
    category: Optional[str] = None

    class Config:
        from_attributes = True

class VideoListResponse(BaseModel):
    videos: list[VideoResponse]
    total: int
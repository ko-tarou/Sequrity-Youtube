from pydantic import BaseModel

class VideoCreate(BaseModel):
    channel_id: int
    create_user_id: int
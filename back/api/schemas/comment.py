from pydantic import BaseModel

class CommentCreate(BaseModel):
    video_id: int
    write_user_id: int
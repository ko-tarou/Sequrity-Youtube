from sqlalchemy.orm import Session
from db.models import Video
from schemas.video import VideoCreate

def create_video(db: Session, video: VideoCreate):
    db_video = Video(
        channel_id=video.channel_id,
        create_user_id=video.create_user_id
    )
    db.add(db_video)
    db.commit()
    db.refresh(db_video)
    return db_video
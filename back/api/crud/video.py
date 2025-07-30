from sqlalchemy.orm import Session
from ..db.models import Video
from ..schemas.video import VideoCreate, VideoResponse
from typing import List, Optional

def create_video(db: Session, video: VideoCreate):
    db_video = Video(
        channel_id=video.channel_id,
        create_user_id=video.create_user_id
    )
    db.add(db_video)
    db.commit()
    db.refresh(db_video)
    return db_video

def get_videos(db: Session, skip: int = 0, limit: int = 100) -> List[Video]:
    return db.query(Video).offset(skip).limit(limit).all()

def get_video_by_id(db: Session, video_id: int) -> Optional[Video]:
    return db.query(Video).filter(Video.video_id == video_id).first()

def get_videos_by_category(db: Session, category: str, skip: int = 0, limit: int = 100) -> List[Video]:
    return db.query(Video).filter(Video.category == category).offset(skip).limit(limit).all()

def search_videos(db: Session, keyword: str, skip: int = 0, limit: int = 100) -> List[Video]:
    return db.query(Video).filter(
        Video.title.contains(keyword) | Video.description.contains(keyword)
    ).offset(skip).limit(limit).all()

def update_video_views(db: Session, video_id: int):
    video = db.query(Video).filter(Video.video_id == video_id).first()
    if video:
        video.views += 1
        db.commit()
    return video
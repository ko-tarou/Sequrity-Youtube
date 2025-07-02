from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.video import VideoCreate
from crud import video as crud_video

router = APIRouter(prefix="/videos", tags=["Videos"])

@router.post("/", response_model=VideoCreate, status_code=status.HTTP_201_CREATED)
def create_video_api(video: VideoCreate, db: Session = Depends(get_db)):
    return crud_video.create_video(db, video)
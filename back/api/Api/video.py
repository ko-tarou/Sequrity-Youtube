from fastapi import APIRouter, Depends, status, Query, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from ..schemas.video import VideoCreate, VideoResponse, VideoListResponse
from ..db.database import get_db
from ..crud import video as crud_video

router = APIRouter(prefix="/videos", tags=["Videos"])

@router.post("/", response_model=VideoResponse, status_code=status.HTTP_201_CREATED)
def create_video_api(video: VideoCreate, db: Session = Depends(get_db)):
    return crud_video.create_video(db, video)

@router.get("/", response_model=VideoListResponse)
def get_videos_api(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    if category:
        videos = crud_video.get_videos_by_category(db, category, skip, limit)
    elif search:
        videos = crud_video.search_videos(db, search, skip, limit)
    else:
        videos = crud_video.get_videos(db, skip, limit)
    
    return VideoListResponse(videos=videos, total=len(videos))

@router.get("/{video_id}", response_model=VideoResponse)
def get_video_api(video_id: int, db: Session = Depends(get_db)):
    video = crud_video.get_video_by_id(db, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    # 視聴回数を更新
    crud_video.update_video_views(db, video_id)
    
    return video
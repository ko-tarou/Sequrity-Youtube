from fastapi import APIRouter, Depends, status, Query, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List, Optional
from ..schemas.video import VideoCreate, VideoResponse, VideoListResponse
from ..db.database import get_db
from ..crud import video as crud_video
from slowapi.util import get_remote_address
from datetime import datetime, timedelta
from ..limiter import limiter

router = APIRouter(prefix="/videos", tags=["Videos"])

# IPベースの重複更新防止用のキャッシュ
# キー: (IPアドレス, video_id), 値: 最終更新時刻
view_cache = {}
CACHE_EXPIRY_HOURS = 1  # 1時間以内の重複更新を防ぐ

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
    """動画情報を取得（視聴回数は更新しない）"""
    video = crud_video.get_video_by_id(db, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return video

@router.post("/{video_id}/view", status_code=status.HTTP_204_NO_CONTENT)
@limiter.limit("10/minute")  # 1分間に10回まで
def update_video_view_api(
    request: Request,
    video_id: int,
    db: Session = Depends(get_db)
):
    """
    視聴回数を更新（DoS攻撃対策あり）
    - レート制限: 1分間に10回まで
    - 重複更新防止: 同じIPから同じビデオへの更新は1時間に1回まで
    """
    # ビデオの存在確認
    video = crud_video.get_video_by_id(db, video_id)
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    # IPアドレスを取得
    client_ip = get_remote_address(request)
    cache_key = (client_ip, video_id)
    current_time = datetime.now()
    
    # キャッシュのクリーンアップ（古いエントリを削除）
    expiry_time = current_time - timedelta(hours=CACHE_EXPIRY_HOURS)
    expired_keys = [
        key for key, timestamp in view_cache.items()
        if timestamp < expiry_time
    ]
    for key in expired_keys:
        del view_cache[key]
    
    # 重複更新チェック
    if cache_key in view_cache:
        last_update = view_cache[cache_key]
        if last_update > expiry_time:
            # まだ有効期限内なので更新しない
            return
    
    # 視聴回数を更新
    crud_video.update_video_views(db, video_id)
    
    # キャッシュに記録
    view_cache[cache_key] = current_time
    
    return None
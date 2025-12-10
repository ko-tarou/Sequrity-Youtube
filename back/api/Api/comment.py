from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from ..schemas.comment import CommentCreate
from ..db.database import get_db
from ..crud import comment as crud_comment
from .auth import get_current_user

router = APIRouter(prefix="/comments", tags=["Comments"])


@router.post("/", response_model=CommentCreate, status_code=status.HTTP_201_CREATED)
def create_comment_api(comment: CommentCreate, db: Session = Depends(get_db), current_user = Depends(get_current_user)):
    # Ignore client-supplied write_user_id and use authenticated user id
    return crud_comment.create_comment(db, comment.video_id, getattr(current_user, 'user_id', None))
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.comment import CommentCreate
from crud import comment as crud_comment

router = APIRouter(prefix="/comments", tags=["Comments"])

@router.post("/", response_model=CommentCreate, status_code=status.HTTP_201_CREATED)
def create_comment_api(comment: CommentCreate, db: Session = Depends(get_db)):
    return crud_comment.create_comment(db, comment)
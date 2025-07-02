from sqlalchemy.orm import Session
from db.models import Comment
from schemas.comment import CommentCreate

def create_comment(db: Session, comment: CommentCreate):
    db_comment = Comment(
        video_id=comment.video_id,
        write_user_id=comment.write_user_id
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment
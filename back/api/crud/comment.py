from sqlalchemy.orm import Session
from ..db.models import Comment


def create_comment(db: Session, video_id: int, write_user_id: int):
    db_comment = Comment(
        video_id=video_id,
        write_user_id=write_user_id
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment
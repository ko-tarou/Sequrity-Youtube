from sqlalchemy.orm import Session
from ..db.models import Notice
from ..schemas.notice import NoticeCreate

def create_notice(db: Session, notice: NoticeCreate):
    db_notice = Notice(receive_user_id=notice.receive_user_id)
    db.add(db_notice)
    db.commit()
    db.refresh(db_notice)
    return db_notice

def get_notice(db: Session, notice_id: int):
    return db.query(Notice).filter(Notice.notice_id == notice_id).first()
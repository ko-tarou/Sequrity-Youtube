from sqlalchemy.orm import Session
from ..db.models import Channel
from ..schemas.channel import ChannelCreate
from .user import hash_password

def create_channel(db: Session, channel: ChannelCreate):
    # パスワードをハッシュ化して保存
    hashed_password = hash_password(channel.password)
    db_channel = Channel(
        user_name=channel.user_name,
        email=channel.email,
        password=hashed_password,
        admin_id=channel.admin_id
    )
    db.add(db_channel)
    db.commit()
    db.refresh(db_channel)
    return db_channel
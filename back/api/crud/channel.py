from sqlalchemy.orm import Session
from db.models import Channel
from schemas.channel import ChannelCreate

def create_channel(db: Session, channel: ChannelCreate):
    db_channel = Channel(
        user_name=channel.user_name,
        email=channel.email,
        password=channel.password,
        admin_id=channel.admin_id
    )
    db.add(db_channel)
    db.commit()
    db.refresh(db_channel)
    return db_channel
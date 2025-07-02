from sqlalchemy.orm import Session
from db.models import ChannelSubscription
from schemas.channel_subscription import ChannelSubscriptionCreate

def create_channel_subscription(db: Session, sub: ChannelSubscriptionCreate):
    db_subscription = ChannelSubscription(
        user_id=sub.user_id,
        channel_id=sub.channel_id
    )
    db.add(db_subscription)
    db.commit()
    db.refresh(db_subscription)
    return db_subscription
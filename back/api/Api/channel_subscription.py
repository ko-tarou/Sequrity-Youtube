from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.channel_subscription import ChannelSubscriptionCreate
from crud import channel_subscription as crud_channel_subscription

router = APIRouter(prefix="/channel-subscriptions", tags=["Channel Subscriptions"])

@router.post("/", response_model=ChannelSubscriptionCreate, status_code=status.HTTP_201_CREATED)
def create_channel_subscription_api(sub: ChannelSubscriptionCreate, db: Session = Depends(get_db)):
    return crud_channel_subscription.create_channel_subscription(db, sub)
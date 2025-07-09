from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.channel import ChannelCreate
from crud import channel as crud_channel

router = APIRouter(prefix="/channels", tags=["Channels"])

@router.post("/", response_model=ChannelCreate, status_code=status.HTTP_201_CREATED)
def create_channel_api(channel: ChannelCreate, db: Session = Depends(get_db)):
    return crud_channel.create_channel(db, channel)
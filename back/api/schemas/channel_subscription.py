from pydantic import BaseModel

class ChannelSubscriptionCreate(BaseModel):
    user_id: int
    channel_id: int
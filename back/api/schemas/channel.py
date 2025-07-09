from pydantic import BaseModel

class ChannelCreate(BaseModel):
    user_name: str
    email: str
    password: str
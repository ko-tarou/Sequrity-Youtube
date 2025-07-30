from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime
from sqlalchemy.sql import func
from api.db.database import Base


class Notice(Base):
    __tablename__ = "notice"

    notice_id = Column(Integer, primary_key=True, index=True)
    receive_user_id = Column(Integer, nullable=False)

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    username = Column(String, nullable=False)
    email = Column(String, nullable=False)
    password = Column(String, nullable=False)
    is_admin = Column(Boolean, nullable=False)

class Channel(Base):
    __tablename__ = "channels"

    channel_id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    password = Column(String, nullable=False)
    admin_id = Column(Integer, nullable=False)

class Video(Base):
    __tablename__ = "videos"

    video_id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    url = Column(String, nullable=False)
    thumbnail = Column(String, nullable=True)
    channel_id = Column(Integer, ForeignKey("channels.channel_id"), nullable=False)
    create_user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    views = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    dislikes = Column(Integer, default=0)
    duration = Column(String, nullable=True)
    upload_date = Column(DateTime, default=func.now())
    category = Column(String, nullable=True)

class Category(Base):
    __tablename__ = "categories"

    category_id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, ForeignKey("videos.video_id"), nullable=False)
    category_name = Column(String, nullable=False)
    category_number = Column(Integer, nullable=False)

class Comment(Base):
    __tablename__ = "comments"

    comment_id = Column(Integer, primary_key=True, index=True)
    video_id = Column(Integer, ForeignKey("videos.video_id"), nullable=False)
    write_user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)

class ChannelSubscription(Base):
    __tablename__ = "channel_subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    channel_id = Column(Integer, ForeignKey("channels.channel_id"), nullable=False)
from sqlalchemy.orm import Session
from ..db.models import User
from .user import verify_password
from typing import Optional

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """ユーザー認証を行う"""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    return user

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """メールアドレスでユーザーを取得"""
    return db.query(User).filter(User.email == email).first()


from sqlalchemy.orm import Session
from ..db.models import User
from ..schemas.user import UserCreate
from passlib.context import CryptContext

# パスワードハッシュ化のコンテキスト
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """パスワードをハッシュ化する"""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """平文パスワードとハッシュ化されたパスワードを照合する"""
    return pwd_context.verify(plain_password, hashed_password)

def create_user(db:Session, user: UserCreate):
    # パスワードをハッシュ化して保存
    hashed_password = hash_password(user.password)
    db_user = User(username=user.username, email=user.email, password=hashed_password, is_admin=False)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(User).filter(User.user_id == user_id).first()
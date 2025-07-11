from sqlalchemy.orm import Session
from db.models import User
from schemas.user import UserCreate

def create_user(db:Session, user: UserCreate):
    db_user = User(username=user.username, email=user.email, password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
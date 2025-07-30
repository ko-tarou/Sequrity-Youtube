from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from ..schemas.user import UserCreate
from ..db.database import get_db
from ..crud import user as crud_user

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/", response_model=UserCreate)
def create_user_api(user: UserCreate, db: Session = Depends(get_db)):
    return crud_user.create_user(db, user)
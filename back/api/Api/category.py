from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from db.database import get_db
from schemas.category import CategoryCreate
from crud import category as crud_category

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.post("/", response_model=CategoryCreate, status_code=status.HTTP_201_CREATED)
def create_category_api(category: CategoryCreate, db: Session = Depends(get_db)):
    return crud_category.create_category(db, category)
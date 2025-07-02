from sqlalchemy.orm import Session
from db.models import Category
from schemas.category import CategoryCreate

def create_category(db: Session, category: CategoryCreate):
    db_category = Category(
        video_id=category.video_id,
        category_name=category.category_name,
        category_number=category.category_number
    )
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category
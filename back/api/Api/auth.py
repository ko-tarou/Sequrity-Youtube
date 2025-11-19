from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from ..schemas.auth import LoginRequest, LoginResponse, RegisterRequest, RegisterResponse
from ..db.database import get_db
from ..crud import auth as crud_auth, user as crud_user
from ..schemas.user import UserCreate

router = APIRouter(prefix="/auth", tags=["Authentication"])

# JWT設定（本番環境では環境変数から取得すべき）
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: timedelta = None):
    """JWTアクセストークンを作成"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@router.post("/login", response_model=LoginResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """ログイン認証"""
    user = crud_auth.authenticate_user(db, login_data.email, login_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="メールアドレスまたはパスワードが正しくありません",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.user_id},
        expires_delta=access_token_expires
    )
    
    return LoginResponse(
        access_token=access_token,
        user={
            "user_id": user.user_id,
            "username": user.username,
            "email": user.email,
            "is_admin": user.is_admin
        }
    )

@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
def register(register_data: RegisterRequest, db: Session = Depends(get_db)):
    """新規ユーザー登録"""
    # 既存ユーザーのチェック
    existing_user = crud_auth.get_user_by_email(db, register_data.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="このメールアドレスは既に登録されています"
        )
    
    # ユーザー作成
    user_create = UserCreate(
        username=register_data.username,
        email=register_data.email,
        password=register_data.password
    )
    user = crud_user.create_user(db, user_create)
    
    # アクセストークン作成
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "user_id": user.user_id},
        expires_delta=access_token_expires
    )
    
    return RegisterResponse(
        access_token=access_token,
        user={
            "user_id": user.user_id,
            "username": user.username,
            "email": user.email,
            "is_admin": user.is_admin
        }
    )


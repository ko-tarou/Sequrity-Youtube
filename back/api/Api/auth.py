from fastapi import APIRouter, Depends, HTTPException, status, Response, Cookie
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from typing import Optional
from ..schemas.auth import LoginRequest, LoginResponse, RegisterRequest, RegisterResponse
from ..db.database import get_db
from ..db.models import User
from ..crud import auth as crud_auth, user as crud_user
from ..schemas.user import UserCreate
import os

router = APIRouter(prefix="/auth", tags=["Authentication"])

# JWT設定（本番環境では環境変数から取得すべき）
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
COOKIE_NAME = "access_token"

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

def get_current_user(
    access_token: Optional[str] = Cookie(None, alias=COOKIE_NAME),
    db: Session = Depends(get_db)
) -> User:
    """Cookieからトークンを取得してユーザーを認証"""
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="認証が必要です",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    try:
        payload = jwt.decode(access_token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("user_id")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="無効なトークン"
            )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="無効なトークン"
        )
    
    user = db.query(User).filter(User.user_id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="ユーザーが見つかりません"
        )
    
    return user

@router.post("/login", response_model=LoginResponse)
def login(
    login_data: LoginRequest,
    response: Response,
    db: Session = Depends(get_db)
):
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
    
    response.set_cookie(
        key=COOKIE_NAME,
        value=access_token,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        httponly=True,
        secure=os.environ.get("ENVIRONMENT") == "production",
        samesite="lax",
        path="/"
    )
    
    return LoginResponse(
        access_token="",
        user={
            "user_id": user.user_id,
            "username": user.username,
            "email": user.email,
            "is_admin": user.is_admin
        }
    )

@router.post("/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED)
def register(
    register_data: RegisterRequest,
    response: Response,
    db: Session = Depends(get_db)
):
    """新規ユーザー登録 - HttpOnly Cookieを使用"""
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
    
    # HttpOnly Cookieにトークンを設定
    response.set_cookie(
        key=COOKIE_NAME,
        value=access_token,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        httponly=True,
        secure=os.environ.get("ENVIRONMENT") == "production",
        samesite="lax",
        path="/"                  
    )
    
    # レスポンスボディにはトークンを含めない（セキュリティ向上）
    return RegisterResponse(
        access_token="",
        user={
            "user_id": user.user_id,
            "username": user.username,
            "email": user.email,
            "is_admin": user.is_admin
        }
    )

@router.post("/logout")
def logout(response: Response):
    """ログアウト - Cookieを削除"""
    response.delete_cookie(
        key=COOKIE_NAME,
        httponly=True,
        secure=os.environ.get("ENVIRONMENT") == "production",  # 開発環境ではFalse、本番環境ではTrue
        samesite="lax",
        path="/"
    )
    return {"message": "ログアウトしました"}

@router.get("/me")
def get_current_user_info(current_user: User = Depends(get_current_user)):
    """現在のユーザー情報を取得"""
    return {
        "user_id": current_user.user_id,
        "username": current_user.username,
        "email": current_user.email,
        "is_admin": current_user.is_admin
    }


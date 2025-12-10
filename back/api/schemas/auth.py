from pydantic import BaseModel, EmailStr, field_validator
import re

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class RegisterRequest(BaseModel):
    username: str
    email: EmailStr
    password: str
    
    @field_validator('username')
    @classmethod
    def validate_username(cls, v: str) -> str:
        """SQLインジェクション対策: 危険な文字をチェック"""
        if re.search(r'[<>"\';\\]', v):
            raise ValueError('ユーザー名に使用できない文字が含まれています')
        return v

class RegisterResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict


"""Authentication request and response schemas."""

from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field


class RegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100, examples=["John Doe"])
    email: EmailStr = Field(..., examples=["john@example.com"])
    password: str = Field(..., min_length=8, examples=["SecurePass1!"])
    phone: str = Field(..., examples=["+923001234567"])
    role: str = Field(default="customer", examples=["customer"])


class LoginRequest(BaseModel):
    email: EmailStr = Field(..., examples=["john@example.com"])
    password: str = Field(..., examples=["SecurePass1!"])


class RefreshTokenRequest(BaseModel):
    refresh_token: str = Field(..., description="Valid refresh token")


class ProfileUpdateRequest(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    phone: Optional[str] = None
    address: Optional[str] = None
    avatar_url: Optional[str] = None


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=8)
    confirm_password: str = Field(..., min_length=8)


class UserProfile(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: str
    full_name: str
    email: str
    phone: str
    address: Optional[str] = None
    avatar_url: Optional[str] = None
    role: str
    is_active: bool
    created_at: str
    updated_at: str


class TokenData(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: UserProfile


class AuthResponse(BaseModel):
    success: bool = True
    message: str
    data: Optional[TokenData | UserProfile | dict] = None

"""Authentication API routes."""

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.dependencies import get_current_user
from app.schemas.auth import (
    ChangePasswordRequest,
    LoginRequest,
    ProfileUpdateRequest,
    RefreshTokenRequest,
    RegisterRequest,
)
from app.services.auth_service import auth_service
from app.utils.response import success_response

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    summary="Register a new user",
    description=(
        "Create a new user account with email, password, and phone validation. "
        "Password must be at least 8 characters with uppercase, lowercase, "
        "digit, and special character."
    ),
    status_code=status.HTTP_201_CREATED,
)
async def register(data: RegisterRequest):
    result, error = auth_service.register(data)
    if error:
        raise HTTPException(status_code=400, detail=error)
    return success_response("Registration successful", result)


@router.post(
    "/signup",
    summary="Sign up (alias for register)",
    description="Alias of /register for frontend signup flows.",
    status_code=status.HTTP_201_CREATED,
)
async def signup(data: RegisterRequest):
    result, error = auth_service.register(data)
    if error:
        raise HTTPException(status_code=400, detail=error)
    return success_response("Registration successful", result)


@router.post(
    "/login",
    summary="Login",
    description="Authenticate with email and password to receive JWT tokens.",
)
async def login(data: LoginRequest):
    result, error = auth_service.login(data)
    if error:
        raise HTTPException(status_code=401, detail=error)
    return success_response("Login successful", result)


@router.post(
    "/logout",
    summary="Logout",
    description="Revoke the refresh token to invalidate the session.",
)
async def logout(
    data: RefreshTokenRequest,
    current_user: dict = Depends(get_current_user),
):
    _ = current_user
    success, error = auth_service.logout(data.refresh_token)
    if not success:
        raise HTTPException(status_code=400, detail=error)
    return success_response("Logout successful", None)


@router.post(
    "/refresh",
    summary="Refresh access token",
    description="Exchange a valid refresh token for a new access and refresh token pair.",
)
async def refresh_token(data: RefreshTokenRequest):
    result, error = auth_service.refresh_access_token(data.refresh_token)
    if error:
        raise HTTPException(status_code=401, detail=error)
    return success_response("Token refreshed successfully", result)


@router.get(
    "/me",
    summary="Get current user",
    description="Return the authenticated user's profile information.",
)
async def get_me(current_user: dict = Depends(get_current_user)):
    return success_response("User profile retrieved successfully", current_user)


@router.put(
    "/profile",
    summary="Update profile",
    description="Update the authenticated user's name, phone, address, or avatar URL.",
)
async def update_profile(
    data: ProfileUpdateRequest,
    current_user: dict = Depends(get_current_user),
):
    profile, error = auth_service.update_profile(current_user["user_id"], data)
    if error:
        status_code = 404 if "not found" in error.lower() else 400
        raise HTTPException(status_code=status_code, detail=error)
    return success_response("Profile updated successfully", profile)


@router.put(
    "/change-password",
    summary="Change password",
    description="Change password by providing current password and new password.",
)
async def change_password(
    data: ChangePasswordRequest,
    current_user: dict = Depends(get_current_user),
):
    success, error = auth_service.change_password(current_user["user_id"], data)
    if not success:
        status_code = 404 if error and "not found" in error.lower() else 400
        raise HTTPException(status_code=status_code, detail=error)
    return success_response("Password changed successfully", None)


@router.delete(
    "/account",
    summary="Delete account",
    description="Permanently delete the authenticated user's account.",
)
async def delete_account(current_user: dict = Depends(get_current_user)):
    success, error = auth_service.delete_account(current_user["user_id"])
    if not success:
        raise HTTPException(status_code=404, detail=error)
    return success_response("Account deleted successfully", None)

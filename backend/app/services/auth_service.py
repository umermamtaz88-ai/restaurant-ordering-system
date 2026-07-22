"""Authentication business logic."""

from typing import Optional
from uuid import uuid4

from jwt.exceptions import InvalidTokenError

from app.core.auth import (
    build_token_response,
    public_user_profile,
    token_revocation_store,
)
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    normalize_phone,
    validate_password_strength,
    validate_phone,
    verify_password,
)
from app.schemas.auth import (
    ChangePasswordRequest,
    LoginRequest,
    ProfileUpdateRequest,
    RegisterRequest,
)
from app.db.repository import DbRepository
from app.utils.validators import validate_email


class AuthService:
    def __init__(self):
        self.store = DbRepository("users.json")
        self.id_field = "user_id"

    def _now(self) -> str:
        from datetime import datetime, timezone

        return datetime.now(timezone.utc).isoformat()

    def _generate_user_id(self) -> str:
        return str(uuid4())

    def get_all_users(self) -> list[dict]:
        return self.store.read_all()

    def get_user_by_id(self, user_id: str) -> Optional[dict]:
        return self.store.find_by_id(self.id_field, user_id)

    def get_user_by_email(self, email: str) -> Optional[dict]:
        return self.store.find_by_field("email", email.lower())

    def register(self, data: RegisterRequest) -> tuple[Optional[dict], Optional[str]]:
        if not validate_email(data.email):
            return None, "Invalid email format"

        password_error = validate_password_strength(data.password)
        if password_error:
            return None, password_error

        if not validate_phone(data.phone):
            return None, "Invalid phone number format"

        if self.get_user_by_email(data.email):
            return None, f"User with email '{data.email}' already exists"

        now = self._now()
        user = {
            "user_id": self._generate_user_id(),
            "full_name": data.full_name.strip(),
            "email": data.email.lower(),
            "password_hash": hash_password(data.password),
            "phone": normalize_phone(data.phone),
            "address": None,
            "avatar_url": None,
            # Public signup is always a customer (staff created via scripts)
            "role": "customer",
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        }

        self.store.insert(user)
        return build_token_response(
            *self._issue_tokens(user),
            user=user,
        ), None

    def login(self, data: LoginRequest) -> tuple[Optional[dict], Optional[str]]:
        user = self.get_user_by_email(data.email)
        if not user or not verify_password(data.password, user["password_hash"]):
            return None, "Invalid credentials"

        if not user.get("is_active", True):
            return None, "Account is inactive"

        return build_token_response(
            *self._issue_tokens(user),
            user=user,
        ), None

    def refresh_access_token(
        self, refresh_token: str
    ) -> tuple[Optional[dict], Optional[str]]:
        try:
            payload = decode_token(refresh_token)
        except InvalidTokenError:
            return None, "Invalid or expired refresh token"

        if payload.get("type") != "refresh":
            return None, "Invalid token type"

        jti = payload.get("jti")
        if not jti or token_revocation_store.is_revoked(jti):
            return None, "Refresh token has been revoked"

        user_id = payload.get("sub")
        user = self.get_user_by_id(user_id) if user_id else None
        if not user or not user.get("is_active", True):
            return None, "User not found or inactive"

        access_token, new_refresh_token = self._issue_tokens(user)
        token_revocation_store.revoke(jti)

        return build_token_response(access_token, new_refresh_token, user), None

    def logout(self, refresh_token: str) -> tuple[bool, Optional[str]]:
        try:
            payload = decode_token(refresh_token)
        except InvalidTokenError:
            return False, "Invalid refresh token"

        if payload.get("type") != "refresh":
            return False, "Invalid token type"

        jti = payload.get("jti")
        if jti:
            token_revocation_store.revoke(jti)
        return True, None

    def update_profile(
        self, user_id: str, data: ProfileUpdateRequest
    ) -> tuple[Optional[dict], Optional[str]]:
        user = self.get_user_by_id(user_id)
        if not user:
            return None, "User not found"

        if data.phone is not None and not validate_phone(data.phone):
            return None, "Invalid phone number format"

        updates = data.model_dump(exclude_unset=True)
        if "phone" in updates:
            updates["phone"] = normalize_phone(updates["phone"])
        if "full_name" in updates:
            updates["full_name"] = updates["full_name"].strip()

        updates["updated_at"] = self._now()

        updated = self.store.update_by_id(self.id_field, user_id, updates)
        if not updated:
            return None, "User not found"
        return public_user_profile(updated), None

    def change_password(
        self, user_id: str, data: ChangePasswordRequest
    ) -> tuple[bool, Optional[str]]:
        if data.new_password != data.confirm_password:
            return False, "New password and confirm password do not match"

        password_error = validate_password_strength(data.new_password)
        if password_error:
            return False, password_error

        user = self.get_user_by_id(user_id)
        if not user:
            return False, "User not found"

        if not verify_password(data.current_password, user["password_hash"]):
            return False, "Current password is incorrect"

        updated = self.store.update_by_id(
            self.id_field,
            user_id,
            {
                "password_hash": hash_password(data.new_password),
                "updated_at": self._now(),
            },
        )
        if not updated:
            return False, "User not found"
        return True, None

    def delete_account(self, user_id: str) -> tuple[bool, Optional[str]]:
        if not self.store.delete_by_id(self.id_field, user_id):
            return False, "User not found"
        return True, None

    def _issue_tokens(self, user: dict) -> tuple[str, str]:
        access_token = create_access_token(
            user["user_id"],
            extra={
                "role": user.get("role") or "customer",
                "is_active": bool(user.get("is_active", True)),
                "email": user.get("email"),
                "full_name": user.get("full_name"),
            },
        )
        refresh_token, _jti = create_refresh_token(user["user_id"])
        return access_token, refresh_token


auth_service = AuthService()

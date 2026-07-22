"""Authentication helpers and token revocation."""

from typing import Any, Optional

from app.db.repository import DbRepository

REVOKED_TOKENS_FILE = "revoked_tokens.json"


class TokenRevocationStore:
    """Persists revoked refresh token JTIs in PostgreSQL."""

    def __init__(self):
        self.store = DbRepository(REVOKED_TOKENS_FILE)

    def revoke(self, jti: str) -> None:
        if not self.is_revoked(jti):
            self.store.insert({"jti": jti})

    def is_revoked(self, jti: str) -> bool:
        return self.store.find_by_id("jti", jti) is not None

    def _read_jtis(self) -> list[str]:
        records = self.store.read_all()
        return [r.get("jti") for r in records if r.get("jti")]


token_revocation_store = TokenRevocationStore()

SENSITIVE_USER_FIELDS = {"password_hash"}


def sanitize_user(user: dict) -> dict:
    """Remove sensitive fields from a user record."""
    return {k: v for k, v in user.items() if k not in SENSITIVE_USER_FIELDS}


def public_user_profile(user: dict) -> dict:
    """Return safe user profile for API responses."""
    return {
        "user_id": user.get("user_id"),
        "full_name": user.get("full_name"),
        "email": user.get("email"),
        "phone": user.get("phone"),
        "address": user.get("address"),
        "avatar_url": user.get("avatar_url"),
        "role": user.get("role"),
        "is_active": user.get("is_active"),
        "created_at": user.get("created_at"),
        "updated_at": user.get("updated_at"),
    }


def build_token_response(
    access_token: str,
    refresh_token: str,
    user: dict,
) -> dict[str, Any]:
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "user": public_user_profile(user),
    }

"""Reusable FastAPI authentication dependencies."""

from collections.abc import Callable

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt.exceptions import InvalidTokenError

from app.core.auth import sanitize_user
from app.core.security import decode_token
from app.services.auth_service import auth_service

bearer_scheme = HTTPBearer(auto_error=False)

# Staff who can see and advance the kitchen order queue
KITCHEN_ROLES = frozenset({"chef", "admin", "owner"})
ADMIN_ROLES = frozenset({"admin", "owner"})


def _resolve_user_id(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None,
) -> str:
    if hasattr(request.state, "current_user") and request.state.current_user:
        user_id = request.state.current_user.get("user_id")
        if user_id:
            return user_id

    if credentials is None or credentials.scheme.lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        payload = decode_token(credentials.credentials)
    except InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user_id


async def get_current_user(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    """Resolve the full authenticated user (DB profile for checkout/profile/me)."""
    state_user = getattr(request.state, "current_user", None)
    # Full profile already loaded (has created_at from DB)
    if state_user and state_user.get("created_at") is not None:
        return state_user

    user_id = _resolve_user_id(request, credentials)
    user = auth_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive",
        )

    safe_user = sanitize_user(user)
    request.state.current_user = safe_user
    return safe_user


async def get_kitchen_actor(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    """Fast kitchen auth — trust JWT role claims when present (no DB)."""
    state_user = getattr(request.state, "current_user", None)
    if state_user and state_user.get("role"):
        role = (state_user.get("role") or "").lower()
        if role not in KITCHEN_ROLES:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Kitchen staff access required",
            )
        return state_user

    # Fallback: full user lookup
    user = await get_current_user(request, credentials)
    role = (user.get("role") or "").lower()
    if role not in KITCHEN_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Kitchen staff access required",
        )
    return user


async def get_current_user_id(
    current_user: dict = Depends(get_current_user),
) -> str:
    return current_user["user_id"]


def require_roles(*allowed_roles: str) -> Callable:
    """Dependency factory: require the current user to have one of the roles."""
    allowed = {role.lower() for role in allowed_roles}

    async def _checker(current_user: dict = Depends(get_current_user)) -> dict:
        role = (current_user.get("role") or "").lower()
        if role not in allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Kitchen staff access required",
            )
        return current_user

    return _checker


# Kitchen uses JWT-fast path
require_kitchen_staff = get_kitchen_actor


async def get_admin_actor(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> dict:
    """Require admin/owner — prefer JWT claims, hydrate full profile for writes."""
    state_user = getattr(request.state, "current_user", None)
    role = (state_user.get("role") if state_user else "") or ""
    role = role.lower()

    if state_user and role in ADMIN_ROLES:
        # Hydrate full profile for create/update flows that need phone etc.
        return await get_current_user(request, credentials)

    user = await get_current_user(request, credentials)
    if (user.get("role") or "").lower() not in ADMIN_ROLES:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required",
        )
    return user


require_admin = get_admin_actor

"""Ensure an admin account exists for the Solenne café."""

from dotenv import load_dotenv

load_dotenv()

from app.core.security import hash_password
from app.db.repository import DbRepository
from app.services.auth_service import auth_service

ADMIN_EMAIL = "admin@solenne.cafe"
ADMIN_PASSWORD = "AdminPass1!"
ADMIN_NAME = "Solenne Admin"
ADMIN_PHONE = "+15550009999"


def main() -> None:
    users = DbRepository("users.json")
    existing = None
    for user in users.read_all():
        if (user.get("email") or "").lower() == ADMIN_EMAIL:
            existing = user
            break

    if existing:
        users.update_by_id(
            "user_id",
            existing["user_id"],
            {
                "role": "admin",
                "password_hash": hash_password(ADMIN_PASSWORD),
                "is_active": True,
                "full_name": ADMIN_NAME,
            },
        )
        print(f"Updated admin account: {ADMIN_EMAIL} / {ADMIN_PASSWORD}")
        return

    from app.schemas.auth import RegisterRequest

    result, error = auth_service.register(
        RegisterRequest(
            full_name=ADMIN_NAME,
            email=ADMIN_EMAIL,
            password=ADMIN_PASSWORD,
            phone=ADMIN_PHONE,
            role="customer",
        )
    )
    if error:
        raise SystemExit(f"Failed to create admin: {error}")

    user_id = result["user"]["user_id"]
    users.update_by_id("user_id", user_id, {"role": "admin"})
    print(f"Created admin account: {ADMIN_EMAIL} / {ADMIN_PASSWORD}")
    print(f"User ID: {user_id}")


if __name__ == "__main__":
    main()

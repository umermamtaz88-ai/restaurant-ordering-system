"""Ensure a kitchen chef account exists for the Solenne café."""

from dotenv import load_dotenv

load_dotenv()

from app.core.security import hash_password
from app.db.repository import DbRepository
from app.services.auth_service import auth_service

CHEF_EMAIL = "chef@solenne.cafe"
CHEF_PASSWORD = "ChefPass1!"
CHEF_NAME = "Kitchen Chef"
CHEF_PHONE = "+15550001111"


def main() -> None:
    users = DbRepository("users.json")
    existing = None
    for user in users.read_all():
        if (user.get("email") or "").lower() == CHEF_EMAIL:
            existing = user
            break

    if existing:
        users.update_by_id(
            "user_id",
            existing["user_id"],
            {
                "role": "chef",
                "password_hash": hash_password(CHEF_PASSWORD),
                "is_active": True,
                "full_name": CHEF_NAME,
            },
        )
        print(f"Updated chef account: {CHEF_EMAIL} / {CHEF_PASSWORD}")
        return

    from app.schemas.auth import RegisterRequest

    result, error = auth_service.register(
        RegisterRequest(
            full_name=CHEF_NAME,
            email=CHEF_EMAIL,
            password=CHEF_PASSWORD,
            phone=CHEF_PHONE,
            role="customer",
        )
    )
    if error:
        raise SystemExit(f"Failed to create chef: {error}")

    user_id = result["user"]["user_id"]
    users.update_by_id("user_id", user_id, {"role": "chef"})
    print(f"Created chef account: {CHEF_EMAIL} / {CHEF_PASSWORD}")
    print(f"User ID: {user_id}")


if __name__ == "__main__":
    main()

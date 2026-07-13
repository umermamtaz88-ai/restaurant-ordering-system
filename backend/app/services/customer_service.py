"""Customer business logic."""

from typing import Optional

from app.schemas.customer import CustomerCreate, CustomerUpdate
from app.services.base_service import BaseService
from app.utils.validators import check_duplicate, validate_email


class CustomerService(BaseService):
    def __init__(self):
        super().__init__("customers.json", "customer_id")

    def create_customer(
        self, data: CustomerCreate, owner_id: str
    ) -> tuple[Optional[dict], Optional[str]]:
        if not validate_email(data.email):
            return None, "Invalid email format"

        owner_items = self.filter_owner_items(self.get_all(), owner_id)
        if check_duplicate(owner_items, "email", data.email, id_field="customer_id"):
            return None, f"Customer with email '{data.email}' already exists"

        customer = {
            "customer_id": self._generate_id("cust"),
            "owner_id": owner_id,
            "full_name": data.full_name,
            "email": data.email,
            "phone": data.phone,
            "address": data.address,
            "notes": data.notes,
            "created_at": self._now(),
        }
        return self.create(customer), None

    def update_customer(
        self, customer_id: str, data: CustomerUpdate, owner_id: str
    ) -> tuple[Optional[dict], Optional[str]]:
        existing = self.get_by_id_for_owner(customer_id, owner_id)
        if not existing:
            return None, "Customer not found"

        if data.email:
            if not validate_email(data.email):
                return None, "Invalid email format"
            owner_items = self.filter_owner_items(self.get_all(), owner_id)
            if check_duplicate(
                owner_items,
                "email",
                data.email,
                exclude_id=customer_id,
                id_field="customer_id",
            ):
                return None, f"Customer with email '{data.email}' already exists"

        updates = data.model_dump(exclude_unset=True)
        result = self.update_for_owner(customer_id, owner_id, updates)
        return result, None

    def list_customers(
        self,
        owner_id: str,
        q: Optional[str] = None,
        name: Optional[str] = None,
        phone: Optional[str] = None,
        email: Optional[str] = None,
        page: int = 1,
        limit: int = 10,
    ) -> dict:
        items = self.filter_owner_items(self.get_all(), owner_id)

        if name:
            name_lower = name.lower()
            items = [i for i in items if name_lower in i.get("full_name", "").lower()]
        if phone:
            items = [i for i in items if phone in i.get("phone", "")]
        if email:
            email_lower = email.lower()
            items = [i for i in items if email_lower in i.get("email", "").lower()]

        if q:
            query_lower = q.lower()
            items = [
                i
                for i in items
                if query_lower in i.get("full_name", "").lower()
                or query_lower in i.get("email", "").lower()
                or query_lower in i.get("phone", "")
            ]

        from app.utils.pagination import paginate

        result = paginate(items, page, limit)
        return {
            "items": result.items,
            "pagination": {
                "total_items": result.total_items,
                "total_pages": result.total_pages,
                "current_page": result.current_page,
                "has_next": result.has_next,
                "has_previous": result.has_previous,
            },
        }


customer_service = CustomerService()

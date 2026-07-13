"""Verify PostgreSQL-backed API still works."""

from datetime import date, timedelta

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def main() -> None:
    assert client.get("/health").status_code == 200
    assert client.get("/api/v1/orders").status_code == 401

    r = client.post(
        "/api/v1/auth/login",
        json={"email": "usera@test.com", "password": "SecurePass1!"},
    )
    print("login_a", r.status_code, r.json().get("message"))
    assert r.status_code == 200, r.text
    headers_a = {"Authorization": f"Bearer {r.json()['data']['access_token']}"}

    r = client.post(
        "/api/v1/auth/register",
        json={
            "full_name": "PG User",
            "email": "pguser2@test.com",
            "password": "SecurePass1!",
            "phone": "+923001112233",
        },
    )
    assert r.status_code == 201, r.text
    headers_pg = {"Authorization": "Bearer " + r.json()["data"]["access_token"]}

    r = client.post(
        "/api/v1/categories",
        headers=headers_pg,
        json={
            "name": "PG Pizza",
            "description": "x",
            "image_url": None,
            "active": True,
            "sort_order": 1,
        },
    )
    assert r.status_code == 201, r.text
    cat = r.json()["data"]["category_id"]

    r = client.post(
        "/api/v1/menu",
        headers=headers_pg,
        json={
            "name": "PG Margherita",
            "description": "x",
            "category_id": cat,
            "image_url": None,
            "price": 12.5,
            "discount_price": None,
            "available": True,
            "preparation_time": 15,
            "calories": 400,
            "ingredients": ["cheese"],
            "allergens": [],
            "spicy_level": 0,
            "featured": False,
        },
    )
    assert r.status_code == 201, r.text
    item = r.json()["data"]["item_id"]

    r = client.post(
        "/api/v1/customers",
        headers=headers_pg,
        json={
            "full_name": "PG Cust",
            "email": "pgcust2@test.com",
            "phone": "+1234567890",
            "address": "a",
            "notes": "",
        },
    )
    assert r.status_code == 201, r.text
    cust = r.json()["data"]["customer_id"]

    r = client.post(
        "/api/v1/orders",
        headers=headers_pg,
        json={
            "customer_id": cust,
            "order_type": "Takeaway",
            "items": [{"item_id": item, "quantity": 2}],
            "payment_method": "Cash",
            "notes": "pg",
        },
    )
    assert r.status_code == 201, r.text
    order = r.json()["data"]["order_id"]

    r = client.get("/api/v1/orders?page=1&limit=10", headers=headers_pg)
    assert r.status_code == 200
    assert r.json()["data"]["pagination"]["total_items"] >= 1

    r = client.get("/api/v1/menu?q=Margherita", headers=headers_pg)
    assert r.status_code == 200
    assert len(r.json()["data"]["items"]) >= 1

    assert client.get("/api/v1/dashboard", headers=headers_pg).status_code == 200
    assert client.get("/api/v1/reports/daily-sales", headers=headers_pg).status_code == 200
    assert client.get("/api/v1/reports/revenue", headers=headers_pg).status_code == 200

    assert client.get(f"/api/v1/orders/{order}", headers=headers_a).status_code == 404

    r = client.put(
        f"/api/v1/customers/{cust}",
        headers=headers_pg,
        json={"full_name": "PG Cust Updated"},
    )
    assert r.status_code == 200
    assert r.json()["data"]["full_name"] == "PG Cust Updated"

    assert client.delete(f"/api/v1/orders/{order}", headers=headers_pg).status_code == 200

    r = client.post(
        "/api/v1/coupons",
        headers=headers_pg,
        json={
            "code": "PG10",
            "type": "Percentage",
            "value": 10,
            "minimum_order": 5,
            "expiry_date": (date.today() + timedelta(days=30)).isoformat(),
            "active": True,
        },
    )
    assert r.status_code == 201, r.text

    r = client.post(
        "/api/v1/inventory",
        headers=headers_pg,
        json={
            "ingredient_name": "PG Flour",
            "quantity": 20,
            "unit": "kg",
            "minimum_stock": 5,
            "available": True,
        },
    )
    assert r.status_code == 201, r.text

    assert client.get("/api/v1/auth/me", headers=headers_pg).status_code == 200
    print("ALL POSTGRES API TESTS PASSED")


if __name__ == "__main__":
    main()

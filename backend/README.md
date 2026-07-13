# Restaurant Ordering System Backend

A production-quality **Restaurant / Pizza / Cafe Ordering Backend** built with **FastAPI** and **JSON file persistence**.

Designed for restaurants, pizza shops, cafes, bakeries, fast-food chains, and coffee shops. All data persists in JSON files — no database required.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Python 3.12+ | Runtime |
| FastAPI | Web framework |
| Pydantic v2 | Data validation |
| Uvicorn | ASGI server |
| filelock | Thread-safe JSON writes |
| pathlib | File path management |

---

## Installation

### Prerequisites

- Python 3.12 or higher
- pip

### Setup

```bash
# Clone or navigate to the project
cd "E:\ordering system\backend"

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

---

## Run Commands

```bash
# Start development server with hot reload
uvicorn app.main:app --reload

# Production mode
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**API Documentation:** http://127.0.0.1:8000/docs  
**Health Check:** http://127.0.0.1:8000/health

---

## Folder Structure

```text
backend/
├── app/
│   ├── api/                    # Route handlers
│   │   ├── categories.py
│   │   ├── menu.py
│   │   ├── orders.py
│   │   ├── customers.py
│   │   ├── coupons.py
│   │   ├── dashboard.py
│   │   ├── inventory.py
│   │   ├── reports.py
│   │   └── health.py
│   ├── services/               # Business logic layer
│   │   ├── base_service.py
│   │   ├── category_service.py
│   │   ├── menu_service.py
│   │   ├── order_service.py
│   │   ├── customer_service.py
│   │   ├── coupon_service.py
│   │   ├── inventory_service.py
│   │   ├── dashboard_service.py
│   │   ├── report_service.py
│   │   └── settings_service.py
│   ├── schemas/                # Request/response models
│   ├── models/                 # Domain models
│   ├── database/               # JSON data files
│   │   ├── menu.json
│   │   ├── categories.json
│   │   ├── customers.json
│   │   ├── orders.json
│   │   ├── coupons.json
│   │   ├── inventory.json
│   │   ├── reports.json
│   │   └── settings.json
│   ├── utils/                  # Helpers & utilities
│   └── main.py                 # FastAPI application
├── requirements.txt
└── README.md
```

---

## API Endpoints

All endpoints are prefixed with `/api/v1` unless noted.

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |

### Categories

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/categories` | List categories (search, filter, paginate) |
| GET | `/api/v1/categories/{id}` | Get category by ID |
| POST | `/api/v1/categories` | Create category |
| PUT | `/api/v1/categories/{id}` | Update category |
| DELETE | `/api/v1/categories/{id}` | Delete category |

### Menu

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/menu` | List menu items (search, filter, paginate) |
| GET | `/api/v1/menu/{id}` | Get menu item by ID |
| POST | `/api/v1/menu` | Create menu item |
| PUT | `/api/v1/menu/{id}` | Update menu item |
| DELETE | `/api/v1/menu/{id}` | Delete menu item |

### Customers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/customers` | List customers (search, filter, paginate) |
| GET | `/api/v1/customers/{id}` | Get customer by ID |
| POST | `/api/v1/customers` | Create customer |
| PUT | `/api/v1/customers/{id}` | Update customer |
| DELETE | `/api/v1/customers/{id}` | Delete customer |

### Orders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/orders` | List orders (search, filter, paginate) |
| GET | `/api/v1/orders/{id}` | Get order by ID |
| POST | `/api/v1/orders` | Create order (full workflow) |
| PUT | `/api/v1/orders/{id}` | Update order status |
| DELETE | `/api/v1/orders/{id}` | Delete order |

### Coupons

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/coupons` | List coupons |
| GET | `/api/v1/coupons/{id}` | Get coupon by ID |
| POST | `/api/v1/coupons` | Create coupon |
| PUT | `/api/v1/coupons/{id}` | Update coupon |
| DELETE | `/api/v1/coupons/{id}` | Delete coupon |

### Inventory

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/inventory` | List inventory items |
| GET | `/api/v1/inventory/{id}` | Get inventory item |
| POST | `/api/v1/inventory` | Create inventory item |
| PUT | `/api/v1/inventory/{id}` | Update inventory item |
| DELETE | `/api/v1/inventory/{id}` | Delete inventory item |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/dashboard` | Business statistics |

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/reports/daily-sales` | Daily sales report |
| GET | `/api/v1/reports/weekly-sales` | Weekly sales report |
| GET | `/api/v1/reports/monthly-sales` | Monthly sales report |
| GET | `/api/v1/reports/most-ordered-items` | Most ordered items |
| GET | `/api/v1/reports/revenue` | Revenue breakdown |
| GET | `/api/v1/reports/inventory` | Inventory status |
| GET | `/api/v1/reports/customers` | Customer analytics |

---

## Response Format

### Success

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "message": "Order not found",
  "data": null
}
```

### Pagination

List endpoints return paginated data:

```json
{
  "success": true,
  "message": "Menu items retrieved successfully",
  "data": {
    "items": [],
    "pagination": {
      "total_items": 50,
      "total_pages": 5,
      "current_page": 1,
      "has_next": true,
      "has_previous": false
    }
  }
}
```

---

## Example Requests

### Create a Customer

```bash
curl -X POST "http://127.0.0.1:8000/api/v1/customers" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Alice Brown",
    "email": "alice@example.com",
    "phone": "+1555987654",
    "address": "100 Broadway, NY"
  }'
```

### Create an Order

```bash
curl -X POST "http://127.0.0.1:8000/api/v1/orders" \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "cust-john",
    "order_type": "Delivery",
    "items": [
      {"item_id": "item-margherita", "quantity": 2},
      {"item_id": "item-latte", "quantity": 1}
    ],
    "payment_method": "Card",
    "coupon_code": "SAVE10",
    "notes": "Extra napkins please"
  }'
```

### List Menu with Filters

```bash
curl "http://127.0.0.1:8000/api/v1/menu?available=true&featured=true&page=1&limit=10"
```

### Search Customers

```bash
curl "http://127.0.0.1:8000/api/v1/customers?q=john&page=1&limit=10"
```

### Dashboard Stats

```bash
curl "http://127.0.0.1:8000/api/v1/dashboard"
```

---

## Example Responses

### Health Check

```json
{
  "status": "healthy"
}
```

### Order Created

```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order_id": "ord-a1b2c3d4",
    "customer_id": "cust-john",
    "order_number": "ORD-20260711-0001",
    "order_type": "Delivery",
    "items": [
      {
        "item_id": "item-margherita",
        "name": "Margherita Pizza",
        "quantity": 2,
        "unit_price": 12.99,
        "total_price": 25.98
      }
    ],
    "subtotal": 25.98,
    "discount": 2.6,
    "tax": 1.87,
    "delivery_fee": 4.99,
    "total": 30.24,
    "payment_method": "Card",
    "payment_status": "Pending",
    "order_status": "Pending",
    "coupon_code": "SAVE10",
    "estimated_time": 50,
    "notes": "Extra napkins please",
    "created_at": "2026-07-11T12:00:00+00:00",
    "updated_at": "2026-07-11T12:00:00+00:00"
  }
}
```

### Dashboard

```json
{
  "success": true,
  "message": "Dashboard statistics retrieved successfully",
  "data": {
    "total_orders": 2,
    "todays_orders": 0,
    "todays_revenue": 0.0,
    "monthly_revenue": 52.35,
    "pending_orders": 0,
    "completed_orders": 2,
    "cancelled_orders": 0,
    "popular_items": [
      {"item_id": "item-margherita", "name": "Margherita Pizza", "total_ordered": 2}
    ],
    "top_customers": [
      {"customer_id": "cust-john", "full_name": "John Doe", "total_spent": 35.09, "order_count": 1}
    ],
    "low_stock_items": [
      {"inventory_id": "inv-beef", "ingredient_name": "Ground Beef", "quantity": 8.0, "minimum_stock": 10.0, "unit": "kg"}
    ],
    "average_order_value": 26.18
  }
}
```

---

## Order Workflow

1. Customer creates order via POST `/api/v1/orders`
2. System validates all menu items exist and are available
3. Subtotal calculated from item prices (discount prices applied when set)
4. Coupon validated and discount applied (if provided)
5. Tax calculated from settings (`settings.json` → `tax_rate`)
6. Delivery fee added for Delivery orders (minimum order enforced)
7. Total calculated and validated
8. Unique order number generated (`ORD-YYYYMMDD-XXXX`)
9. Order saved to `orders.json`
10. Complete order summary returned

---

## API Testing Checklist

- [ ] **Health** — `GET /health` returns `{"status": "healthy"}`
- [ ] **Menu CRUD** — Create, read, update, delete menu items
- [ ] **Category CRUD** — Full category lifecycle
- [ ] **Customer CRUD** — Including duplicate email validation
- [ ] **Coupon CRUD** — Including duplicate code validation
- [ ] **Inventory CRUD** — Including low stock detection
- [ ] **Order CRUD** — Full order workflow with coupon/tax/delivery
- [ ] **Search** — `?q=` on menu, categories, orders, customers, coupons
- [ ] **Filters** — Available, featured, category, price range, status, date range
- [ ] **Pagination** — `page` and `limit` with correct metadata
- [ ] **Dashboard** — All stats returned correctly
- [ ] **Reports** — Daily, weekly, monthly, revenue, inventory, customer
- [ ] **JSON Persistence** — Data survives server restart
- [ ] **Swagger Docs** — Available at `/docs` with tags and examples

---

## Architecture

The backend follows a **layered architecture** designed for easy database migration:

```
Routes (api/)  →  Services (services/)  →  FileManager (utils/)  →  JSON files
```

- **Routes**: HTTP handling, query params, status codes
- **Schemas**: Pydantic request/response validation
- **Services**: All business logic (order workflow, reports, validation)
- **Models**: Domain entity definitions
- **Utils**: File I/O, pagination, constants, validators

To migrate to PostgreSQL or MongoDB later, replace `FileManager` calls in services with database repository methods. Routes and schemas remain unchanged.

---

## Configuration

Edit `app/database/settings.json`:

```json
{
  "tax_rate": 0.08,
  "delivery_fee": 4.99,
  "min_delivery_order": 15.0,
  "restaurant_name": "Bella Italia Restaurant",
  "currency": "USD"
}
```

---

## License

MIT — Free to use for personal and commercial projects.

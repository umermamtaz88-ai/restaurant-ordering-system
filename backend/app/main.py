"""Restaurant Ordering System - FastAPI Application."""

from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from fastapi.responses import JSONResponse
from jwt.exceptions import InvalidTokenError

load_dotenv()

from app.api import (
    admin,
    auth,
    categories,
    coupons,
    customers,
    dashboard,
    health,
    inventory,
    menu,
    orders,
    reports,
)
from app.core.auth import sanitize_user
from app.core.security import decode_token
from app.db.session import init_db
from app.services.auth_service import auth_service
from app.utils.response import error_response

PUBLIC_PATHS = {
    "/",
    "/health",
    "/docs",
    "/openapi.json",
    "/redoc",
    "/api/v1/auth/register",
    "/api/v1/auth/signup",
    "/api/v1/auth/login",
    "/api/v1/auth/refresh",
}


def _is_public_path(path: str) -> bool:
    normalized = path.rstrip("/") or "/"
    if path in PUBLIC_PATHS or normalized in PUBLIC_PATHS:
        return True
    return path.startswith("/docs") or path.startswith("/redoc")


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="Restaurant Ordering System API",
    description=(
        "A production-quality restaurant, pizza shop, cafe, and fast-food ordering "
        "backend with Neon PostgreSQL persistence. Supports authentication, menu "
        "management, orders, customers, coupons, inventory, dashboard analytics, "
        "and reports."
    ),
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:3000",
        "http://localhost:3000",
        "http://127.0.0.1:3001",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def authentication_middleware(request: Request, call_next):
    if request.method == "OPTIONS":
        return await call_next(request)

    path = request.url.path
    if _is_public_path(path):
        return await call_next(request)

    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return JSONResponse(
            status_code=401,
            content=error_response("Not authenticated"),
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = auth_header.split(" ", 1)[1]
    try:
        payload = decode_token(token)
    except InvalidTokenError:
        return JSONResponse(
            status_code=401,
            content=error_response("Invalid or expired token"),
            headers={"WWW-Authenticate": "Bearer"},
        )

    if payload.get("type") != "access":
        return JSONResponse(
            status_code=401,
            content=error_response("Invalid token type"),
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload.get("sub")
    if not user_id:
        return JSONResponse(
            status_code=401,
            content=error_response("Invalid token payload"),
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Prefer JWT claims to avoid a DB hit on every request (kitchen polls, etc.)
    if "role" in payload:
        if not payload.get("is_active", True):
            return JSONResponse(
                status_code=401,
                content=error_response("User not found or inactive"),
                headers={"WWW-Authenticate": "Bearer"},
            )
        request.state.current_user = {
            "user_id": user_id,
            "email": payload.get("email"),
            "full_name": payload.get("full_name"),
            "role": payload.get("role") or "customer",
            "is_active": True,
            "phone": None,
            "address": None,
            "avatar_url": None,
            "created_at": None,
            "updated_at": None,
        }
        return await call_next(request)

    user = auth_service.get_user_by_id(user_id)
    if not user or not user.get("is_active", True):
        return JSONResponse(
            status_code=401,
            content=error_response("User not found or inactive"),
            headers={"WWW-Authenticate": "Bearer"},
        )

    request.state.current_user = sanitize_user(user)
    return await call_next(request)


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "message": exc.detail if isinstance(exc.detail, str) else str(exc.detail),
            "data": None,
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    message = errors[0]["msg"] if errors else "Validation error"
    if errors and "loc" in errors[0]:
        field = errors[0]["loc"][-1]
        message = f"{field}: {errors[0]['msg']}"
    return JSONResponse(
        status_code=422,
        content={"success": False, "message": message, "data": None},
    )


app.include_router(health.router)
app.include_router(auth.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")
app.include_router(categories.router, prefix="/api/v1")
app.include_router(menu.router, prefix="/api/v1")
app.include_router(customers.router, prefix="/api/v1")
app.include_router(orders.router, prefix="/api/v1")
app.include_router(coupons.router, prefix="/api/v1")
app.include_router(inventory.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(reports.router, prefix="/api/v1")


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema

    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
            "bearerFormat": "JWT",
            "description": "Enter JWT access token from login or register",
        }
    }

    for path, path_item in openapi_schema.get("paths", {}).items():
        if _is_public_path(path):
            continue
        for method in path_item.values():
            if isinstance(method, dict):
                method.setdefault("security", [{"BearerAuth": []}])

    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


@app.get("/", tags=["Root"], summary="API Root")
async def root():
    return {
        "success": True,
        "message": "Welcome to Restaurant Ordering System API",
        "data": {
            "docs": "/docs",
            "health": "/health",
            "version": "1.0.0",
            "auth": {
                "register": "/api/v1/auth/register",
                "signup": "/api/v1/auth/signup",
                "login": "/api/v1/auth/login",
                "refresh": "/api/v1/auth/refresh",
                "me": "/api/v1/auth/me",
            },
        },
    }

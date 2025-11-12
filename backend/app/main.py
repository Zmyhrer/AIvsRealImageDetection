from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.middleware import add_middlewares
from app.core.logging import setup_logging


def create_app() -> FastAPI:

    setup_logging()

    # Create FastAPI
    app = FastAPI(
        title="My FastAPI Project",
        version="1.0.0",
        description="API for demonstration purposes",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json"
    )

    # Middleware
    add_middlewares(app)

    
    # Exception handlers
    @app.exception_handler(404)
    async def not_found_handler(request: Request, exc):
        return JSONResponse(status_code=404, content={"message": "Resource not found"})

    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=422,
            content={"detail": exc.errors(), "body": exc.body}
        )

    
    # API routers
    app.include_router(app.predict.router, prefix="/api/v1/predict", tags=["prediction"])

    
    # Root and health endpoints
    @app.get("/", tags=["root"])
    async def root():
        return {"message": "Welcome to the API!"}

    @app.get("/health", tags=["health"])
    async def health_check():
        return {"status": "ok"}

    return app


# Application instance
app = create_app()
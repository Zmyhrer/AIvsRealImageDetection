from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from app.api.v1.routes.predict import router as predict_router
from app.middleware import add_middlewares
from app.core.logging import setup_logging

# Factory function to create and configure the FastAPI app
def create_app() -> FastAPI:

    setup_logging()  # configure logging

    # Initialize FastAPI with metadata and docs configuration
    app = FastAPI(
        title="My FastAPI Project",
        version="1.0.0",
        description="API for demonstration purposes",
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json"
    )

    # Attach middlewares like CORS and request logging
    add_middlewares(app)

    # Handle 404 errors with a JSON response
    @app.exception_handler(404)
    async def not_found_handler(request: Request, exc):
        return JSONResponse(status_code=404, content={"message": "Resource not found"})

    # Handle validation errors from FastAPI request parsing
    @app.exception_handler(RequestValidationError)
    async def validation_exception_handler(request: Request, exc: RequestValidationError):
        return JSONResponse(
            status_code=422,
            content={"detail": exc.errors(), "body": str(exc.body)}
        )

    # Register API routes
    app.include_router(predict_router, prefix="/api/v1/predict", tags=["prediction"])

    # Root endpoint for basic API check
    @app.get("/", tags=["root"])
    async def root():
        return {"message": "Welcome to the API!"}

    # Health check endpoint
    @app.get("/health", tags=["health"])
    async def health_check():
        return {"status": "ok"}

    return app

# Create the app instance
app = create_app()

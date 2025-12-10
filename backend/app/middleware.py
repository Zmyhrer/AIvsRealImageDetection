from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import time
import logging

# Attaches CORS and logging middlewares to a FastAPI app
def add_middlewares(app: FastAPI):
    
    # Enable CORS for local frontend development
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173"],
        allow_methods=["*"],
        allow_headers=["*"]
    )

    # Logs request method, URL, and processing time
    @app.middleware("http")
    async def log_requests(request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time  # compute duration of request
        logging.info(f"{request.method} {request.url} completed in {process_time:.2f}s")
        return response

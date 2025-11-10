from fastapi import FastAPI
from app.api.v1.routes import predict

app = FastAPI(title="AI vs Real Image Detection", version="1.0")
app.include_router(predict.router, prefix="/api/v1")

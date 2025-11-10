from fastapi import APIRouter, UploadFile, File
from PIL import Image
from app.service.model_service import predict_image

router = APIRouter()

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    img = Image.open(file.file)
    result, confidence = predict_image(img)
    return {"prediction": result, "confidence": confidence}

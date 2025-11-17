from fastapi import APIRouter, UploadFile, File, HTTPException
from PIL import Image
from app.service.model_service import predict_image
import io

router = APIRouter()

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        img = Image.open(io.BytesIO(contents))

        result, confidence = predict_image(img)
        return {"prediction": result, "confidence": round(confidence, 4)}
    
    except Exception:
        raise HTTPException(status_code = 400, detail="Invalid image file")
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from PIL import Image, UnidentifiedImageError
from app.service.model_service import predict_image
import io

router = APIRouter()

@router.post("/", summary="Predict whether an uploaded image is AI-generated or real")
async def predict(file: UploadFile = File(...)):
    """
    Accepts an uploaded image and returns a prediction of whether it is AI-generated or real.
    """
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A valid image file is required."
        )

    # Read and validate image
    try:
        contents = await file.read()
        img = Image.open(io.BytesIO(contents))
        if img.mode != "RGB":
            img = img.convert("RGB")
    except UnidentifiedImageError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is not a valid image format."
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to process the uploaded file."
        )

    # Call model and handle any model exceptions as 400
    try:
        prediction, confidence = predict_image(img)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Model error: {str(e)}"
        )

    return {
        "prediction": prediction,
        "confidence": round(confidence, 4)
    }

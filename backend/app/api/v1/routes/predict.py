from fastapi import APIRouter, UploadFile, File, HTTPException, status
from PIL import Image, UnidentifiedImageError
from PIL.Image import Image as PILImage
from app.service.model_service import predict_image
import io

router = APIRouter()

# Endpoint to predict if an uploaded image is AI-generated or real
@router.post("/", summary="Predict whether an uploaded image is AI-generated or real")
async def predict(file: UploadFile = File(...)):
    """
    Accepts an uploaded image and returns a prediction of whether it is AI-generated or real.
    """
    if not file.filename:
        # Reject uploads with no filename
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A valid image file is required."
        )

    # Read and validate the image, convert to RGB if needed
    try:
        contents = await file.read()
        img: PILImage = Image.open(io.BytesIO(contents))
        if img.mode != "RGB":
            img = img.convert("RGB")  # Ensure consistent input for model
    except UnidentifiedImageError:
        # File is not a recognizable image
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is not a valid image format."
        )
    except Exception:
        # Catch any other read/processing errors
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unable to process the uploaded file."
        )

    # Run the model and handle any unexpected exceptions gracefully
    try:
        prediction, confidence = predict_image(img)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Model error: {str(e)}"
        )

    # Return prediction and rounded confidence
    return {
        "prediction": prediction,
        "confidence": round(confidence, 4)
    }

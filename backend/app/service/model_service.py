from transformers import AutoImageProcessor, SiglipForImageClassification
import torch
from PIL import Image

MODEL_ID = "Ateeqq/ai-vs-human-image-detector"

processor = AutoImageProcessor.from_pretrained(MODEL_ID)
model = SiglipForImageClassification.from_pretrained(MODEL_ID)
model.eval()

TEMPERATURE = 5.0   # Adjusts confidence levels for more calibrated output

def predict_image(img: Image.Image, temperature: float = TEMPERATURE):
    """
    Runs an image through the classifier and returns the predicted label
    along with a calibrated confidence score.
    """
    inputs = processor(img, return_tensors="pt")
    
    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits
    if logits.numel() == 0:
        raise ValueError("Model returned empty logits")

    # Temperature scaling for confidence smoothing
    scaled_logits = logits / temperature
    probs = torch.softmax(scaled_logits, dim=-1)[0]

    pred_idx = scaled_logits.argmax(-1).item()
    raw_label = model.config.id2label.get(pred_idx, "Unknown")
    confidence = float(probs[pred_idx])

    # Normalize label names for downstream use
    normalized_label = (
        raw_label.replace("hum", "Real")
                 .replace("ai", "AI")
    )

    return normalized_label, confidence

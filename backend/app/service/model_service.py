from transformers import AutoImageProcessor, SiglipForImageClassification
import torch
from PIL import Image

MODEL_ID = "Ateeqq/ai-vs-human-image-detector"

processor = AutoImageProcessor.from_pretrained(MODEL_ID)
model = SiglipForImageClassification.from_pretrained(MODEL_ID)
model.eval()

TEMPERATURE = 5.0  

# Predicts the class of an image and returns label and confidence
def predict_image(img: Image.Image, temperature: float = TEMPERATURE):
    inputs = processor(img, return_tensors="pt")
    
    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits
    if logits.numel() == 0:  # handle case where model outputs nothing
        raise ValueError("Model returned empty logits")

    scaled_logits = logits / temperature  # adjust logits for temperature scaling
    probs = torch.softmax(scaled_logits, dim=-1)[0]  # take first batch element
    pred_idx = scaled_logits.argmax(-1).item()
    label = model.config.id2label.get(pred_idx, "Unknown")
    confidence = float(probs[pred_idx])
    
    return label.replace("AI-generated", "AI"), confidence

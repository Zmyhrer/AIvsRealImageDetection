from transformers import AutoImageProcessor, AutoModelForImageClassification
import torch
from PIL import Image
import numpy as np

MODEL_ID = "Ateeqq/ai-vs-human-image-detector"

processor = AutoImageProcessor.from_pretrained(MODEL_ID)
model = AutoModelForImageClassification.from_pretrained(MODEL_ID)

def predict_image(img: Image.Image):
    inputs = processor(img, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
    logits = outputs.logits
    probs = torch.softmax(logits, dim=1)
    confidence_ai = float(probs[0][1])
    prediction = "AI" if confidence_ai > 0.5 else "Real"
    return prediction, confidence_ai

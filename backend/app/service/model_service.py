from transformers import AutoImageProcessor, SiglipForImageClassification
import torch
from PIL import Image

MODEL_ID = "Ateeqq/ai-vs-human-image-detector"

processor = AutoImageProcessor.from_pretrained(MODEL_ID)
model = SiglipForImageClassification.from_pretrained(MODEL_ID)
model.eval()

TEMPERATURE = 5.0  

def predict_image(img: Image.Image, temperature: float = TEMPERATURE):
    
    # Preprocess the image
    inputs = processor(img, return_tensors="pt")
    
    # Get logits without computing gradients
    with torch.no_grad():
        outputs = model(**inputs)
    
    logits = outputs.logits
    # Apply temperature scaling
    scaled_logits = logits / temperature
    probs = torch.softmax(scaled_logits, dim=-1)[0]
    
    # Get predicted class
    pred_idx = scaled_logits.argmax(-1).item()
    pred_label = model.config.id2label[pred_idx]
    pred_confidence = float(probs[pred_idx])

    # Update label
    if "ai" in pred_label.lower():
        pred_label = "AI"
    else:
        pred_label = "Real"
    
    return pred_label, pred_confidence

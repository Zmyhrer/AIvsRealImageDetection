from transformers import AutoImageProcessor, SiglipForImageClassification
import torch
from PIL import Image

MODEL_ID = "Ateeqq/ai-vs-human-image-detector"

processor = AutoImageProcessor.from_pretrained(MODEL_ID)
model = SiglipForImageClassification.from_pretrained(MODEL_ID)
model.eval()

def predict_image(img: Image.Image):
    inputs = processor(img, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs)
    logits = outputs.logits
    probs = torch.softmax(logits, dim=-1)[0]

    pred_idx = logits.argmax(-1).item()
    pred_label = model.config.id2label[pred_idx]
    pred_confidence = float(probs[pred_idx])

    return pred_label, pred_confidence
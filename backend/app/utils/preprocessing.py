
from PIL import Image
import numpy as np

def preprocess_image(img: Image.Image, target_size=(224, 224)) -> np.ndarray:
    if img.mode != "RGB":
        img = img.convert("RGB")

    img = img.resize(target_size)
    img_array = np.array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    return img_array
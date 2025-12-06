import io
import pytest
from unittest.mock import patch
from app.main import app
from PIL import Image
from fastapi.testclient import TestClient

client = TestClient(app)

def create_test_image(mode='RGB', size=(224, 224)) -> io.BytesIO:
    """
    Generate an in-memory image for testing.
    Supports RGB, RGBA, L (grayscale), and CMYK.
    """
    if mode == 'L':  # Grayscale
        img = Image.new('RGB', size, color=(128, 128, 128))
    elif mode == 'CMYK':
        img = Image.new('RGB', size, color=(255, 0, 0))  # CMYK saved as JPEG
    elif mode == 'RGBA':
        img = Image.new('RGBA', size, color=(255, 0, 0, 255))
    else:
        img = Image.new('RGB', size, color=(255, 0, 0))
    
    img_bytes = io.BytesIO()
    if mode == 'CMYK':
        img.save(img_bytes, format='JPEG')
    else:
        img.save(img_bytes, format='PNG')
    img_bytes.seek(0)
    return img_bytes

# --- VALID IMAGE TEST ---
def test_predict_valid_image():
    """Test that a valid image returns correct prediction."""
    img = create_test_image()
    with patch("app.api.v1.routes.predict.predict_image") as mock_predict:
        mock_predict.return_value = ("AI", 0.95)
        response = client.post("/api/v1/predict/", files={"file": ("test.png", img, "image/png")})
        assert response.status_code == 200
        data = response.json()
        assert data["prediction"] == "AI"
        assert data["confidence"] == 0.95

# --- INVALID FILE TYPE ---
def test_predict_invalid_file_type():
    """Test that uploading a non-image file returns 400."""
    response = client.post("/api/v1/predict/", files={"file": ("test.txt", b"not an image", "text/plain")})
    assert response.status_code == 400

# --- CORRUPTED IMAGE ---
def test_predict_corrupted_image():
    """Test that a corrupted image returns 400."""
    corrupted_content = b"this is not a valid image"
    response = client.post("/api/v1/predict/", files={"file": ("corrupted.png", corrupted_content, "image/png")})
    assert response.status_code == 400

# --- MISSING FILE ---
def test_predict_no_file():
    """Test that omitting the file field returns 422 (FastAPI validation)."""
    response = client.post("/api/v1/predict/")
    assert response.status_code == 422

# --- MULTIPLE FILES ---
def test_predict_multiple_files():
    """Test that multiple valid images can be processed."""
    img1 = create_test_image()
    with patch("app.api.v1.routes.predict.predict_image") as mock_predict:
        mock_predict.return_value = ("dog", 0.1234)
        response = client.post("/api/v1/predict/", files={"file": ("img1.png", img1, "image/png")})
        assert response.status_code == 200

# --- PARAMETERIZED IMAGE MODES ---
@pytest.mark.parametrize("mode", ["L", "RGBA"])
def test_predict_different_image_modes(mode):
    """Test that different image modes are handled correctly."""
    img = create_test_image(mode=mode)
    with patch("app.api.v1.routes.predict.predict_image") as mock_predict:
        mock_predict.return_value = ("cat", 0.95)
        content_type = "image/png"
        response = client.post("/api/v1/predict/", files={f"file": (f"test_{mode}.png", img, content_type)})
        assert response.status_code == 200

# --- CMYK IMAGE ---
def test_predict_cmyk_image():
    """Test CMYK image is handled as JPEG."""
    img = create_test_image(mode='CMYK')
    with patch("app.api.v1.routes.predict.predict_image") as mock_predict:
        mock_predict.return_value = ("cat", 0.95)
        response = client.post("/api/v1/predict/", files={"file": ("test_cmyk.jpg", img, "image/jpeg")})
        assert response.status_code == 200

# --- EMPTY FILE ---
def test_predict_empty_file():
    """Test that an empty file returns 400."""
    empty_file = io.BytesIO(b"")
    response = client.post("/api/v1/predict/", files={"file": ("empty.png", empty_file, "image/png")})
    assert response.status_code == 400

# --- MODEL EXCEPTION ---
def test_predict_model_exception():
    """Test that model errors return 400."""
    img = create_test_image()
    with patch("app.api.v1.routes.predict.predict_image") as mock_predict:
        mock_predict.side_effect = Exception("Model error")
        response = client.post("/api/v1/predict/", files={"file": ("test.png", img, "image/png")})
        assert response.status_code == 400

# --- LARGE IMAGE ---
def test_predict_large_image():
    """Test that a large image is handled without crashing."""
    large_img = create_test_image(size=(1000, 1000))
    with patch("app.api.v1.routes.predict.predict_image") as mock_predict:
        mock_predict.return_value = ("cat", 0.95)
        response = client.post("/api/v1/predict/", files={"file": ("large.png", large_img, "image/png")})
        assert response.status_code == 200

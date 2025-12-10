import io
import pytest
from unittest.mock import patch
from PIL import Image
from fastapi import UploadFile, HTTPException
from fastapi.testclient import TestClient
from app.main import app
from app.api.v1.routes import predict
from app.service import model_service

client = TestClient(app)

def create_test_image(mode='RGB', size=(224, 224)) -> io.BytesIO:
    if mode == 'L':
        img = Image.new('RGB', size, color=(128, 128, 128))
    elif mode == 'CMYK':
        img = Image.new('RGB', size, color=(255, 0, 0))
    elif mode == 'RGBA':
        img = Image.new('RGBA', size, color=(255, 0, 0, 255))
    else:
        img = Image.new('RGB', size, color=(255, 0, 0))

    img_bytes = io.BytesIO()
    img.save(img_bytes, format='JPEG' if mode == 'CMYK' else 'PNG')
    img_bytes.seek(0)
    return img_bytes

# testing if a normal image uploads and gets predicted correctly
def test_predict_valid_image():
    img = create_test_image()
    with patch("app.api.v1.routes.predict.predict_image") as mock_predict:
        mock_predict.return_value = ("AI", 0.95)
        response = client.post("/api/v1/predict/", files={"file": ("test.png", img, "image/png")})
        assert response.status_code == 200
        data = response.json()
        assert data["prediction"] == "AI"
        assert data["confidence"] == 0.95

# making sure non-image files trigger a proper error
def test_predict_invalid_file_type():
    response = client.post("/api/v1/predict/", files={"file": ("test.txt", b"not an image", "text/plain")})
    assert response.status_code == 400

# verifying corrupted images get rejected by the endpoint
def test_predict_corrupted_image():
    response = client.post("/api/v1/predict/", files={"file": ("corrupted.png", b"notanimage", "image/png")})
    assert response.status_code == 400

# checking that a request with no file at all raises a validation error
def test_predict_no_file():
    response = client.post("/api/v1/predict/")
    assert response.status_code == 422

# direct test: empty filename should trigger a 400 error
def test_predict_empty_filename_direct():
    class DummyUpload:
        filename = ""
        async def read(self):
            return b"fakeimagecontent"

    import asyncio
    with pytest.raises(HTTPException) as exc_info:
        asyncio.run(predict.predict(file=DummyUpload()))
    assert exc_info.value.status_code == 400
    assert "valid image file" in exc_info.value.detail

# simulating file.read() failing to ensure endpoint responds correctly
def test_predict_image_read_exception(monkeypatch):
    class FakeUpload:
        filename = "test.png"
        async def read(self):
            raise Exception("read fail")

    import asyncio
    async def call_predict():
        await predict.predict(file=FakeUpload())

    exc_info = pytest.raises(Exception, lambda: asyncio.run(call_predict()))
    assert isinstance(exc_info.value, Exception)
    assert str(exc_info.value) == "400: Unable to process the uploaded file."

# async test for empty filename via UploadFile object
@pytest.mark.asyncio
async def test_predict_endpoint_empty_filename():
    from app.api.v1.routes import predict
    from fastapi import UploadFile
    import io
    dummy_file = UploadFile(filename="", file=io.BytesIO(b"fake"))
    import pytest
    with pytest.raises(Exception) as exc_info:
        await predict.predict(file=dummy_file)
    assert "valid image file" in str(exc_info.value)

# edge case: model returns empty logits, should raise ValueError
def test_predict_image_empty_logits(monkeypatch):
    import torch
    class EmptyLogitsModel:
        class Config:
            id2label = {0: "AI", 1: "Real"}
        config = Config()
        def eval(self): pass
        def __call__(self, **kwargs):
            return type("Output", (), {"logits": torch.empty((0, 2))})()

    monkeypatch.setattr(model_service, "model", EmptyLogitsModel())
    monkeypatch.setattr(model_service, "processor", lambda img, **kw: {"pixel_values": None})

    img = Image.new("RGB", (64, 64))
    import pytest
    with pytest.raises(ValueError, match="empty logits"):
        model_service.predict_image(img)

# testing that various image modes like L, RGBA, CMYK are handled without errors
@pytest.mark.parametrize("mode", ["L", "RGBA", "CMYK"])
def test_predict_different_image_modes(mode):
    img = create_test_image(mode=mode)
    with patch("app.api.v1.routes.predict.predict_image") as mock_predict:
        mock_predict.return_value = ("cat", 0.95)
        content_type = "image/jpeg" if mode == "CMYK" else "image/png"
        response = client.post("/api/v1/predict/", files={"file": (f"test_{mode}.png", img, content_type)})
        assert response.status_code == 200

# simulating the model throwing an exception to check 400 response
def test_predict_model_exception():
    img = create_test_image()
    with patch("app.api.v1.routes.predict.predict_image") as mock_predict:
        mock_predict.side_effect = Exception("Model error")
        response = client.post("/api/v1/predict/", files={"file": ("test.png", img, "image/png")})
        assert response.status_code == 400

# uploading an empty file should trigger a 400
def test_predict_empty_file():
    empty_file = io.BytesIO(b"")
    response = client.post("/api/v1/predict/", files={"file": ("empty.png", empty_file, "image/png")})
    assert response.status_code == 400

# large image uploads should still work fine
def test_predict_large_image():
    large_img = create_test_image(size=(1000, 1000))
    with patch("app.api.v1.routes.predict.predict_image") as mock_predict:
        mock_predict.return_value = ("cat", 0.95)
        response = client.post("/api/v1/predict/", files={"file": ("large.png", large_img, "image/png")})
        assert response.status_code == 200

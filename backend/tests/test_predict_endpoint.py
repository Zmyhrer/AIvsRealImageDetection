"""
Integration test for the /api/v1/predict endpoint.
"""

from fastapi.testclient import TestClient
from app.main import app
from pathlib import Path

client = TestClient(app)

def test_predict_endpoint_with_valid_image():
    """
    Test that POST /api/v1/predict with a valid image returns
    a JSON containing prediction and confidence.
    """
    test_image_path = Path(__file__).parent / "test_image.jpg"

    assert test_image_path.exists(), f"Test image not found at {test_image_path}"

    with open(test_image_path, "rb") as f:
        response = client.post(
            "/api/v1/predict",
            files={"file": ("test_image.jpg", f, "image/jpeg")}
        )

    assert response.status_code == 200
    data = response.json()
    assert "prediction" in data
    assert "confidence" in data
    assert data["prediction"] in ["AI", "Real"]
    assert 0.0 <= data["confidence"] <= 1.0

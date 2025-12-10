from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# Test that the root endpoint returns the welcome message
def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the API!"}

# Test that the health endpoint returns status "ok"
def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

# Test that requesting a nonexistent route triggers the 404 handler
def test_404_handler():
    response = client.get("/nonexistent")
    assert response.status_code == 404
    assert response.json() == {"message": "Resource not found"}

# Test that missing required data triggers the validation exception handler
def test_validation_exception_handler():
    response = client.post("/api/v1/predict/")
    assert response.status_code == 422
    assert "detail" in response.json()

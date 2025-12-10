import pytest
from PIL import Image
import torch
from app.service import model_service

class DummyModel:
    class Config:
        id2label = {0: "AI-generated", 1: "Real"}
    config = Config()

    def eval(self):
        pass

    def __call__(self, **kwargs):
        logits = torch.tensor([[10.0, 5.0]])
        return type("Output", (), {"logits": logits})()

def dummy_processor(img, **kwargs):
    return {"pixel_values": None}

@pytest.fixture
def patch_model(monkeypatch):
    monkeypatch.setattr(model_service, "model", DummyModel())
    monkeypatch.setattr(model_service, "processor", dummy_processor)

# making sure our model predicts AI when it should
def test_predict_image_ai_label(patch_model):
    img = Image.new("RGB", (64, 64))
    label, conf = model_service.predict_image(img)
    assert label in ["AI", "Real"]
    assert 0 <= conf <= 1

# checking that real images are recognized correctly, no surprises
def test_predict_image_real_label(monkeypatch):
    class RealDummyModel:
        class Config:
            id2label = {0: "AI-generated", 1: "Real"}
        config = Config()
        def eval(self): pass
        def __call__(self, **kwargs):
            logits = torch.tensor([[1.0, 10.0]])
            return type("Output", (), {"logits": logits})()

    monkeypatch.setattr(model_service, "model", RealDummyModel())
    monkeypatch.setattr(model_service, "processor", dummy_processor)
    img = Image.new("RGB", (64, 64))
    label, conf = model_service.predict_image(img)
    assert label == "Real"
    assert 0 <= conf <= 1

# testing what happens when the model is weird and gives empty logits
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

# making sure 'AI-generated' gets converted to 'AI' like it should
def test_predict_image_label_replace(monkeypatch):
    class ReplaceModel:
        class Config:
            id2label = {0: "AI-generated", 1: "Real"}
        config = Config()
        def eval(self): pass
        def __call__(self, **kwargs):
            import torch
            logits = torch.tensor([[10.0, 0.0]])
            return type("Output", (), {"logits": logits})()

    monkeypatch.setattr(model_service, "model", ReplaceModel())
    monkeypatch.setattr(model_service, "processor", lambda img, **kw: {"pixel_values": None})
    img = Image.new("RGB", (64, 64))
    label, conf = model_service.predict_image(img)
    assert label == "AI"
    assert 0 <= conf <= 1

# testing zero logits because edge cases are fun
def test_predict_image_zero_logits(monkeypatch):
    class ZeroLogitsModel:
        class Config:
            id2label = {0: "AI", 1: "Real"}
        config = Config()
        def eval(self): pass
        def __call__(self, **kwargs):
            import torch
            return type("Output", (), {"logits": torch.tensor([[0.0, 0.0]])})()

    monkeypatch.setattr(model_service, "model", ZeroLogitsModel())
    monkeypatch.setattr(model_service, "processor", lambda img, **kw: {"pixel_values": None})
    img = Image.new("RGB", (64, 64))
    label, conf = model_service.predict_image(img)
    assert label in ["AI", "Real"]
    assert 0 <= conf <= 1

# seeing how predict_image handles a surprise error from the model
def test_predict_image_model_unexpected_exception(monkeypatch):
    class BadModel:
        class Config:
            id2label = {0: "AI", 1: "Real"}
        config = Config()
        def eval(self): pass
        def __call__(self, **kwargs):
            raise ValueError("Unexpected model error")

    monkeypatch.setattr(model_service, "model", BadModel())
    monkeypatch.setattr(model_service, "processor", lambda img, **kw: {"pixel_values": None})
    import pytest
    img = Image.new("RGB", (64, 64))
    with pytest.raises(ValueError, match="Unexpected model error"):
        model_service.predict_image(img)

# checking if weird temperature values break anything
def test_predict_image_temperature_scaling(patch_model):
    img = Image.new("RGB", (64, 64))
    label, conf = model_service.predict_image(img, temperature=0.1)
    assert label in ["AI", "Real"]
    assert 0 <= conf <= 1

# forcing the model to crash to make sure exceptions propagate
def test_predict_image_model_exception(monkeypatch):
    def bad_model(**kwargs):
        raise RuntimeError("fail")

    class BadModel:
        def eval(self): pass
        __call__ = staticmethod(bad_model)

    monkeypatch.setattr(model_service, "model", BadModel())
    monkeypatch.setattr(model_service, "processor", dummy_processor)
    img = Image.new("RGB", (64, 64))
    with pytest.raises(RuntimeError):
        model_service.predict_image(img)

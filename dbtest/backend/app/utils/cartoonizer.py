# app/utils/cartoonizer.py
import os
import cv2
import numpy as np
import tensorflow as tf
from PIL import Image
from huggingface_hub import snapshot_download
from rembg import remove
from typing import Tuple

MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "whitebox_cartoonizer")
MODEL_DIR = os.path.abspath(MODEL_DIR)

# Ensure model directory exists; this may take time the first run
def ensure_model(local_dir: str = MODEL_DIR, hf_repo: str = "sayakpaul/whitebox-cartoonizer"):
    if not os.path.exists(local_dir):
        print("📥 Downloading model weights (may take a while)...")
        snapshot_download(hf_repo, local_dir=local_dir)
    else:
        print("✅ Model already present at", local_dir)

# prepare tf model singleton
_model = None
_cartoonize_fn = None

def load_model():
    global _model, _cartoonize_fn
    if _model is None:
        ensure_model()
        print("Loading TF model from", MODEL_DIR)
        _model = tf.saved_model.load(MODEL_DIR)
        # the signature name in your script: "serving_default"
        _cartoonize_fn = _model.signatures.get("serving_default")
        if _cartoonize_fn is None:
            # try first available signature
            _cartoonize_fn = list(_model.signatures.values())[0]
    return _cartoonize_fn

def resize_crop(image: np.ndarray) -> np.ndarray:
    h, w, c = np.shape(image)
    if min(h, w) > 720:
        if h > w:
            h, w = int(720 * h / w), 720
        else:
            h, w = 720, int(720 * w / h)
    image = cv2.resize(image, (w, h), interpolation=cv2.INTER_AREA)
    h, w = (h // 8) * 8, (w // 8) * 8
    return image[:h, :w, :]

def preprocess_image(image: np.ndarray):
    image = resize_crop(image)
    image = image.astype(np.float32) / 127.5 - 1
    image = np.expand_dims(image, axis=0)
    return tf.constant(image)

def cartoonize_image_file(input_path: str, output_path: str) -> Tuple[str, str]:
    """
    Reads input_path, removes background, cartoonizes, writes output_path.
    Returns (input_path, output_path)
    """
    if not os.path.exists(input_path):
        raise FileNotFoundError(f"Input file not found: {input_path}")

    # Read original image (BGR from opencv)
    img = cv2.imread(input_path)
    if img is None:
        raise ValueError("Could not read uploaded image.")
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

    # Remove background (rembg) optimize
    pil_img = Image.fromarray(img)
    segmented = remove(pil_img)
    segmented_rgb = np.array(segmented.convert("RGB"))
    # segmented_rgb = img
    # Cartoonize using TF model
    cartoonize_fn = load_model()
    pre = preprocess_image(segmented_rgb)
    result = cartoonize_fn(pre)
    # Result key might vary; pick first array-like value
    # If signature returns dict, pick first value:
    if isinstance(result, dict):
        output_tensor = list(result.values())[0]
    else:
        output_tensor = result

    output = (output_tensor[0].numpy() + 1.0) * 127.5
    output = np.clip(output, 0, 255).astype(np.uint8)

    # Save result (RGB)
    out_pil = Image.fromarray(output)
    out_pil.save(output_path)

    return input_path, output_path


import sys
import numpy as np
import pickle
from tensorflow.keras.models import model_from_json
from PIL import Image

# Load model
print("Loading model...")

try:
    with open("malaria.pkl", "rb") as f:
        model_data = pickle.load(f)
    model = model_from_json(model_data["config"])
    model.set_weights(model_data["weights"])
    print("Model loaded successfully.")
except Exception as e:
    print("Failed to load model:", e)
    sys.exit(1)

# Image preprocessing
def preprocess_image(image_path):
    print(f"Loading image: {image_path}")
    try:
        img = Image.open(image_path).convert("RGB")
        img = img.resize((64, 64))  # Resize to match model's input size
        img_array = np.asarray(img).astype("float32") / 255.0
        img_array = np.expand_dims(img_array, axis=0)
        return img_array
    except Exception as e:
        raise Exception(f"Image preprocessing failed: {e}")

# Prediction function
def predict(image_path):
    img = preprocess_image(image_path)
    print("Running prediction...")
    prediction = model.predict(img)[0][0]
    label = "Parasitized" if prediction >= 0.5 else "Uninfected"
    confidence = prediction if prediction >= 0.5 else 1 - prediction
    print(f"Prediction: {label} ({confidence * 100:.2f}% confidence)")

# Main execution
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python malaria_predict.py <path_to_image>")
        sys.exit(1)
    image_path = sys.argv[1]
    try:
        predict(image_path)
    except Exception as e:
        print("Error during prediction:", e)
        sys.exit(1)

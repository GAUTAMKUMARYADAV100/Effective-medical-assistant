import sys
import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import image
import json
import os

# Suppress TensorFlow warnings
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # Suppress all messages
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

# Model configuration
MODEL_PATH = os.path.abspath("eye_disease_model.h5")
INPUT_SHAPE = (256, 256)  # Matches your model's expected input
CLASS_NAMES = ['Cataract', 'Diabetic_Retinopathy', 'Glaucoma', 'Normal']  # Update if different

def predict(model, img_array):
    """Make prediction using the model"""
    predictions = model.predict(img_array, verbose=0)
    predicted_class = CLASS_NAMES[np.argmax(predictions[0])]
    confidence = round(100 * np.max(predictions[0]), 2)
    return predicted_class, confidence

def preprocess_image(image_path):
    """Load and preprocess image to match model requirements"""
    try:
        # Load as RGB (3 channels) with target size 256x256
        img = image.load_img(image_path, target_size=INPUT_SHAPE, color_mode='rgb')
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)  # Add batch dimension
        return img_array
    except Exception as e:
        raise ValueError(f"Image processing failed: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print(json.dumps({"error": "Usage: python eye_disease.py <image_path>", "status": "error"}))
        sys.exit(1)

    try:
        image_path = sys.argv[1]
        
        # Verify image exists
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image file not found: {image_path}")

        # Load model
        model = load_model(MODEL_PATH, compile=False)
        
        # Preprocess image
        img_array = preprocess_image(image_path)
        
        # Verify input shape
        if img_array.shape[1:] != model.input_shape[1:]:
            raise ValueError(
                f"Input shape mismatch. Model expects {model.input_shape[1:]}, "
                f"got {img_array.shape[1:]}"
            )

        # Make prediction
        predicted_class, confidence = predict(model, img_array)
        
        # Return results
        print(json.dumps({
            "prediction": predicted_class,
            "confidence": confidence,
            "status": "success"
        }))
        
    except Exception as e:
        print(json.dumps({
            "error": str(e),
            "status": "error"
        }))
        sys.exit(1)
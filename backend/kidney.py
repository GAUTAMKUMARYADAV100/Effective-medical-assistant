import sys
import json
import numpy as np
import pandas as pd
import pickle
import os

# Debugging
print("Python version:", sys.version)
print("Loaded libraries successfully")

# Paths to your model files (update if needed)
MODEL_PATH = os.path.abspath("model_ckd.pkl")
SCALER_PATH = os.path.abspath("scaler_ckd.pkl")

# Your EXACT feature names in correct order
FEATURE_NAMES = [
    "Age",
    "Blood Pressure",
    "Specific Gravity",
    "Albumin",
    "Sugar",
    "Red Blood Cells",
    "Pus Cell",
    "Serum Creatinine",
    "Hemoglobin",
    "Packed Cell Volume"
]

try:
    # Load model and scaler
    with open(MODEL_PATH, 'rb') as f:
        model = pickle.load(f)
    with open(SCALER_PATH, 'rb') as f:
        scaler = pickle.load(f)
    print("Model and scaler loaded successfully")
except Exception as e:
    print(json.dumps({"error": f"Loading failed: {str(e)}"}))
    sys.exit(1)

if len(sys.argv) < 6:
    print(json.dumps({"error": "Please provide input data as JSON string with proper number of arguments"}))
    sys.exit(1)

try:
    # Parse and validate input
    input_data = json.loads(sys.argv[4])
    
    # Convert to array maintaining feature order
    input_values = []
    for feature in FEATURE_NAMES:
        value = input_data.get(feature)
        if value is None:
            print(json.dumps({"error": f"Missing feature: {feature}"}))
            sys.exit(1)
        input_values.append(float(value))
    
    # Reshape and scale
    input_array = np.array([input_values])
    scaled_input = scaler.transform(input_array)
    
    # Predict
    probability = float(model.predict(scaled_input)[0][0])
    prediction = int(probability >= 0.5)
    
    # Return results
    print(json.dumps(prediction.tolist()))

except json.JSONDecodeError:
    print(json.dumps({"error": "Invalid JSON format"}))
except ValueError as e:
    print(json.dumps({"error": f"Invalid numeric value: {str(e)}"}))
except Exception as e:
    print(json.dumps({"error": f"Prediction error: {str(e)}"}))
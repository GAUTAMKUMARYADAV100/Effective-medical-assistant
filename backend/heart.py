import sys
import numpy as np
import pickle
import json
import pandas as pd

# Debugging
print("Python version:", sys.version)
print("Python executable path:", sys.executable)

# Load the trained model
pickle_path = r'C:\Users\Gautam Kumar Yadav\Desktop\tkinterpj\trainedmodel\heart_disease_model.pkl'
with open(pickle_path, 'rb') as model_file:
    model = pickle.load(model_file)

# Ensure JSON input is provided
if len(sys.argv) < 4:
    print(json.dumps({"error": "Missing input data. Provide JSON as the 4th argument."}))
    sys.exit(1)

# Parse JSON input
try:
    input_data = json.loads(sys.argv[3])
    
    # Convert values to float (ensures compatibility with LogisticRegression)
    data = [float(value) for value in input_data.values()]
except (json.JSONDecodeError, ValueError):
    print(json.dumps({"error": "Invalid JSON format or non-numeric values."}))
    sys.exit(1)

# Define feature names
feature_names = [
    "age", "sex", "cp", "trestbps", "chol", "fbs", "restecg",
    "thalach", "exang", "oldpeak", "slope", "ca", "thal"
]

# Convert input data into a DataFrame with feature names
data_df = pd.DataFrame([data], columns=feature_names)

# Convert DataFrame to NumPy array
data_array = data_df.to_numpy().reshape(1, -1)

# Make prediction
prediction = model.predict(data_array)

# Send output in required JSON format
print(json.dumps(prediction.tolist()))


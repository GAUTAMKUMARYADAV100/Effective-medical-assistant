import sys
import numpy as np
import pickle
import json
import pandas as pd
import os
from sklearn.preprocessing import StandardScaler

# # Debugging Information
# print("Python version:", sys.version)
# print("Python executable path:", sys.executable)


# Load the trained model
pickle_path_scaler = os.path.abspath("./aimodels/liver_standard_scaler.pkl")

with open(pickle_path_scaler, 'rb') as scaler_file:
    scaler = pickle.load(scaler_file)

pickle_path = os.path.abspath("./aimodels/liver.pkl")

with open(pickle_path, 'rb') as model_file:
    model = pickle.load(model_file)
    

# Ensure JSON input is provided

if len(sys.argv) < 5:
    print(json.dumps({"error": "Missing input data. Provide JSON as the 4th argument."}))
    sys.exit(1)

# Parse JSON input
try:
    input_data = json.loads(sys.argv[4])
    
    # Convert values to float (ensures compatibility with LogisticRegression)
    data = [float(value) for value in input_data.values()]
except (json.JSONDecodeError, ValueError):
    print(json.dumps({"error": "Invalid JSON format or non-numeric values."}))
    sys.exit(1)

# Define feature names for Liver Disease Model
numerical_cols = [
    "Age", "Gender", "Total_Bilirubin", "Direct_Bilirubin", "Alkaline_Phosphotase",
    "Alamine_Aminotransferase", "Aspartate_Aminotransferase", "Total_Proteins",
    "Albumin", "Albumin_and_Globulin_Ratio"
]

# numerical_cols = [
#     'Age', 'Gender', 'Total_Bilirubin', 'Direct_Bilirubin',
#     'Alkaline_Phosphotase', 'Alamine_Aminotransferase',
#     'Aspartate_Aminotransferase', 'Total_Proteins',
#     'Albumin', 'Albumin_and_Globulin_Ratio'
# ]

# Convert input data into a DataFrame with feature names
data_df = pd.DataFrame([data], columns=numerical_cols)

# Convert DataFrame to NumPy array
data_array = data_df.to_numpy().reshape(1, -1)
#data_array = data_array.reshape(1, 10)

# Scaled part

# Example input (replace with actual patient data)
# new_data = np.array(data_array)  # Example values

# Scale the input using the same scaler
new_data_scaled = scaler.transform(data_array)

# Make prediction
prediction = model.predict(new_data_scaled)

# Send output in required JSON format
print(json.dumps(prediction.tolist()))


# import sys
# import numpy as np
# import pickle
# import json
# print("Python version:", sys.version)
# print("Python executable path:", sys.executable)

# with open('./ai-models/breast_cancer.pkl', 'rb') as model_fileL:
#     model = pickle.load(model_fileL)

# data = list(json.loads(sys.argv[3]).values())
# data_array = np.array(data).reshape(1, -1)
# prediction = model.predict(data_array)
# values = np.asarray(data)
# model.predict(values.reshape(1, -1))[0]
# print(json.dumps(prediction.tolist()))
import sys
import numpy as np
import pickle
import json

print("Python version:", sys.version)
print("Python executable path:", sys.executable)

# Load the saved logistic regression model
with open('./breast_cancer_model.pkl', 'rb') as model_file:
    model = pickle.load(model_file)

# Load the scaler
with open('./scaler.pkl', 'rb') as scaler_file:
    scaler = pickle.load(scaler_file)

data = list(json.loads(sys.argv[3]).values())  
data_array = np.array(data).reshape(1, -1)

scaled_input = scaler.transform(data_array)

prediction = model.predict(scaled_input)

print(json.dumps({"prediction": int(prediction[0])}))  # 1 = Malignant, 0 = Benign


import sys
import numpy as np
import pickle
import json

def load_model(disease):
    try:
        if(disease == 'diabetes'):
            model_path = r'E:\Projects\emaC1\Effective-medical-assistant\backend\aimodels\diabetes\diabetes.pkl'
            
            with open(model_path, 'rb') as model_file:
                model = pickle.load(model_file)
            return model

        model_path = f'./ai-models/{disease}.pkl'
        with open(model_path, 'rb') as model_file:
            model = pickle.load(model_file)
        return model
    except Exception as e:
        print(f"Error loading model for {disease}: {e}")
        return None

def predict(disease, data):
    model = load_model(disease)
    if model:
        try:
            if(disease == 'diabetes'):
                list_data = list(data.values())
                data_array = np.array(list_data).reshape(1, -1)
                with open(r"E:\Projects\emaC1\Effective-medical-assistant\backend\aimodels\diabetes\scaler.pkl", "rb") as file:
                    loaded_scaler = pickle.load(file)

                scaled_data = loaded_scaler.transform(data_array)
                prediction = model.predict(scaled_data)
                return prediction.tolist()
            data_array = np.array(data).reshape(1, -1)
            prediction = model.predict(data_array)
            return prediction.tolist()
        except Exception as e:
            print(f"Error predicting {disease}: {e}")
    return None

if __name__ == "__main__":
    if len(sys.argv) < 4:
        print("Usage: python predict.py <disease> <input_data>")
        sys.exit(1)
    print("Sys argv [0]  : ",sys.argv[0])
    disease = sys.argv[4]
    input_data = sys.argv[3]
    prediction = predict(disease, json.loads(input_data))
    if prediction:
        print(json.dumps(prediction))
    else:
        print("Error occurred during prediction.")

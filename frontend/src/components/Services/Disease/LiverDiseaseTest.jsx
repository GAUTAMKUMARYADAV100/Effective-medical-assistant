import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../config";
import DoctorsDropDown from "../../DoctorDropDown/DoctorDropDown";

const LiverDiseaseTest = () => {
  const [inputData, setInputData] = useState({
    Age: "",
    "Gender (Male: 1, Female: 0)": "",
    "Total_Bilirubin": "",
    "Direct_Bilirubin": "",
    "Alkaline_Phosphotase": "",
    "Alamine_Aminotransferase": "",
    "Aspartate_Aminotransferase": "",
    "Total_Proteins": "",
    "Albumin": "",
    "Albumin_and_Globulin_Ratio": "",
  });

  const [prediction, setPrediction] = useState(null);
  const [formError, setFormError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({ ...inputData, [name]: value });
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all fields are filled
    const isFormFilled = Object.values(inputData).every((value) => value.trim() !== "");
    if (!isFormFilled) {
      setFormError("Please fill out all fields.");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/liver`, {
        data: inputData,
      });

      console.log("Response from backend:", response.data);

      // ✅ Extract prediction result properly
      if (Array.isArray(response.data.prediction)) {
        setPrediction(response.data.prediction[0].toString()); // Convert to string for display
      } else {
        setPrediction("Error in prediction");
      }
    } catch (error) {
      console.error("Error:", error);
      setPrediction("Error fetching prediction");
    }
  };

  return (
    <div className="m-5 row mb-32">
      <div className="col-md-2"></div>
      <div className="col-md-8">
        <h1 className="text-center text-3xl font-bold mb-8">
          Liver Disease Predictor
        </h1>
        <div className="card border border-black rounded-lg p-8">
          <form className="form-horizontal" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(inputData).map(([name, value]) => (
                <div key={name} className="col-span-1">
                  <input
                    className="border border-black p-2 w-full"
                    type="text"
                    name={name}
                    placeholder={name}
                    value={value}
                    onChange={handleInputChange}
                  />
                </div>
              ))}
              {/* Form error message */}
              {formError && (
                <div className="text-red-500 mb-4">{formError}</div>
              )}
              {/* Submit button */}
              <input
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                value="Predict"
              />
            </div>
          </form>

          {/* ✅ Hide prediction UI until a result is received */}
          {prediction !== null && (
            <div
              className={`mt-3 ${
                prediction === "1" ? "bg-red-400" : "bg-green-400"
              } text-2xl`}
            >
              <h3 className="text-center">
                {prediction === "1"
                  ? "Sorry! You may be at risk. Please consult your doctor."
                  : "Great! Your liver seems healthy."}
              </h3>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Hide dropdown until prediction is available */}
      {prediction !== null && (
        <DoctorsDropDown
          testName={"Liver Disease Predictor"}
          testResult={prediction === "1" ? "Unhealthy" : "Healthy"}
        />
      )}
    </div>
  );
};

export default LiverDiseaseTest;
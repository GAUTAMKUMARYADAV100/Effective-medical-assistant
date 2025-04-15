import React, { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../../config";
import DcotorsDropDown from "../../DoctorDropDown/DoctorDropDown";

const EyeDiseaseTest = () => {
  const [imagePreview, setImagePreview] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);

  const handleImagePreview = (event) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
        setImagePreview(e.target.result);
        setSelectedImage(event.target.files[0]);
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) {
      alert("Please select an eye image.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      const response = await axios.post(
        `${BASE_URL}/predict-eye-disease`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Expected response: { prediction: "Glaucoma", confidence: 0.9876 }
      const { prediction, confidence } = response.data;
      setPrediction(prediction);
      setConfidence(confidence);
    } catch (error) {
      console.error("Prediction error:", error);
    }
  };

  return (
    <div className="m-5 flex flex-col justify-center items-center">
      <div className="w-full md:w-1/2 lg:w-1/2">
        <form
          className="bg-white shadow-lg shadow-gray-500 rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <h1 className="text-center font-bold text-3xl mb-5">
            Eye Disease Detector
          </h1>
          <div className="mb-4">
            <h3 className="text-center font-bold text-2xl mb-2">
              Upload an Eye Image
            </h3>
            <input
              onChange={handleImagePreview}
              type="file"
              name="image"
              accept="image/*"
              className="py-2 px-4 w-full rounded-md border border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          {imagePreview && (
            <div className="mb-4">
              <img
                className="mx-auto"
                src={imagePreview}
                alt="Uploaded Eye Image Preview"
                style={{ height: "300px", width: "500px" }}
              />
            </div>
          )}
          <div className="text-center">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Detect
            </button>
          </div>
        </form>

        {prediction && (
          <div className="mt-3">
            <div className="bg-yellow-100 text-yellow-800 rounded-md p-4">
              <h3 className="text-center text-2xl font-semibold">
                Predicted Disease: {prediction}
              </h3>
              <p className="text-center mt-2">
                Confidence Score: {(confidence ).toFixed(2)}%
              </p>
            </div>
          </div>
        )}
      </div>

      <div>
        <DcotorsDropDown
          testName={"Eye Disease Detection"}
          testResult={prediction ? prediction : "Unknown"}
        />
      </div>
    </div>
  );
};

export default EyeDiseaseTest;

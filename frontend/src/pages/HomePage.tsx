import React, { useState } from "react";
import Dropzone from "../components/Dropzone";
import type { PredictionResult } from "../types/PredictionResult";
import { fetchPrediction } from "../api/predict";

const HomePage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null);
  const [prediction, setPrediction] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handlePredictImage = async () => {
    if (!image) {
      alert("Please select an image first!");
      return;
    }

    if (isAnalyzing) return;

    setIsAnalyzing(true);

    try {
      const response: PredictionResult = await fetchPrediction(image);
      setPrediction(response.prediction);
      setConfidenceScore(Math.round(response.confidence * 100)); // convert to %
    } catch (error) {
      console.error("Prediction failed:", error);
      alert("Failed to predict image. Please try again.");
    }
  };

  const handleSetImage = (file: File) => {
    setImage(file);
    setIsAnalyzing(false);
    setPrediction("");
    setConfidenceScore(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <header className="w-full max-w-2xl text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          AI vs Real Image Detection
        </h1>
        <p className="text-gray-600 mt-2">
          Upload an image (AI-generated or real)
        </p>
      </header>

      <Dropzone onFileSelect={(file: File) => handleSetImage(file)} />

      <p className="text-gray-600 mb-2">
        {image ? `Selected: ${image.name}` : "No image selected"}
      </p>

      <button
        className="w-full max-w-xl bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition-colors mb-6"
        onClick={handlePredictImage}
        disabled={isAnalyzing}
      >
        Analyze Image
      </button>

      {prediction && confidenceScore !== null && (
        <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Prediction: {prediction}
          </h2>
          <p className="text-gray-600">Confidence: {confidenceScore}%</p>
        </div>
      )}
    </div>
  );
};

export default HomePage;

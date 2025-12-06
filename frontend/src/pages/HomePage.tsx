import React, { useState } from "react";
import Dropzone from "../components/Dropzone";
import Notification from "../components/Notification";
import type { PredictionResult } from "../types/PredictionResult";
import { fetchPrediction } from "../api/predict";
import ConfidenceBar from "../components/ConfidenceBar";

const HomePage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null);
  const [prediction, setPrediction] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handlePredictImage = async () => {
    if (!image) {
      setNotification({
        message: "Please select an image first!",
        type: "error",
      });
      return;
    }

    if (isAnalyzing) return;

    setIsAnalyzing(true);
    setPrediction("");
    setConfidenceScore(null);
    setNotification(null);

    try {
      const response: PredictionResult = await fetchPrediction(image);
      setPrediction(response.prediction);
      setConfidenceScore(Math.round(response.confidence * 100));
      setNotification({ message: "Analysis complete!", type: "success" });
    } catch (error) {
      console.error("Prediction failed:", error);
      setNotification({
        message: "Failed to analyze image. Please try again.",
        type: "error",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSetImage = (file: File) => {
    setImage(file);
    setIsAnalyzing(false);
    setPrediction("");
    setConfidenceScore(null);
    setNotification(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      {/* Render Notification if it exists */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

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
        className="w-full max-w-xl bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition-colors mb-6 disabled:bg-gray-400"
        onClick={handlePredictImage}
        disabled={isAnalyzing || !image}
      >
        {isAnalyzing ? "Analyzing..." : "Analyze Image"}
      </button>

      {prediction && confidenceScore !== null && (
        <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Prediction: {prediction}
          </h2>
          <p className="text-gray-600 mb-2">Confidence: {confidenceScore}%</p>

          <ConfidenceBar confidenceScore={confidenceScore} />
        </div>
      )}
    </div>
  );
};

export default HomePage;

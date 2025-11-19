import React, { useState } from "react";
import Dropzone from "../components/Dropzone";

const HomePage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [prediction, setPrediction] = useState("");

  function handleAnalyzeImage() {
    alert("Analyzing");
    setPrediction("AI");
    setConfidenceScore(55);
  }

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

      <Dropzone
        onFileSelect={(file: File) => {
          setImage(file);
        }}
      />

      <p className="text-gray-600 mb-2">
        {image ? `Selected: ${image.name}` : "No image selected"}
      </p>

      <button
        className="w-full max-w-xl bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition-colors mb-6"
        onClick={handleAnalyzeImage}
      >
        Analyze Image
      </button>

      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Prediction: {prediction}
        </h2>
        <p className="text-gray-600">Confidence: {confidenceScore}%</p>
      </div>
    </div>
  );
};

export default HomePage;

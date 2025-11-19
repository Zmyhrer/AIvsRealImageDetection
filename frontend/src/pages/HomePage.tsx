import React from "react";

const HomePage: React.FC = () => {
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

      <div className="w-full max-w-xl border-2 border-dashed border-gray-300 rounded-xl bg-white p-8 flex flex-col items-center justify-center mb-6">
        <p className="text-gray-500 mb-4">Image here</p>
      </div>

      <button className="w-full max-w-xl bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition-colors mb-6">
        Analyze Image
      </button>

      <div className="w-full max-w-xl bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Prediction: AI
        </h2>
        <p className="text-gray-600">Confidence: 87%</p>
      </div>
    </div>
  );
};

export default HomePage;

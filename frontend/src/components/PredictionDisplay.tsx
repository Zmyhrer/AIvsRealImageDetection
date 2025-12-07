import React from "react";
import ConfidenceBar from "./ConfidenceBar";

interface PredictionDisplayProps {
  prediction: string | undefined;
  confidenceScore: number | null | undefined;
}

const PredictionDisplay: React.FC<PredictionDisplayProps> = ({
  prediction,
  confidenceScore,
}) => (
  <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 mt-4">
    <h2 className="text-2xl font-bold text-gray-800 mb-2">{prediction}</h2>
    <p className="text-gray-600 mb-4">Confidence: {confidenceScore}%</p>
    <ConfidenceBar confidenceScore={confidenceScore ?? null} />
  </div>
);

export default PredictionDisplay;

import React from "react";
import ConfidenceBar from "./ConfidenceBar";

interface PredictionDisplayProps {
  prediction?: string | null;
  confidenceScore?: number | null;
}

const PredictionDisplay: React.FC<PredictionDisplayProps> = ({
  prediction = "No prediction",
  confidenceScore = null,
}) => {
  const normalizedConfidence =
    typeof confidenceScore === "number"
      ? Math.min(Math.max(confidenceScore, 0), 100)
      : 0;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-200 mt-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">
        {prediction || "No prediction"}
      </h2>
      <p className="text-gray-600 mb-4">
        Confidence: {confidenceScore ?? "N/A"}%
      </p>
      <ConfidenceBar confidenceScore={normalizedConfidence} />
    </div>
  );
};

export default PredictionDisplay;

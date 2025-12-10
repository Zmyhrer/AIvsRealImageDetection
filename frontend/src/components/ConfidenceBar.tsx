import React from "react";

interface ConfidenceBarProps {
  confidenceScore?: number | null; // Confidence value (0-100) for the AI prediction
}

// A horizontal bar that visually represents confidence percentage
const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  confidenceScore = 0,
}) => {
  // Clamp the confidence to be within 0-100
  const safeScore = Math.min(Math.max(confidenceScore ?? 0, 0), 100);

  // Determine color based on confidence value
  const getConfidenceBarColor = () => {
    if (safeScore <= 0) return "bg-gray-200"; // No confidence
    if (safeScore > 75) return "bg-green-500"; // High confidence
    if (safeScore > 50) return "bg-yellow-500"; // Medium confidence
    return "bg-red-500"; // Low confidence
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div
        role="progressbar"
        className={`h-4 rounded-full transition-all duration-500 ${getConfidenceBarColor()}`}
        style={{ width: `${safeScore}%` }} // Adjust width based on confidence
      ></div>
    </div>
  );
};

export default ConfidenceBar;

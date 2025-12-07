import React from "react";

interface ConfidenceBarProps {
  confidenceScore?: number | null;
}

const ConfidenceBar: React.FC<ConfidenceBarProps> = ({
  confidenceScore = 0,
}) => {
  const safeScore = Math.min(Math.max(confidenceScore ?? 0, 0), 100);

  const getConfidenceBarColor = () => {
    if (safeScore <= 0) return "bg-gray-200";
    if (safeScore > 75) return "bg-green-500";
    if (safeScore > 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div
        role="progressbar"
        className={`h-4 rounded-full transition-all duration-500 ${getConfidenceBarColor()}`}
        style={{ width: `${safeScore}%` }}
      ></div>
    </div>
  );
};

export default ConfidenceBar;

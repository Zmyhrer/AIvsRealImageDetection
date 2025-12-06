import React from "react";

interface ConfidenceBarProps {
  confidenceScore: number;
}

const ConfidenceBar: React.FC<ConfidenceBarProps> = ({ confidenceScore }) => {
  const getConfidenceBarColor = () => {
    if (!confidenceScore) return "bg-gray-300";
    if (confidenceScore > 75) return "bg-green-500";
    if (confidenceScore > 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-4">
      <div
        className={`h-4 rounded-full transition-all duration-500 ${getConfidenceBarColor()}`}
        style={{ width: `${confidenceScore}%` }}
      ></div>
    </div>
  );
};

export default ConfidenceBar;

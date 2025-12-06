import React from "react";

interface AnalyzeButtonProps {
  isAnalyzing: boolean;
  disabled: boolean;
  onClick: () => void;
}

const AnalyzeButton: React.FC<AnalyzeButtonProps> = ({
  isAnalyzing,
  disabled,
  onClick,
}) => (
  <button
    className={`w-full py-3 font-semibold rounded-xl text-white shadow-lg transition-all transform 
                ${
                  disabled
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:scale-105 hover:shadow-2xl"
                }`}
    onClick={onClick}
    disabled={disabled}
  >
    {isAnalyzing ? "Analyzing..." : "Analyze Image"}
  </button>
);

export default AnalyzeButton;

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
                    : "bg-blue-500 hover:bg-blue-600 duration-150"
                }`}
    onClick={onClick}
    disabled={disabled}
  >
    {isAnalyzing ? "Analyzing..." : "Analyze Image"}
  </button>
);

export default AnalyzeButton;

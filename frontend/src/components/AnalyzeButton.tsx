import React from "react";

interface AnalyzeButtonProps {
  isAnalyzing?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

const AnalyzeButton: React.FC<AnalyzeButtonProps> = ({
  isAnalyzing = false,
  disabled = false,
  onClick,
}) => {
  const buttonClasses = `w-full py-3 font-semibold rounded-xl text-white shadow-lg transition-all transform ${
    disabled
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-500 hover:bg-blue-600 duration-150"
  }`;

  return (
    <button
      className={buttonClasses}
      onClick={() => {
        if (!disabled && onClick) onClick();
      }}
      disabled={disabled}
    >
      {isAnalyzing ? "Analyzing..." : "Analyze Image"}
    </button>
  );
};

export default AnalyzeButton;

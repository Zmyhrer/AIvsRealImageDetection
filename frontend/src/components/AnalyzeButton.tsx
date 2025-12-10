import React from "react";

interface AnalyzeButtonProps {
  isAnalyzing?: boolean; // Indicates if an analysis is currently running
  disabled?: boolean; // Determines if button is clickable
  onClick?: () => void; // Callback to trigger when button is clicked
}

// Button component for triggering image analysis
const AnalyzeButton: React.FC<AnalyzeButtonProps> = ({
  isAnalyzing = false,
  disabled = false,
  onClick,
}) => {
  // Dynamically set CSS classes based on disabled state
  const buttonClasses = `w-full py-3 font-semibold rounded-xl text-white shadow-lg transition-all transform ${
    disabled
      ? "bg-gray-400 cursor-not-allowed"
      : "bg-blue-500 hover:bg-blue-600 duration-150"
  }`;

  return (
    <button
      className={buttonClasses}
      onClick={() => {
        if (!disabled && onClick) onClick(); // Only call onClick if button is active
      }}
      disabled={disabled} // Ensure native HTML disabled behavior
    >
      {isAnalyzing ? "Analyzing..." : "Analyze Image"}{" "}
      {/* Show state-aware label */}
    </button>
  );
};

export default AnalyzeButton;

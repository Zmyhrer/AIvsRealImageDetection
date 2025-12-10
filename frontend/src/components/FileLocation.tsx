import React from "react";

interface FileLocationProps {
  image?: File | null; // The selected file, if any
}

// Displays the name of the selected image, or a placeholder if none
const FileLocation: React.FC<FileLocationProps> = ({ image = null }) => {
  const fileName = image?.name?.trim() || "Unnamed file"; // Use file name or fallback

  return (
    <p className="flex justify-center text-gray-700 mb-2 mt-1 text-sm">
      {image ? `Selected: ${fileName}` : "No image selected"}
      {/* Show selected file name or message */}
    </p>
  );
};

export default FileLocation;

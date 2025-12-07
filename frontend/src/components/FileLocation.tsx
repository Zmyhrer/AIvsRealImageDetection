import React from "react";

interface FileLocationProps {
  image?: File | null;
}

const FileLocation: React.FC<FileLocationProps> = ({ image = null }) => {
  const fileName = image?.name?.trim() || "Unnamed file";

  return (
    <p className="flex justify-center text-gray-700 mb-2 mt-1 text-sm">
      {image ? `Selected: ${fileName}` : "No image selected"}
    </p>
  );
};

export default FileLocation;

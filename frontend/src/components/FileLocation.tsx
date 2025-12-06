import React from "react";

interface FileLocation {
  image: File | null;
}

const FileLocation: React.FC<FileLocation> = ({ image }) => {
  return (
    <p className="flex justify-center text-gray-700 mb-2 mt-1 text-sm">
      {image ? `Selected: ${image.name}` : "No image selected"}
    </p>
  );
};

export default FileLocation;

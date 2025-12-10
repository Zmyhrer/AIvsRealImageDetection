import React, { useRef, useState, useEffect } from "react";

interface DropzoneProps {
  onFileSelect: (file: File) => void; // Callback when user selects or drops a file
  imgURL?: string | null; // Optional externally provided image URL
}

// Dropzone component for drag-and-drop or click-to-select images
const Dropzone: React.FC<DropzoneProps> = ({ onFileSelect, imgURL = null }) => {
  const [localPreview, setLocalPreview] = useState<string | null>(null); // Local preview URL
  const inputRef = useRef<HTMLInputElement | null>(null);

  const preview = imgURL || localPreview; // Use external URL if provided, else local preview

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    // Ignore unsupported file types
    if (!file.type.startsWith("image/")) {
      console.warn("Dropzone: Unsupported file type", file.type);
      return;
    }

    // Revoke previous preview to free memory
    if (localPreview) {
      URL.revokeObjectURL(localPreview);
    }

    const url = URL.createObjectURL(file);
    setLocalPreview(url); // Set new preview
    onFileSelect(file); // Notify parent
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files); // Handle files dropped
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault(); // Needed to allow drop

  const handleClick = () => inputRef.current?.click(); // Open file dialog on click

  useEffect(() => {
    // Cleanup: revoke object URL when component unmounts or preview changes
    return () => {
      if (localPreview) URL.revokeObjectURL(localPreview);
    };
  }, [localPreview]);

  return (
    <div
      className="p-4 border-gray-200 border-2 border-dashed rounded-xl cursor-pointer flex flex-col items-center justify-center hover:bg-purple-50 hover:border-purple-400"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleClick}
    >
      {preview ? (
        <div className="w-full flex items-center justify-center">
          <img
            src={preview}
            alt="Preview"
            className="max-h-[500px] object-contain rounded-md"
          />
        </div>
      ) : (
        <p className="flex justify-center items-center min-h-[200px] text-gray-500">
          Drag and drop an image here, or click to select
        </p>
      )}

      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
};

export default Dropzone;

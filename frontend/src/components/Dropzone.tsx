import React, { useRef, useState } from "react";

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  imgURL: string;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileSelect, imgURL }) => {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  /**
   * Provides the correct preview image.
   * imgURL (history selection) has priority.
   */
  const preview = imgURL || localPreview;

  /**
   * Handles dropped/selected files.
   */
  const handleFiles = (files: FileList) => {
    if (files.length === 0) return;

    const file = files[0];
    if (!file.type.startsWith("image/")) return;

    const url = URL.createObjectURL(file);
    setLocalPreview(url);
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleClick = () => inputRef.current?.click();

  return (
    <div
      className={`w-full border-2 border-dashed rounded-xl p-2 flex flex-col items-center justify-center cursor-pointer
        ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
        }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      {preview ? (
        <img src={preview} alt="Preview" className="max-h-64 rounded-md" />
      ) : (
        <p className="text-gray-500">
          Drag and drop an image here, or click to select
        </p>
      )}

      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
    </div>
  );
};

export default Dropzone;

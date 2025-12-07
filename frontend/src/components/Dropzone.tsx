import React, { useRef, useState } from "react";

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  imgURL: string;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileSelect, imgURL }) => {
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  /** Final preview (history or uploaded file) */
  const preview = imgURL || localPreview;

  /** Handle uploads */
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
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleClick = () => inputRef.current?.click();

  /**
   * Dynamic container styles depending on orientation
   */

  return (
    <div
      className={
        "p-4 border-gray-200 border-2 border-dashed rounded-xl cursor-pointer flex flex-col items-center justify-center hover:bg-purple-50 hover:border-purple-400 "
      }
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onClick={handleClick}
    >
      {preview ? (
        <div className="w-full flex items-center justify-center">
          <img
            src={preview}
            alt="Preview"
            className="
              max-h-[500px]
              object-contain
              rounded-md
            "
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
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
    </div>
  );
};

export default Dropzone;

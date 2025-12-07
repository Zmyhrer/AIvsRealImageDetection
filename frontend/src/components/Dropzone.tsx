import React, { useRef, useState, useEffect } from "react";

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  imgURL?: string | null;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileSelect, imgURL = null }) => {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const preview = imgURL || localPreview;

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    if (!file.type.startsWith("image/")) {
      console.warn("Dropzone: Unsupported file type", file.type);
      return;
    }

    if (localPreview) {
      URL.revokeObjectURL(localPreview);
    }

    const url = URL.createObjectURL(file);
    setLocalPreview(url);
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) =>
    e.preventDefault();

  const handleClick = () => inputRef.current?.click();

  useEffect(() => {
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

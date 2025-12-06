import React, { useRef, useState, useEffect } from "react";

interface DropzoneProps {
  onFileSelect: (file: File) => void;
  imgURL: string;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileSelect, imgURL }) => {
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [orientation, setOrientation] = useState<
    "portrait" | "landscape" | "square" | null
  >(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  /** Final preview (history or uploaded file) */
  const preview = imgURL || localPreview;

  /**
   * Analyze orientation of the preview image dynamically.
   */
  const determineOrientation = (url: string) => {
    const img = new Image();
    img.src = url;
    img.onload = () => {
      if (img.width > img.height) setOrientation("landscape");
      else if (img.height > img.width) setOrientation("portrait");
      else setOrientation("square");
    };
  };

  /** Recalculate orientation whenever preview changes */
  useEffect(() => {
    if (preview) determineOrientation(preview);
  }, [preview]);

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
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleClick = () => inputRef.current?.click();

  /**
   * Dynamic container styles depending on orientation
   */
  const orientationStyles =
    orientation === "portrait"
      ? "h-[500px] w-full flex items-center justify-center"
      : orientation === "landscape"
      ? "h-[300px] w-full flex items-center justify-center"
      : orientation === "square"
      ? "h-[350px] w-full flex items-center justify-center"
      : "min-h-[200px] w-full flex items-center justify-center";

  return (
    <div
      className={`
        w-full border-2 border-dashed rounded-xl p-4 cursor-pointer
        flex flex-col items-center justify-center  hover:border-purple-400
              hover:bg-gradient-to-br hover:from-white hover:to-purple-50
              transition-all duration-150
        ${
          isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-white"
        }
      `}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={handleClick}
    >
      {preview ? (
        <div className={orientationStyles}>
          <img
            src={preview}
            alt="Preview"
            className="
              max-w-full
              max-h-full
              object-contain
              rounded-md
            "
          />
        </div>
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

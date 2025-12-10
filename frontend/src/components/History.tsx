import React from "react";
import ConfidenceBar from "./ConfidenceBar";

export interface HistoryItem {
  id: string; // Unique identifier for each history entry
  imageUrl: string; // Thumbnail or image URL
  prediction: string; // AI vs Real prediction
  confidence: number; // Confidence percentage
}

interface HistoryProps {
  history?: HistoryItem[]; // Optional list of history entries
  onSelect?: (item: HistoryItem) => void; // Callback when a history item is clicked
  onClear?: () => void; // Callback to clear history
}

// Displays a scrollable list of previous predictions with thumbnails and confidence
const History: React.FC<HistoryProps> = ({ history, onSelect, onClear }) => {
  if (!Array.isArray(history)) {
    console.warn(
      "History component expected `history` to be an array. Rendering empty list."
    );
    history = []; // Ensure rendering doesn't break if history is invalid
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex justify-between items-center sticky top-0 z-10 bg-white px-3 py-2 border-b border-gray-200">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
          History
        </h3>

        <button
          onClick={onClear ?? (() => {})} // fallback no-op if onClear not provided
          className="text-sm sm:text-base text-red-600 hover:text-red-800 transition-colors"
        >
          Clear
        </button>
      </div>

      <div className="space-y-3 pr-3 overflow-y-auto flex-1">
        {history.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            No history available.
          </p>
        ) : (
          history.map((item) => {
            if (!item?.id || !item?.imageUrl) {
              console.warn("Skipping invalid history item:", item); // skip corrupted entries
              return null;
            }
            return (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row sm:items-start p-3 rounded-xl cursor-pointer bg-white border border-gray-300 hover:border-purple-400"
                onClick={() => onSelect?.(item)} // call onSelect if provided
              >
                <img
                  src={item.imageUrl}
                  alt="thumbnail"
                  loading="lazy"
                  className="w-full sm:w-16 h-40 sm:h-16 object-cover rounded-lg mb-2 sm:mb-0 sm:mr-4 border border-gray-200"
                />

                <div className="grow flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-1 space-x-2.5">
                    <p className="font-semibold text-gray-800 text-sm sm:text-base wrap-break-words">
                      {item.prediction || "Unknown"}{" "}
                      {/* fallback if prediction missing */}
                    </p>
                    <p className="text-sm sm:text-base text-gray-600">
                      {item.confidence ?? 0}%{" "}
                      {/* default confidence to 0 if missing */}
                    </p>
                  </div>
                  <ConfidenceBar confidenceScore={item.confidence ?? 0} />{" "}
                  {/* visual representation of confidence */}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default History;

import React from "react";
import ConfidenceBar from "./ConfidenceBar";

export interface HistoryItem {
  id: string;
  imageUrl: string;
  prediction: string;
  confidence: number;
}

interface HistoryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

const History: React.FC<HistoryProps> = ({ history, onSelect, onClear }) => {
  return (
    /**
     * Root wrapper becomes a flex column.
     * h-full ensures it stretches to the parent container's height.
     */
    <div className="flex-1 overflow-y-auto">
      {/* Sticky Header */}
      <div className="flex justify-between items-center sticky top-0 z-10 bg-white px-3 py-2 border-b border-gray-200">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-700">
          History
        </h3>

        <button
          onClick={onClear}
          className="text-sm sm:text-base text-red-600 hover:text-red-800 transition-colors"
        >
          Clear
        </button>
      </div>

      {/* Scrollable list that expands automatically */}
      <div className="space-y-3 pr-3 overflow-y-auto flex-1">
        {history.map((item) => (
          <div
            key={item.id}
            className="
              flex flex-col sm:flex-row sm:items-start p-3 rounded-xl cursor-pointer
              bg-white
              border border-gray-300
              hover:border-purple-400
            "
            onClick={() => onSelect(item)}
          >
            {/* Thumbnail */}
            <img
              src={item.imageUrl}
              alt="thumbnail"
              loading="lazy"
              className="
                w-full sm:w-16 h-40 sm:h-16 object-cover rounded-lg mb-2 sm:mb-0 sm:mr-4
                border border-gray-200
              "
            />

            {/* Prediction & Confidence */}
            <div className="grow flex flex-col justify-between">
              <div className="flex justify-between items-center mb-1 space-x-[10px]">
                <p className="font-semibold text-gray-800 text-sm sm:text-base wrap-break-words">
                  {item.prediction}
                </p>
                <p className="text-sm sm:text-base text-gray-600">
                  {item.confidence}%
                </p>
              </div>
              <ConfidenceBar confidenceScore={item.confidence} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;

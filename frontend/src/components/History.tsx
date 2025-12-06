import React from "react";
import ConfidenceBar from "./ConfidenceBar"; // ← make sure the path is correct

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
  if (history.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-xl mt-6 overflow-y-hidden">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-700">Recent Analyses</h3>
        <button
          onClick={onClear}
          className="text-sm text-red-600 hover:text-red-800"
        >
          Clear History
        </button>
      </div>

      <div className="space-y-2">
        {history.map((item) => (
          <div
            key={item.id}
            className="flex items-start bg-white p-3 rounded-lg shadow cursor-pointer hover:bg-gray-100"
            onClick={() => onSelect(item)}
          >
            {/* Thumbnail Image */}
            <img
              src={item.imageUrl}
              alt="thumbnail"
              className="w-16 h-16 object-cover rounded-md mr-4"
            />

            {/* Text + Confidence Bar */}
            <div className="grow">
              {/* Prediction + confidence on the same line */}
              <div className="flex justify-between items-center mb-1">
                <p className="font-medium text-gray-800">{item.prediction}</p>
                <p className="text-sm text-gray-600">{item.confidence}%</p>
              </div>

              {/* ConfidenceBar Component */}
              <ConfidenceBar confidenceScore={item.confidence} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;

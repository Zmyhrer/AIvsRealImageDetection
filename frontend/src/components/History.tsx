import React from "react";
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
    <div className="w-full max-w-xl mt-6">
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
            className="flex items-center bg-white p-3 rounded-lg shadow cursor-pointer hover:bg-gray-100"
            onClick={() => onSelect(item)}
          >
            <img
              src={item.imageUrl}
              alt="thumbnail"
              className="w-16 h-16 object-cover rounded-md mr-4"
            />
            <div className="grow">
              <p className="font-medium text-gray-800">{item.prediction}</p>
              <p className="text-sm text-gray-600">
                Confidence: {item.confidence}%
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;

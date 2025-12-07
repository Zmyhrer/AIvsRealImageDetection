import React, { useState, useEffect, useRef } from "react";
import Notification from "../components/Notification";
import type { PredictionResult } from "../types/PredictionResult";
import { fetchPrediction } from "../api/predict";
import History from "../components/History";
import type { HistoryItem } from "../components/History";
import Header from "../components/Header";
import Dropzone from "../components/Dropzone";
import FileLocation from "../components/FileLocation";
import AnalyzeButton from "../components/AnalyzeButton";
import PredictionDisplay from "../components/PredictionDisplay";

const HomePage: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null);
  const [prediction, setPrediction] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistoryImage, setSelectedHistoryImage] = useState<
    string | null
  >(null);

  const leftRef = useRef<HTMLDivElement | null>(null);
  const [leftHeight, setLeftHeight] = useState<number>(0);

  useEffect(() => {
    if (!leftRef.current) return;

    const observer = new ResizeObserver(([entry]) => {
      setLeftHeight(entry.contentRect.height);
    });

    observer.observe(leftRef.current);

    return () => observer.disconnect();
  }, []);

  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem("imageAnalysisHistory");
    if (savedHistory) setHistory(JSON.parse(savedHistory));
  }, []);

  useEffect(() => {
    localStorage.setItem("imageAnalysisHistory", JSON.stringify(history));
  }, [history]);

  const fetchUrlAsFile = async (
    url: string,
    filename: string
  ): Promise<File> => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], filename, { type: blob.type });
  };

  const handlePredictImage = async () => {
    if (!image) {
      setNotification({
        message: "Please select an image first!",
        type: "error",
      });
      return;
    }

    if (isAnalyzing) return;

    setIsAnalyzing(true);
    setPrediction("");
    setConfidenceScore(null);
    setNotification(null);

    try {
      const response: PredictionResult = await fetchPrediction(image);
      const confidence = Math.round(response.confidence * 100);

      setPrediction(response.prediction);
      setConfidenceScore(confidence);

      setNotification({
        message: "Analysis complete!",
        type: "success",
      });

      const newHistoryItem: HistoryItem = {
        id: new Date().toISOString(),
        imageUrl: URL.createObjectURL(image),
        prediction: response.prediction,
        confidence,
      };

      setHistory((prev) => [newHistoryItem, ...prev]);
    } catch (error) {
      console.error("Prediction failed:", error);

      setNotification({
        message: "Failed to analyze image. Please try again.",
        type: "error",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSetImage = (file: File) => {
    setSelectedHistoryImage(null);
    setImage(file);
    setPrediction("");
    setConfidenceScore(null);
    setNotification(null);
  };
  const handleSelectHistoryItem = async (item: HistoryItem) => {
    setPrediction(item.prediction);
    setConfidenceScore(item.confidence);

    setSelectedHistoryImage(item.imageUrl);

    const restored = await fetchUrlAsFile(item.imageUrl, "history-image.png");
    setImage(restored);

    setNotification(null);
  };

  const handleClearHistory = () => {
    setHistory([]);
    setSelectedHistoryImage(null);
    setConfidenceScore(null);
    setPrediction("");
  };

  return (
    <div className="bg-linear-to-b from-indigo-200 to-indigo-50 p-6 min-h-screen flex flex-col">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <Header
        title="AI vs Real Image Detection"
        description="Upload an image to detect whether it is AI-generated or real"
      />

      <div
        ref={leftRef}
        className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mt-8"
      >
        <div className="md:col-span-2 bg-white rounded-3xl shadow-2xl p-4 border border-indigo-200">
          <Dropzone
            onFileSelect={handleSetImage}
            imgURL={selectedHistoryImage || ""}
          />

          <FileLocation image={image} />

          <AnalyzeButton
            isAnalyzing={isAnalyzing}
            disabled={isAnalyzing || !image}
            onClick={handlePredictImage}
          />

          <PredictionDisplay
            prediction={prediction}
            confidenceScore={confidenceScore}
          />
        </div>

        <aside
          className="bg-white rounded-3xl z-2 p-4 border border-indigo-200 flex flex-col min-h-0"
          style={{ height: leftHeight }}
        >
          <History
            history={history}
            onSelect={handleSelectHistoryItem}
            onClear={handleClearHistory}
          />
        </aside>
      </div>
    </div>
  );
};

export default HomePage;

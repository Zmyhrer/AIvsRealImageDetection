import type { PredictionResult } from "../types/PredictionResult";

export const fetchPrediction = async (
  image: File
): Promise<PredictionResult> => {
  const formData = new FormData();
  formData.append("file", image);

  const response = await fetch("http://127.0.0.1:8000/api/v1/predict/", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) throw new Error("Failed to fetch prediction");

  return response.json();
};

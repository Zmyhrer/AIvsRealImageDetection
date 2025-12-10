import type { PredictionResult } from "../types/PredictionResult";

// Upload an image file to the API and return the prediction result
export const fetchPrediction = async (
  image: File
): Promise<PredictionResult> => {
  const formData = new FormData();
  formData.append("file", image);

  // Send POST request with image file to prediction endpoint
  const response = await fetch("http://127.0.0.1:8000/api/v1/predict/", {
    method: "POST",
    body: formData,
  });

  // Throw an error if the API call fails
  if (!response.ok) throw new Error("Failed to fetch prediction");

  // Parse and return JSON response containing prediction and confidence
  return response.json();
};

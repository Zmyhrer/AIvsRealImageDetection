import { fetchPrediction } from "../../api/predict";

globalThis.fetch = jest.fn() as jest.Mock;

describe("fetchPrediction", () => {
  // Clear mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test that fetchPrediction returns correct data when fetch succeeds
  it("returns prediction data on successful fetch", async () => {
    const mockResponse = { prediction: "AI", confidence: 0.87 };

    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const file = new File(["dummy"], "test.png", { type: "image/png" });
    const result = await fetchPrediction(file);

    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
    expect(result).toEqual(mockResponse);
  });

  // Test that fetchPrediction throws an error if response is not ok
  it("throws an error if response is not ok", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

    const file = new File(["dummy"], "test.png", { type: "image/png" });

    await expect(fetchPrediction(file)).rejects.toThrow(
      "Failed to fetch prediction"
    );
  });

  // Test that fetchPrediction throws an error if fetch itself fails
  it("throws an error if fetch itself rejects", async () => {
    (globalThis.fetch as jest.Mock).mockRejectedValueOnce(
      new Error("Network failure")
    );

    const file = new File(["dummy"], "test.png", { type: "image/png" });

    await expect(fetchPrediction(file)).rejects.toThrow("Network failure");
  });

  // Edge case: test that fetchPrediction throws if no file is provided
  it("throws if file is not provided", async () => {
    // @ts-expect-error: testing null input
    await expect(fetchPrediction(null)).rejects.toThrow();
  });

  // Edge case: test that fetchPrediction throws if response.json() fails
  it("throws if response.json() throws an error", async () => {
    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => {
        throw new Error("Invalid JSON");
      },
    });

    const file = new File(["dummy"], "test.png", { type: "image/png" });
    await expect(fetchPrediction(file)).rejects.toThrow("Invalid JSON");
  });

  // Edge case: test that the correct file is sent in FormData
  it("sends the correct FormData with file", async () => {
    const file = new File(["dummy"], "test.png", { type: "image/png" });

    (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ prediction: "test" }),
    });

    await fetchPrediction(file);

    const formData = (globalThis.fetch as jest.Mock).mock.calls[0][1].body;
    expect(formData.get("file")).toEqual(file);
  });
});

import { render, screen } from "@testing-library/react";
import PredictionDisplay from "../../components/PredictionDisplay";

// Mock ConfidenceBar to isolate PredictionDisplay tests
jest.mock("../../components/ConfidenceBar", () => ({
  __esModule: true,
  default: ({ confidenceScore }: { confidenceScore: number | null }) => (
    <div data-testid="confidence-bar">{confidenceScore}</div>
  ),
}));

describe("PredictionDisplay Component", () => {
  it("renders prediction and confidence correctly", () => {
    render(<PredictionDisplay prediction="Cat" confidenceScore={85} />);

    const predictionElement = screen.getByRole("heading", { name: /cat/i });
    const confidenceElement = screen.getByText(/confidence: 85%/i);
    const confidenceBar = screen.getByTestId("confidence-bar");

    expect(predictionElement).toBeInTheDocument();
    expect(confidenceElement).toBeInTheDocument();
    expect(confidenceBar).toHaveTextContent("85");
  });

  it("renders correctly when confidenceScore is null", () => {
    render(<PredictionDisplay prediction="Dog" confidenceScore={null} />);

    const predictionElement = screen.getByRole("heading", { name: /dog/i });
    const confidenceElement = screen.getByText(/confidence: null%/i);
    const confidenceBar = screen.getByTestId("confidence-bar");

    expect(predictionElement).toBeInTheDocument();
    expect(confidenceElement).toBeInTheDocument();
    expect(confidenceBar).toHaveTextContent("null");
  });

  it("updates when props change", () => {
    const { rerender } = render(
      <PredictionDisplay prediction="Cat" confidenceScore={50} />
    );

    let predictionElement = screen.getByRole("heading", { name: /cat/i });
    let confidenceElement = screen.getByText(/confidence: 50%/i);
    expect(predictionElement).toBeInTheDocument();
    expect(confidenceElement).toBeInTheDocument();

    rerender(<PredictionDisplay prediction="Dog" confidenceScore={90} />);

    predictionElement = screen.getByRole("heading", { name: /dog/i });
    confidenceElement = screen.getByText(/confidence: 90%/i);
    expect(predictionElement).toBeInTheDocument();
    expect(confidenceElement).toBeInTheDocument();
  });

  it("handles empty string prediction gracefully", () => {
    render(<PredictionDisplay prediction="" confidenceScore={75} />);
    const predictionElement = screen.getByRole("heading");
    const confidenceElement = screen.getByText(/confidence: 75%/i);

    expect(predictionElement).toBeInTheDocument();
    expect(confidenceElement).toBeInTheDocument();
  });

  it("handles negative or >100 confidence scores (edge cases)", () => {
    render(<PredictionDisplay prediction="Weird" confidenceScore={-10} />);
    expect(screen.getByText(/confidence: -10%/i)).toBeInTheDocument();

    render(<PredictionDisplay prediction="Weird" confidenceScore={150} />);
    expect(screen.getByText(/confidence: 150%/i)).toBeInTheDocument();
  });

  it("renders correctly with undefined props (edge case)", () => {
    render(
      <PredictionDisplay prediction={undefined} confidenceScore={undefined} />
    );

    const predictionElement = screen.getByRole("heading");
    const confidenceElement = screen.getByText(/confidence: undefined%/i);
    expect(predictionElement).toBeInTheDocument();
    expect(confidenceElement).toBeInTheDocument();
  });
});

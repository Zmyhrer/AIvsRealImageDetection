import { render, screen, cleanup } from "@testing-library/react";
import PredictionDisplay from "../../components/PredictionDisplay";

jest.mock("../../components/ConfidenceBar", () => ({
  __esModule: true,
  default: ({ confidenceScore }: { confidenceScore: number }) => (
    <div data-testid="confidence-bar">{confidenceScore}</div>
  ),
}));

describe("PredictionDisplay Component", () => {
  afterEach(() => cleanup());

  // shows prediction and confidence properly
  test("renders prediction and confidence correctly", () => {
    render(<PredictionDisplay prediction="Cat" confidenceScore={85} />);
    expect(screen.getByRole("heading", { name: /cat/i })).toBeInTheDocument();
    expect(screen.getByText(/confidence:\s*85%/i)).toBeInTheDocument();
    expect(screen.getByTestId("confidence-bar")).toHaveTextContent("85");
  });

  // handles null confidenceScore and falls back to 0 on bar
  test("handles null confidenceScore and uses normalized bar value 0", () => {
    render(<PredictionDisplay prediction="Dog" confidenceScore={null} />);
    expect(screen.getByRole("heading", { name: /dog/i })).toBeInTheDocument();
    expect(screen.getByText(/confidence:\s*n\/a\s*%/i)).toBeInTheDocument();
    expect(screen.getByTestId("confidence-bar")).toHaveTextContent("0");
  });

  // updates display when props change
  test("updates when props change", () => {
    const { rerender } = render(
      <PredictionDisplay prediction="Cat" confidenceScore={50} />
    );
    expect(screen.getByText(/confidence:\s*50%/i)).toBeInTheDocument();

    rerender(<PredictionDisplay prediction="Dog" confidenceScore={90} />);
    expect(screen.getByText(/confidence:\s*90%/i)).toBeInTheDocument();
  });

  // shows placeholder when prediction is empty
  test("handles empty prediction", () => {
    render(<PredictionDisplay prediction="" confidenceScore={75} />);
    expect(screen.getByRole("heading")).toHaveTextContent("No prediction");
    expect(screen.getByText(/confidence:\s*75%/i)).toBeInTheDocument();
  });

  // normalizes bar for confidenceScore < 0 or > 100
  test("normalizes confidenceScore below 0 and above 100 for the bar", () => {
    const { rerender } = render(
      <PredictionDisplay prediction="Low" confidenceScore={-10} />
    );
    expect(screen.getByText(/confidence:\s*-10%/i)).toBeInTheDocument();
    expect(screen.getByTestId("confidence-bar")).toHaveTextContent("0");

    rerender(<PredictionDisplay prediction="High" confidenceScore={150} />);
    expect(screen.getByText(/confidence:\s*150%/i)).toBeInTheDocument();
    expect(screen.getByTestId("confidence-bar")).toHaveTextContent("100");
  });

  // handles completely undefined props gracefully
  test("handles undefined prediction and confidenceScore", () => {
    render(
      <PredictionDisplay prediction={undefined} confidenceScore={undefined} />
    );
    expect(screen.getByRole("heading")).toHaveTextContent("No prediction");
    expect(screen.getByText(/confidence:\s*n\/a\s*%/i)).toBeInTheDocument();
    expect(screen.getByTestId("confidence-bar")).toHaveTextContent("0");
  });
});

import { render, screen, fireEvent } from "@testing-library/react";
import History, { type HistoryItem } from "../../components/History";

jest.mock("../../components/ConfidenceBar", () => ({
  __esModule: true,
  default: ({ confidenceScore }: { confidenceScore: number }) => (
    <div data-testid="confidence-bar">{confidenceScore}</div>
  ),
}));

describe("History Component", () => {
  const mockHistory: HistoryItem[] = [
    { id: "1", imageUrl: "url1.jpg", prediction: "Cat", confidence: 80 },
    { id: "2", imageUrl: "url2.jpg", prediction: "Dog", confidence: 90 },
  ];

  it("renders the header and clear button", () => {
    const onClear = jest.fn();
    render(<History history={[]} onSelect={() => {}} onClear={onClear} />);

    const header = screen.getAllByText(/history/i)[0];
    const clearButton = screen.getByRole("button", { name: /clear/i });

    expect(header).toBeInTheDocument();
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(onClear).toHaveBeenCalledTimes(1);
  });

  it("renders history items correctly", () => {
    const onSelect = jest.fn();
    render(
      <History history={mockHistory} onSelect={onSelect} onClear={() => {}} />
    );

    mockHistory.forEach((item) => {
      expect(screen.getByText(item.prediction)).toBeInTheDocument();
      expect(screen.getByText(`${item.confidence}%`)).toBeInTheDocument();
      expect(screen.getAllByAltText("thumbnail")[0]).toBeInTheDocument();
    });
  });

  it("calls onSelect when a history item is clicked", () => {
    const onSelect = jest.fn();
    render(
      <History history={mockHistory} onSelect={onSelect} onClear={() => {}} />
    );

    const firstItemContainer = screen
      .getAllByAltText("thumbnail")[0]
      .closest("div")!;
    fireEvent.click(firstItemContainer);

    expect(onSelect).toHaveBeenCalledWith(mockHistory[0]);
  });

  it("renders correctly with empty history array", () => {
    render(<History history={[]} onSelect={() => {}} onClear={() => {}} />);
    expect(screen.queryByAltText("thumbnail")).not.toBeInTheDocument();
    expect(screen.getByText(/no history available/i)).toBeInTheDocument();
  });

  it("handles items with missing or edge-case properties", () => {
    const edgeHistory: HistoryItem[] = [
      { id: "3", imageUrl: "", prediction: "", confidence: 0 },
      {
        id: "4",
        imageUrl: "url4.jpg",
        prediction: "EdgeCase",
        confidence: 150,
      },
    ];
    render(
      <History history={edgeHistory} onSelect={() => {}} onClear={() => {}} />
    );

    edgeHistory.forEach((item) => {
      if (!item.id || !item.imageUrl) {
        expect(
          screen.queryByText(item.prediction || "Unknown")
        ).not.toBeInTheDocument();
        return;
      }

      const expected = item.prediction || "Unknown";
      expect(screen.getByText(expected)).toBeInTheDocument();
      expect(screen.getByText(`${item.confidence}%`)).toBeInTheDocument();
    });
  });

  it("renders correctly with undefined props (TypeScript bypass)", () => {
    render(
      <History history={undefined} onSelect={undefined} onClear={undefined} />
    );

    expect(screen.getAllByText(/history/i)[0]).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /clear/i })).toBeInTheDocument();
  });

  it("supports many history items and scrollable container", () => {
    const manyItems: HistoryItem[] = Array.from({ length: 50 }, (_, i) => ({
      id: i.toString(),
      imageUrl: `url${i}.jpg`,
      prediction: `Item ${i}`,
      confidence: i,
    }));

    render(
      <History history={manyItems} onSelect={() => {}} onClear={() => {}} />
    );

    expect(screen.getByText("Item 0")).toBeInTheDocument();
    expect(screen.getByText("Item 49")).toBeInTheDocument();
  });

  it("warns in console if history is not an array", () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    // @ts-expect-error testing invalid history
    render(<History history={{}} onSelect={() => {}} onClear={() => {}} />);
    expect(consoleSpy).toHaveBeenCalledWith(
      "History component expected `history` to be an array. Rendering empty list."
    );
    consoleSpy.mockRestore();
  });

  it("warns and skips invalid history items", () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const invalidItems: HistoryItem[] = [
      { id: "", imageUrl: "", prediction: "Invalid", confidence: 0 },
    ];
    render(
      <History history={invalidItems} onSelect={() => {}} onClear={() => {}} />
    );
    expect(consoleSpy).toHaveBeenCalledWith(
      "Skipping invalid history item:",
      invalidItems[0]
    );
    consoleSpy.mockRestore();
  });
});

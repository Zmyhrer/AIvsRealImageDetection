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

  // basic rendering: header and clear button show up
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

  // basic rendering: history items appear correctly
  it("renders history items correctly", () => {
    const onSelect = jest.fn();
    render(
      <History history={mockHistory} onSelect={onSelect} onClear={() => {}} />
    );

    mockHistory.forEach((item, idx) => {
      expect(screen.getByText(item.prediction)).toBeInTheDocument();
      expect(screen.getByText(`${item.confidence}%`)).toBeInTheDocument();
      expect(screen.getAllByAltText("thumbnail")[idx]).toBeInTheDocument();
    });
  });

  // clicking on an item triggers onSelect
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

  // empty history should show placeholder text
  it("renders correctly with empty history array", () => {
    render(<History history={[]} onSelect={() => {}} onClear={() => {}} />);
    expect(screen.queryByAltText("thumbnail")).not.toBeInTheDocument();
    expect(screen.getByText(/no history available/i)).toBeInTheDocument();
  });

  // items with weird/missing values shouldn't break stuff
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

      expect(
        screen.getByText(item.prediction || "Unknown")
      ).toBeInTheDocument();
      expect(screen.getByText(`${item.confidence}%`)).toBeInTheDocument();
    });
  });

  // ConfidenceBar shows correct score and fallback works
  it("renders ConfidenceBar with correct confidenceScore and covers fallback", () => {
    const edgeHistory: HistoryItem[] = [
      { id: "1", imageUrl: "url1.jpg", prediction: "Cat", confidence: 80 },
      { id: "2", imageUrl: "url2.jpg", prediction: "Dog", confidence: 90 },
      {
        id: "3",
        imageUrl: "url3.jpg",
        prediction: "",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        confidence: undefined as any,
      },
      {
        id: "4",
        imageUrl: "url4.jpg",
        prediction: "Bird",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        confidence: null as any,
      },
    ];

    render(
      <History history={edgeHistory} onSelect={() => {}} onClear={() => {}} />
    );

    const bars = screen.getAllByTestId("confidence-bar");
    expect(bars).toHaveLength(4);
    expect(bars[0]).toHaveTextContent("80");
    expect(bars[1]).toHaveTextContent("90");
    expect(bars[2]).toHaveTextContent("0");
    expect(bars[3]).toHaveTextContent("0");

    expect(screen.getByText("80%")).toBeInTheDocument();
    expect(screen.getByText("90%")).toBeInTheDocument();
    expect(screen.getAllByText("0%").length).toBe(2);
  });

  // handles undefined props without crashing
  it("renders correctly with undefined props (TypeScript bypass)", () => {
    render(
      <History history={undefined} onSelect={undefined} onClear={undefined} />
    );

    expect(screen.getAllByText(/history/i)[0]).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /clear/i })).toBeInTheDocument();
  });

  // fallback onClear works if undefined
  it("calls fallback onClear when prop is undefined", () => {
    render(<History history={[]} onSelect={() => {}} onClear={undefined} />);
    const clearButton = screen.getByRole("button", { name: /clear/i });
    fireEvent.click(clearButton);
  });

  // undefined onSelect doesn't crash
  it("does not throw if onSelect is undefined and item is clicked", () => {
    const items: HistoryItem[] = [
      { id: "1", imageUrl: "url1.jpg", prediction: "Test", confidence: 50 },
    ];
    render(<History history={items} onSelect={undefined} onClear={() => {}} />);
    const itemContainer = screen.getByAltText("thumbnail").closest("div")!;
    fireEvent.click(itemContainer);
  });

  // works fine with lots of items (scrollable test)
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

  // warns if history prop isn't an array
  it("warns in console if history is not an array", () => {
    const consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    // @ts-expect-error testing invalid history
    render(<History history={{}} onSelect={() => {}} onClear={() => {}} />);
    expect(consoleSpy).toHaveBeenCalledWith(
      "History component expected `history` to be an array. Rendering empty list."
    );
    consoleSpy.mockRestore();
  });

  // warns and skips invalid items gracefully
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

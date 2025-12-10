import { render, screen, fireEvent } from "@testing-library/react";
import AnalyzeButton from "../../components/AnalyzeButton";

describe("AnalyzeButton Component", () => {
  const onClickMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  // basic render with default props
  test("renders correctly with default text and defaults when no props provided", () => {
    render(<AnalyzeButton />);
    const button = screen.getByRole("button", { name: /analyze image/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    expect(button).toHaveClass("bg-blue-500");
  });

  // render when not analyzing explicitly
  test("renders correctly with default text when not analyzing", () => {
    render(
      <AnalyzeButton
        isAnalyzing={false}
        disabled={false}
        onClick={onClickMock}
      />
    );
    const button = screen.getByRole("button", { name: /analyze image/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    expect(button).toHaveClass("bg-blue-500");
  });

  // render while analyzing
  test("renders correctly with analyzing text", () => {
    render(
      <AnalyzeButton
        isAnalyzing={true}
        disabled={false}
        onClick={onClickMock}
      />
    );
    const button = screen.getByRole("button", { name: /analyzing.../i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
    expect(button).toHaveClass("bg-blue-500");
  });

  // render as disabled when disabled prop is true
  test("renders as disabled when disabled prop is true", () => {
    render(
      <AnalyzeButton
        isAnalyzing={false}
        disabled={true}
        onClick={onClickMock}
      />
    );
    const button = screen.getByRole("button", { name: /analyze image/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass("bg-gray-400", "cursor-not-allowed");
  });

  // hover style check (basic class presence)
  test("applies hover styles when enabled (simulated)", () => {
    render(
      <AnalyzeButton
        isAnalyzing={false}
        disabled={false}
        onClick={onClickMock}
      />
    );
    const button = screen.getByRole("button", { name: /analyze image/i });
    expect(button).toHaveClass("bg-blue-500");
  });

  // click calls onClick when enabled
  test("calls onClick when clicked and not disabled", () => {
    render(
      <AnalyzeButton
        isAnalyzing={false}
        disabled={false}
        onClick={onClickMock}
      />
    );
    const button = screen.getByRole("button", { name: /analyze image/i });
    fireEvent.click(button);
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  // click does nothing if disabled
  test("does not call onClick when clicked and disabled", () => {
    render(
      <AnalyzeButton
        isAnalyzing={false}
        disabled={true}
        onClick={onClickMock}
      />
    );
    const button = screen.getByRole("button", { name: /analyze image/i });
    fireEvent.click(button);
    expect(onClickMock).not.toHaveBeenCalled();
  });

  // rerender updates button text when analyzing prop changes
  test("updates text when isAnalyzing changes dynamically", () => {
    const { rerender } = render(
      <AnalyzeButton
        isAnalyzing={false}
        disabled={false}
        onClick={onClickMock}
      />
    );
    let button = screen.getByRole("button", { name: /analyze image/i });
    expect(button).toBeInTheDocument();

    rerender(
      <AnalyzeButton
        isAnalyzing={true}
        disabled={false}
        onClick={onClickMock}
      />
    );
    button = screen.getByRole("button", { name: /analyzing.../i });
    expect(button).toBeInTheDocument();
  });

  // should not throw if onClick is undefined
  test("handles undefined onClick gracefully without throwing", () => {
    render(<AnalyzeButton onClick={undefined} />);
    const button = screen.getByRole("button", { name: /analyze image/i });
    expect(() => fireEvent.click(button)).not.toThrow();
  });

  // handles missing props gracefully
  test("handles undefined isAnalyzing and disabled props gracefully", () => {
    render(<AnalyzeButton isAnalyzing={undefined} disabled={undefined} />);
    const button = screen.getByRole("button", { name: /analyze image/i });
    expect(button).not.toBeDisabled();
    expect(button).toHaveClass("bg-blue-500");
  });
});

/**
 * @fileoverview Tests for the AnalyzeButton component
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AnalyzeButton from "../../components/AnalyzeButton";

describe("AnalyzeButton Component", () => {
  const onClickMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

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

  test("applies hover styles when enabled (simulated)", () => {
    render(
      <AnalyzeButton
        isAnalyzing={false}
        disabled={false}
        onClick={onClickMock}
      />
    );

    const button = screen.getByRole("button", { name: /analyze image/i });
    // Can't fully test hover pseudo-class in Jest DOM, but we can check base class
    expect(button).toHaveClass("bg-blue-500");
  });

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

    // Update prop
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
});

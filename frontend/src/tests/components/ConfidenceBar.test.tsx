import { cleanup, render, screen } from "@testing-library/react";
import ConfidenceBar from "../../components/ConfidenceBar";

describe("ConfidenceBar Component", () => {
  const getInnerDiv = () => screen.getAllByRole("progressbar")[0];

  beforeEach(() => {
    document.body.innerHTML = "";
  });

  afterEach(() => cleanup());

  // basic render check
  test("renders without crashing", () => {
    render(<ConfidenceBar confidenceScore={50} />);
    expect(getInnerDiv()).toBeInTheDocument();
  });

  // gray bar for 0, null, or undefined
  test("renders gray bar for 0, null, or undefined confidence", () => {
    render(<ConfidenceBar confidenceScore={0} />);
    let innerDiv = getInnerDiv();
    expect(innerDiv).toHaveClass("bg-gray-200");
    expect(innerDiv).toHaveStyle("width: 0%");

    render(<ConfidenceBar confidenceScore={null} />);
    innerDiv = getInnerDiv();
    expect(innerDiv).toHaveClass("bg-gray-200");
    expect(innerDiv).toHaveStyle("width: 0%");

    render(<ConfidenceBar confidenceScore={undefined} />);
    innerDiv = getInnerDiv();
    expect(innerDiv).toHaveClass("bg-gray-200");
    expect(innerDiv).toHaveStyle("width: 0%");
  });

  // red bar for 1-50%
  test("renders red bar for confidence <= 50 (excluding 0)", () => {
    render(<ConfidenceBar confidenceScore={50} />);
    const innerDiv = getInnerDiv();
    expect(innerDiv).toHaveClass("bg-red-500");
    expect(innerDiv).toHaveStyle("width: 50%");
  });

  // yellow bar for 51-75%
  test("renders yellow bar for confidence > 50 and <= 75", () => {
    render(<ConfidenceBar confidenceScore={60} />);
    const innerDiv = getInnerDiv();
    expect(innerDiv).toHaveClass("bg-yellow-500");
    expect(innerDiv).toHaveStyle("width: 60%");
  });

  // green bar for 76-100%
  test("renders green bar for confidence > 75", () => {
    render(<ConfidenceBar confidenceScore={80} />);
    const innerDiv = getInnerDiv();
    expect(innerDiv).toHaveClass("bg-green-500");
    expect(innerDiv).toHaveStyle("width: 80%");
  });

  // test max edge case
  test("renders correctly for 100% confidence", () => {
    render(<ConfidenceBar confidenceScore={100} />);
    const innerDiv = getInnerDiv();
    expect(innerDiv).toHaveClass("bg-green-500");
    expect(innerDiv).toHaveStyle("width: 100%");
  });

  // clamps negative values to 0
  test("clamps negative confidence values to 0", () => {
    render(<ConfidenceBar confidenceScore={-10} />);
    const innerDiv = getInnerDiv();
    expect(innerDiv).toHaveClass("bg-gray-200");
    expect(innerDiv).toHaveStyle("width: 0%");
  });

  // clamps values above 100 to 100
  test("clamps confidence values above 100 to 100", () => {
    render(<ConfidenceBar confidenceScore={150} />);
    const innerDiv = getInnerDiv();
    expect(innerDiv).toHaveClass("bg-green-500");
    expect(innerDiv).toHaveStyle("width: 100%");
  });

  // handles decimal values correctly
  test("renders correct classes for decimal confidence values", () => {
    render(<ConfidenceBar confidenceScore={72.5} />);
    const innerDiv = getInnerDiv();
    expect(innerDiv).toHaveClass("bg-yellow-500");
    expect(innerDiv).toHaveStyle("width: 72.5%");
  });
});

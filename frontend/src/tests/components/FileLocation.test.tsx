import { render, screen } from "@testing-library/react";
import FileLocation from "../../components/FileLocation";

describe("FileLocation Component", () => {
  // shows placeholder text when no file is provided
  it("renders placeholder text when no image is provided", () => {
    render(<FileLocation image={null} />);
    expect(screen.getByText(/no image selected/i)).toBeInTheDocument();
  });

  // displays file name for a valid File object
  it("renders the image name when a valid File object is provided", () => {
    const file = new File(["dummy"], "test-image.jpg", { type: "image/jpeg" });
    render(<FileLocation image={file} />);
    expect(screen.getByText(/selected: test-image.jpg/i)).toBeInTheDocument();
  });

  // handles File object with an empty name
  it("handles File object with empty name gracefully", () => {
    const file = new File(["dummy"], "", { type: "image/jpeg" });
    render(<FileLocation image={file} />);
    expect(screen.getByText(/selected: unnamed file/i)).toBeInTheDocument();
  });

  // works with non-File objects as an edge case
  it("renders correctly if a non-File object is passed (edge case)", () => {
    // @ts-expect-error intentional edge case
    render(<FileLocation image={{ name: "fake.png" }} />);
    expect(screen.getByText(/selected: fake.png/i)).toBeInTheDocument();
  });

  // updates display when re-rendered with a new file
  it("updates when re-rendered with a new file", () => {
    const { rerender } = render(<FileLocation image={null} />);
    expect(screen.getByText(/no image selected/i)).toBeInTheDocument();

    const newFile = new File(["dummy"], "new-image.png", { type: "image/png" });
    rerender(<FileLocation image={newFile} />);
    expect(screen.getByText(/selected: new-image.png/i)).toBeInTheDocument();
  });

  // handles undefined prop without crashing
  it("handles undefined prop gracefully", () => {
    render(<FileLocation image={undefined} />);
    expect(screen.getByText(/no image selected/i)).toBeInTheDocument();
  });
});

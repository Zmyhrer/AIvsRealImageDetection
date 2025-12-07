import { render, screen } from "@testing-library/react";
import FileLocation from "../../components/FileLocation";

describe("FileLocation Component", () => {
  it("renders placeholder text when no image is provided", () => {
    render(<FileLocation image={null} />);
    expect(screen.getByText(/no image selected/i)).toBeInTheDocument();
  });

  it("renders the image name when a valid File object is provided", () => {
    const file = new File(["dummy"], "test-image.jpg", { type: "image/jpeg" });
    render(<FileLocation image={file} />);
    expect(screen.getByText(/selected: test-image.jpg/i)).toBeInTheDocument();
  });

  it("handles File object with empty name gracefully", () => {
    const file = new File(["dummy"], "", { type: "image/jpeg" });
    render(<FileLocation image={file} />);
    expect(screen.getByText(/selected: unnamed file/i)).toBeInTheDocument();
  });

  it("renders correctly if a non-File object is passed (edge case)", () => {
    // @ts-expect-error intentional edge case
    render(<FileLocation image={{ name: "fake.png" }} />);
    expect(screen.getByText(/selected: fake.png/i)).toBeInTheDocument();
  });

  it("updates when re-rendered with a new file", () => {
    const { rerender } = render(<FileLocation image={null} />);
    expect(screen.getByText(/no image selected/i)).toBeInTheDocument();

    const newFile = new File(["dummy"], "new-image.png", { type: "image/png" });
    rerender(<FileLocation image={newFile} />);
    expect(screen.getByText(/selected: new-image.png/i)).toBeInTheDocument();
  });

  it("handles undefined prop gracefully", () => {
    render(<FileLocation image={undefined} />);
    expect(screen.getByText(/no image selected/i)).toBeInTheDocument();
  });
});

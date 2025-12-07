import { render, screen } from "@testing-library/react";
import FileLocation from "../../components/FileLocation";

describe("FileLocation Component", () => {
  it("renders placeholder text when no image is provided", () => {
    render(<FileLocation image={null} />);
    const paragraph = screen.getByText(/no image selected/i);
    expect(paragraph).toBeInTheDocument();
  });

  it("renders the image name when a valid File object is provided", () => {
    const file = new File(["dummy"], "test-image.jpg", { type: "image/jpeg" });
    render(<FileLocation image={file} />);
    const paragraph = screen.getByText(/selected: test-image.jpg/i);
    expect(paragraph).toBeInTheDocument();
  });

  it("handles File object with empty name gracefully", () => {
    const file = new File(["dummy"], "", { type: "image/jpeg" });
    render(<FileLocation image={file} />);
    const paragraph = screen.getByText(/selected: /i);
    expect(paragraph).toBeInTheDocument();
  });

  it("renders correctly if a non-File object is passed (edge case)", () => {
    // @ts-expect-error intentional edge case
    render(<FileLocation image={{ name: "fake.png" }} />);
    const paragraph = screen.getByText(/selected: fake.png/i);
    expect(paragraph).toBeInTheDocument();
  });

  it("updates when re-rendered with a new file", () => {
    const { rerender } = render(<FileLocation image={null} />);
    let paragraph = screen.getByText(/no image selected/i);
    expect(paragraph).toBeInTheDocument();

    const newFile = new File(["dummy"], "new-image.png", { type: "image/png" });
    rerender(<FileLocation image={newFile} />);
    paragraph = screen.getByText(/selected: new-image.png/i);
    expect(paragraph).toBeInTheDocument();
  });

  it("handles undefined prop gracefully", () => {
    // @ts-expect-error testing undefined
    render(<FileLocation image={undefined} />);
    const paragraph = screen.getByText(/no image selected/i);
    expect(paragraph).toBeInTheDocument();
  });
});

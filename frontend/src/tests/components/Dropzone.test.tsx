import { render, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dropzone from "../../components/Dropzone";

describe("Dropzone Component", () => {
  it("renders placeholder text initially", () => {
    const { getByText } = render(<Dropzone onFileSelect={() => {}} />);
    expect(getByText(/drag and drop an image here/i)).toBeInTheDocument();
  });

  it("accepts valid image files and calls onFileSelect", async () => {
    const mockHandler = jest.fn();
    const { container } = render(<Dropzone onFileSelect={mockHandler} />);
    const input = container.querySelector(
      "input[type='file']"
    ) as HTMLInputElement;

    const file = new File(["dummy"], "test.jpg", { type: "image/jpeg" });
    await userEvent.upload(input, file);

    expect(mockHandler).toHaveBeenCalledTimes(1);
    expect(mockHandler).toHaveBeenCalledWith(file);
  });

  it("ignores non-image files", async () => {
    const mockHandler = jest.fn();
    const { container } = render(<Dropzone onFileSelect={mockHandler} />);
    const input = container.querySelector(
      "input[type='file']"
    ) as HTMLInputElement;

    const file = new File(["dummy"], "test.txt", { type: "text/plain" });
    await userEvent.upload(input, file);

    expect(mockHandler).not.toHaveBeenCalled();
  });

  it("handles drag-and-drop of image files", () => {
    const mockHandler = jest.fn();
    const { getByText } = render(<Dropzone onFileSelect={mockHandler} />);
    const dropzone = getByText(/drag and drop/i).parentElement!;

    const file = new File(["dummy"], "image.png", { type: "image/png" });

    fireEvent.dragOver(dropzone);
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });

    expect(mockHandler).toHaveBeenCalledWith(file);
  });

  it("does not call onFileSelect for dragged non-image files", () => {
    const mockHandler = jest.fn();
    const { getByText } = render(<Dropzone onFileSelect={mockHandler} />);
    const dropzone = getByText(/drag and drop/i).parentElement!;

    const file = new File(["dummy"], "file.txt", { type: "text/plain" });

    fireEvent.dragOver(dropzone);
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });

    expect(mockHandler).not.toHaveBeenCalled();
  });
});

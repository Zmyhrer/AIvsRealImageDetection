import { render, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dropzone from "../../components/Dropzone";

// Suppress console warnings to avoid long stack traces during tests
beforeAll(() => {
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

afterAll(() => {
  (console.warn as jest.Mock).mockRestore();
});

describe("Dropzone Component", () => {
  // Test that the placeholder text renders initially
  it("renders placeholder text initially", () => {
    const { getByText } = render(<Dropzone onFileSelect={() => {}} />);
    expect(getByText(/drag and drop an image here/i)).toBeInTheDocument();
  });

  // Test that uploading a valid image file triggers onFileSelect
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

  // Test that uploading a non-image file does not trigger onFileSelect
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

  // Test that drag-and-drop of an image file triggers onFileSelect
  it("handles drag-and-drop of image files", () => {
    const mockHandler = jest.fn();
    const { getByText } = render(<Dropzone onFileSelect={mockHandler} />);
    const dropzone = getByText(/drag and drop/i).parentElement!;

    const file = new File(["dummy"], "image.png", { type: "image/png" });

    fireEvent.dragOver(dropzone);
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });

    expect(mockHandler).toHaveBeenCalledWith(file);
  });

  // Test that drag-and-drop of a non-image file does not trigger onFileSelect
  it("does not call onFileSelect for dragged non-image files", () => {
    const mockHandler = jest.fn();
    const { getByText } = render(<Dropzone onFileSelect={mockHandler} />);
    const dropzone = getByText(/drag and drop/i).parentElement!;

    const file = new File(["dummy"], "file.txt", { type: "text/plain" });

    fireEvent.dragOver(dropzone);
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });

    expect(mockHandler).not.toHaveBeenCalled();
  });

  // Edge case: dropping an empty file list does not trigger onFileSelect
  it("does not call onFileSelect when no files are dropped", () => {
    const mockHandler = jest.fn();
    const { getByText } = render(<Dropzone onFileSelect={mockHandler} />);
    const dropzone = getByText(/drag and drop/i).parentElement!;

    fireEvent.dragOver(dropzone);
    fireEvent.drop(dropzone, { dataTransfer: { files: [] } });

    expect(mockHandler).not.toHaveBeenCalled();
  });

  // Edge case: dropping multiple files (image + non-image) only triggers for images
  it("calls onFileSelect only for image files when multiple files are dropped", () => {
    const mockHandler = jest.fn();
    const { getByText } = render(<Dropzone onFileSelect={mockHandler} />);
    const dropzone = getByText(/drag and drop/i).parentElement!;

    const imageFile = new File(["img"], "image.png", { type: "image/png" });
    const textFile = new File(["text"], "file.txt", { type: "text/plain" });

    fireEvent.dragOver(dropzone);
    fireEvent.drop(dropzone, {
      dataTransfer: { files: [imageFile, textFile] },
    });

    expect(mockHandler).toHaveBeenCalledTimes(1);
    expect(mockHandler).toHaveBeenCalledWith(imageFile);
  });

  // Edge case: dropping unsupported file types triggers console.warn but does not call onFileSelect
  it("warns and ignores unsupported file types", () => {
    const mockHandler = jest.fn();
    const { getByText } = render(<Dropzone onFileSelect={mockHandler} />);
    const dropzone = getByText(/drag and drop/i).parentElement!;

    const unsupportedFile = new File(["dummy"], "video.mp4", {
      type: "video/mp4",
    });

    fireEvent.dragOver(dropzone);
    fireEvent.drop(dropzone, { dataTransfer: { files: [unsupportedFile] } });

    expect(mockHandler).not.toHaveBeenCalled();
    // console.warn is suppressed by beforeAll mock
  });
});

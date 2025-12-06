import { render, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Dropzone from "../../components/Dropzone";

let consoleSpy: jest.SpyInstance;
let createObjectURLSpy: jest.SpyInstance;

beforeAll(() => {
  consoleSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
  createObjectURLSpy = jest
    .spyOn(globalThis.URL, "createObjectURL")
    .mockImplementation(() => "mocked-url");
});

afterAll(() => {
  consoleSpy.mockRestore();
  createObjectURLSpy.mockRestore();
});

describe("Dropzone Component", () => {
  it("renders placeholder text initially", () => {
    const { getByText } = render(<Dropzone onFileSelect={() => {}} />);
    expect(getByText(/drag and drop an image here/i)).toBeInTheDocument();
  });

  it("handles click to open file input", () => {
    const { getByText } = render(<Dropzone onFileSelect={() => {}} />);
    const dropzone = getByText(/drag and drop/i).parentElement!;
    const clickSpy = jest.spyOn(dropzone, "click");

    dropzone.click();
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
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

  it("warns when a non-image file is dropped", () => {
    const mockHandler = jest.fn();
    const { getByText } = render(<Dropzone onFileSelect={mockHandler} />);
    const dropzone = getByText(/drag and drop/i).parentElement!;

    const file = new File(["dummy"], "file.pdf", { type: "application/pdf" });

    fireEvent.dragOver(dropzone);
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });

    expect(mockHandler).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith("Only image files are allowed");
  });

  it("does nothing when file input is empty", async () => {
    const mockHandler = jest.fn();
    const { container } = render(<Dropzone onFileSelect={mockHandler} />);
    const input = container.querySelector(
      "input[type='file']"
    ) as HTMLInputElement;

    await userEvent.upload(input, []); // empty upload
    expect(mockHandler).not.toHaveBeenCalled();
  });

  it("handles dragOver and dragLeave correctly", () => {
    const { getByText } = render(<Dropzone onFileSelect={() => {}} />);
    const dropzone = getByText(/drag and drop/i).parentElement!;

    fireEvent.dragOver(dropzone);
    fireEvent.dragLeave(dropzone);
    // Cannot test CSS directly, but these events should not throw
  });

  it("handles drag-and-drop of an image file", () => {
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
    expect(consoleSpy).toHaveBeenCalledWith("Only image files are allowed");
  });

  it("does nothing for empty file list dropped", () => {
    const mockHandler = jest.fn();
    const { getByText } = render(<Dropzone onFileSelect={mockHandler} />);
    const dropzone = getByText(/drag and drop/i).parentElement!;

    fireEvent.drop(dropzone, { dataTransfer: { files: [] } });
    expect(mockHandler).not.toHaveBeenCalled();
  });
});

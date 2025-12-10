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
  // shows the placeholder text when nothing is uploaded yet
  it("renders placeholder text initially when no preview is present", () => {
    const { getByText } = render(
      <Dropzone onFileSelect={() => {}} imgURL="" />
    );
    expect(
      getByText(/drag and drop an image here, or click to select/i)
    ).toBeInTheDocument();
  });

  // renders a preview if imgURL is given
  it("renders imgURL preview if provided", () => {
    const { getByAltText } = render(
      <Dropzone onFileSelect={() => {}} imgURL="test-url" />
    );
    const img = getByAltText("Preview") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("test-url");
  });

  // clicking the dropzone triggers the file input
  it("handles click to open file input", () => {
    const { container, getByText } = render(
      <Dropzone onFileSelect={() => {}} imgURL="" />
    );
    const dropzone = getByText(/drag and drop/i).parentElement!;
    const input = container.querySelector(
      "input[type='file']"
    ) as HTMLInputElement;

    fireEvent.click(dropzone);
    expect(input).toBeInTheDocument();
  });

  // uploading a valid image calls onFileSelect and shows preview
  it("accepts valid image files and calls onFileSelect, sets local preview", async () => {
    const mockHandler = jest.fn();
    const { container, getByAltText } = render(
      <Dropzone onFileSelect={mockHandler} imgURL="" />
    );
    const input = container.querySelector(
      "input[type='file']"
    ) as HTMLInputElement;

    const file = new File(["dummy"], "test.jpg", { type: "image/jpeg" });
    await userEvent.upload(input, file);

    expect(mockHandler).toHaveBeenCalledTimes(1);
    expect(mockHandler).toHaveBeenCalledWith(file);

    const img = getByAltText("Preview") as HTMLImageElement;
    expect(img.src).toContain("mocked-url");
  });

  // uploading new files revokes old previews and cleanup works on unmount
  it("revokes previous preview URL when uploading a new file and on unmount", async () => {
    const revokeSpy = jest.spyOn(globalThis.URL, "revokeObjectURL");
    const mockHandler = jest.fn();
    const { container, getByAltText, unmount } = render(
      <Dropzone onFileSelect={mockHandler} imgURL="" />
    );
    const input = container.querySelector(
      "input[type='file']"
    ) as HTMLInputElement;

    // First upload
    const file1 = new File(["dummy1"], "first.jpg", { type: "image/jpeg" });
    await userEvent.upload(input, file1);
    const img1 = getByAltText("Preview") as HTMLImageElement;
    expect(img1.src).toContain("mocked-url");
    expect(mockHandler).toHaveBeenCalledWith(file1);

    // Second upload triggers revoke of previous preview
    const file2 = new File(["dummy2"], "second.jpg", { type: "image/jpeg" });
    await userEvent.upload(input, file2);
    expect(revokeSpy).toHaveBeenCalledWith("mocked-url");
    expect(mockHandler).toHaveBeenCalledWith(file2);

    // Unmount triggers cleanup
    unmount();
    expect(revokeSpy).toHaveBeenCalledTimes(3);

    revokeSpy.mockRestore();
  });

  // ignores files that aren't images
  it("ignores non-image files on input change", async () => {
    const mockHandler = jest.fn();
    const { container } = render(
      <Dropzone onFileSelect={mockHandler} imgURL="" />
    );
    const input = container.querySelector(
      "input[type='file']"
    ) as HTMLInputElement;

    const file = new File(["dummy"], "file.pdf", { type: "application/pdf" });
    await userEvent.upload(input, file);

    expect(mockHandler).not.toHaveBeenCalled();
  });

  // should fall back to placeholder if imgURL prop is missing
  it("uses default imgURL = null when prop is not provided", () => {
    const mockHandler = jest.fn();
    const { getByText } = render(<Dropzone onFileSelect={mockHandler} />);
    expect(
      getByText(/drag and drop an image here, or click to select/i)
    ).toBeInTheDocument();
  });

  // dragOver event shouldn't throw
  it("handles dragOver without errors", () => {
    const { getByText } = render(
      <Dropzone onFileSelect={() => {}} imgURL="" />
    );
    const dropzone = getByText(/drag and drop/i).parentElement!;
    fireEvent.dragOver(dropzone);
  });

  // drag-and-drop of valid image files works
  it("handles drag-and-drop of an image file", () => {
    const mockHandler = jest.fn();
    const { getByText, getByAltText } = render(
      <Dropzone onFileSelect={mockHandler} imgURL="" />
    );
    const dropzone = getByText(/drag and drop/i).parentElement!;

    const file = new File(["dummy"], "image.png", { type: "image/png" });
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });

    expect(mockHandler).toHaveBeenCalledWith(file);
    const img = getByAltText("Preview") as HTMLImageElement;
    expect(img.src).toContain("mocked-url");
  });

  // drag-and-drop of invalid files is ignored
  it("does not call onFileSelect for dragged non-image files", () => {
    const mockHandler = jest.fn();
    const { getByText } = render(
      <Dropzone onFileSelect={mockHandler} imgURL="" />
    );
    const dropzone = getByText(/drag and drop/i).parentElement!;

    const file = new File(["dummy"], "file.txt", { type: "text/plain" });
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });

    expect(mockHandler).not.toHaveBeenCalled();
  });

  // empty dropped file list does nothing
  it("does nothing when dropped file list is empty", () => {
    const mockHandler = jest.fn();
    const { getByText } = render(
      <Dropzone onFileSelect={mockHandler} imgURL="" />
    );
    const dropzone = getByText(/drag and drop/i).parentElement!;

    fireEvent.drop(dropzone, { dataTransfer: { files: [] } });
    expect(mockHandler).not.toHaveBeenCalled();
  });
});

import React from "react";
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
  it("renders placeholder text initially when no preview is present", () => {
    const { getByText } = render(
      <Dropzone onFileSelect={() => {}} imgURL="" />
    );
    expect(
      getByText(/drag and drop an image here, or click to select/i)
    ).toBeInTheDocument();
  });

  it("renders imgURL preview if provided", () => {
    const { getByAltText } = render(
      <Dropzone onFileSelect={() => {}} imgURL="test-url" />
    );
    const img = getByAltText("Preview") as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("test-url");
  });

  it("handles click to open file input", () => {
    const { getByText } = render(
      <Dropzone onFileSelect={() => {}} imgURL="" />
    );
    const dropzone = getByText(/drag and drop/i).parentElement!;
    const clickSpy = jest.spyOn(dropzone, "click");

    dropzone.click();
    expect(clickSpy).toHaveBeenCalled();
    clickSpy.mockRestore();
  });

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
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("mocked-url");
  });

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

  it("handles dragOver and dragLeave without errors", () => {
    const { getByText } = render(
      <Dropzone onFileSelect={() => {}} imgURL="" />
    );
    const dropzone = getByText(/drag and drop/i).parentElement!;

    fireEvent.dragOver(dropzone);
    fireEvent.dragLeave(dropzone);
    // Events do not throw; no direct visual test possible
  });

  it("handles drag-and-drop of an image file", () => {
    const mockHandler = jest.fn();
    const { getByText, getByAltText } = render(
      <Dropzone onFileSelect={mockHandler} imgURL="" />
    );
    const dropzone = getByText(/drag and drop/i).parentElement!;

    const file = new File(["dummy"], "image.png", { type: "image/png" });
    fireEvent.dragOver(dropzone);
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });

    expect(mockHandler).toHaveBeenCalledWith(file);
    const img = getByAltText("Preview") as HTMLImageElement;
    expect(img.src).toContain("mocked-url");
  });

  it("does not call onFileSelect for dragged non-image files", () => {
    const mockHandler = jest.fn();
    const { getByText } = render(
      <Dropzone onFileSelect={mockHandler} imgURL="" />
    );
    const dropzone = getByText(/drag and drop/i).parentElement!;

    const file = new File(["dummy"], "file.txt", { type: "text/plain" });
    fireEvent.dragOver(dropzone);
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });

    expect(mockHandler).not.toHaveBeenCalled();
  });

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

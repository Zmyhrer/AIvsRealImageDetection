import "@testing-library/jest-dom";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).URL.createObjectURL = jest.fn(() => "mock-url");

import "@testing-library/jest-dom";
(globalThis as any).URL.createObjectURL = jest.fn(() => "mock-url");

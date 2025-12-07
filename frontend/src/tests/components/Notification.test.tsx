import { render, screen, fireEvent, act } from "@testing-library/react";
import Notification from "../../components/Notification";

jest.useFakeTimers();

describe("Notification Component", () => {
  const message = "Test notification message";
  let onClose: jest.Mock;

  beforeEach(() => {
    onClose = jest.fn();
    document.body.innerHTML = "";
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.clearAllMocks();
  });

  test("renders the notification with success type", () => {
    render(<Notification message={message} type="success" onClose={onClose} />);
    const root = screen.getByText(message).parentElement;

    expect(root).toBeInTheDocument();
    expect(root).toHaveClass("bg-green-500");
  });

  test("renders the notification with error type", () => {
    render(<Notification message={message} type="error" onClose={onClose} />);
    const root = screen.getByText(message).parentElement;

    expect(root).toBeInTheDocument();
    expect(root).toHaveClass("bg-red-500");
  });

  test("displays the correct message text", () => {
    render(<Notification message={message} type="success" onClose={onClose} />);
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  test("falls back to default message when none is provided", () => {
    render(<Notification onClose={onClose} />);
    expect(screen.getByText("No message provided")).toBeInTheDocument();
  });

  test("calls onClose when the close button is clicked", () => {
    render(<Notification message={message} type="success" onClose={onClose} />);
    const closeButton = screen.getByRole("button", {
      name: /close notification/i,
    });

    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("auto-hides after 4500ms and then closes after 5000ms", () => {
    render(<Notification message={message} type="success" onClose={onClose} />);

    const root = screen.getByText(message).parentElement!;

    expect(root).toHaveClass("opacity-100");

    act(() => {
      jest.advanceTimersByTime(4500);
    });
    expect(root).toHaveClass("opacity-0");

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("does not call onClose before 5 seconds", () => {
    render(<Notification message={message} type="success" onClose={onClose} />);
    act(() => {
      jest.advanceTimersByTime(4000);
    });
    expect(onClose).not.toHaveBeenCalled();
  });

  test("clears timers on unmount to avoid memory leaks", () => {
    const { unmount } = render(
      <Notification message={message} type="success" onClose={onClose} />
    );

    unmount();

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(onClose).not.toHaveBeenCalled();
  });
});

import { render, screen, fireEvent, act } from "@testing-library/react";
import Notification from "../../components/Notification";

jest.useFakeTimers();

describe("Notification", () => {
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
    const notification = screen.getByText(message).parentElement;

    expect(notification).toBeInTheDocument();
    expect(notification).toHaveClass("bg-green-500");
  });

  test("renders the notification with error type", () => {
    render(<Notification message={message} type="error" onClose={onClose} />);
    const notification = screen.getByText(message).parentElement;

    expect(notification).toBeInTheDocument();
    expect(notification).toHaveClass("bg-red-500");
  });

  test("displays the correct message text", () => {
    render(<Notification message={message} type="success" onClose={onClose} />);
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  test("calls onClose when the close button is clicked", () => {
    render(<Notification message={message} type="success" onClose={onClose} />);
    const closeButton = screen.getByText("×");
    fireEvent.click(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("auto-closes after 5 seconds", () => {
    render(<Notification message={message} type="success" onClose={onClose} />);
    act(() => {
      jest.advanceTimersByTime(5000);
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

  test("clears the timer on unmount to prevent memory leaks", () => {
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

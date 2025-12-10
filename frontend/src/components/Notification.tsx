import React, { useEffect, useState } from "react";

interface NotificationProps {
  message?: string; // Text to display in the notification
  type?: "success" | "error"; // Determines the background color
  onClose: () => void; // Callback to remove notification from parent state
}

// Renders a temporary notification that auto-dismisses after a few seconds
const Notification: React.FC<NotificationProps> = ({
  message = "No message provided",
  type = "success",
  onClose,
}) => {
  const [visible, setVisible] = useState(true); // controls animation visibility

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 4500); // start fade-out animation
    const removeTimer = setTimeout(() => onClose(), 5000); // remove component after fade
    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500"; // dynamic background

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center justify-between px-6 py-3 rounded-lg shadow-xl text-white font-medium transform transition-all duration-500
        ${
          visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8" // animate in/out
        } ${bgColor}`}
    >
      <span>{message}</span>
      <button
        onClick={onClose} // immediately close when clicked
        className="ml-4 text-white hover:text-gray-200 transition-colors text-lg font-bold focus:outline-none"
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  );
};

export default Notification;

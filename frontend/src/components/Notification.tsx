import React, { useEffect, useState } from "react";

interface NotificationProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

/**
 * A modern notification component that auto-closes after 5 seconds.
 * Shows a slide-in effect from the top-right and fades out smoothly.
 */
const Notification: React.FC<NotificationProps> = ({
  message,
  type,
  onClose,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 4500); // start fade out
    const removeTimer = setTimeout(() => onClose(), 5000); // remove completely
    return () => {
      clearTimeout(timer);
      clearTimeout(removeTimer);
    };
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";

  return (
    <div
      className={`fixed top-6 right-6 z-50 flex items-center justify-between px-6 py-3 rounded-lg shadow-xl text-white font-medium transform transition-all duration-500
        ${
          visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
        } ${bgColor}`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-4 text-white hover:text-gray-200 transition-colors text-lg font-bold focus:outline-none"
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  );
};

export default Notification;

"use client";

import { useEffect } from "react";

export default function StatusToast({ show, onClose, message, type }) {
  // Auto close after 3 seconds
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  if (!show) return null;

  const styles = {
    success: "bg-green-500/50 text-white",
    error: "bg-red-500/50 text-white",
    warning: "bg-yellow-400/25 text-gray-800",
  };

  const bgClass = styles[type] || styles.warning;

  return (
    <div className="fixed top-4 right-4 z-[9999]">
      <div
        className={`relative flex items-center justify-center px-6 py-4 rounded-lg shadow-lg min-w-[250px] ${bgClass}`}
      >
        {/* Message */}
        <p className="text-sm text-center pr-4">{message}</p>

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-2 text-current opacity-70 hover:opacity-100 transition-opacity"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

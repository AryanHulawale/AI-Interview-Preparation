import React from "react";

const SpinnerLoader = ({ fullscreen = false, size = 20 }) => {
  return (
    <div
      className={`${
        fullscreen
          ? "fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          : "flex items-center justify-center"
      }`}
      role="status"
      aria-live="polite"
    >
      <svg
        aria-hidden="true"
        style={{ width: size, height: size }}
        className="animate-spin text-orange-200 fill-orange-500"
        viewBox="0 0 100 101"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background ring */}
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908Z"
          fill="currentColor"
        />
        {/* Active spinner */}
        <path
          d="M93.9676 39.0409C96.203 38.4038 97.0079 35.904 95.7905 33.7559C94.1311 30.8201 91.9548 28.1404 89.3404 25.7977C85.5478 22.3861 80.9324 19.9579 75.8906 18.7296"
          fill="currentFill"
        />
      </svg>

      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default SpinnerLoader;

import React from "react";

const Button = ({ className, children, disabled, ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded bg-blue-500 text-white font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className || ""}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };

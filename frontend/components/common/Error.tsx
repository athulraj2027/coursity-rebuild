import React from "react";

const Error = () => {
  return (
    <div className="px-7 py-6">
      <div className="flex items-center justify-center h-64">
        <div className="text-destructive">
          Failed to load. Please try again.
        </div>
      </div>
    </div>
  );
};

export default Error;

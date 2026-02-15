import React from "react";

const Participants = () => {
  return (
    <div className="w-72 border-l border-gray-700 p-4 overflow-y-auto">
      <h2 className="mb-4 font-medium">Participants</h2>

      <div className="space-y-3">
        {[1, 2, 3, 4].map((p) => (
          <div
            key={p}
            className="h-24 bg-gray-800 rounded-lg flex items-center justify-center"
          >
            User {p}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Participants;

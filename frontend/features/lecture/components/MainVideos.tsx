import React from "react";

const MainVideos = () => {
  // mock remote users
  const remoteUsers = [1, 2, 3, 4, 5, 6];

  // include local user
  const participants = ["local", ...remoteUsers];

  const count = participants.length;

  // Google Meet–like grid logic
  const getGridClass = () => {
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 sm:grid-cols-2";
    if (count <= 4) return "grid-cols-2";
    if (count <= 6) return "grid-cols-2 lg:grid-cols-3";
    if (count <= 9) return "grid-cols-3";
    return "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";
  };

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div
        className={`grid ${getGridClass()} gap-4 content-start auto-rows-fr`}
      >
        {participants.map((user, i) => (
          <div
            key={i}
            className="relative bg-black rounded-xl flex items-center justify-center aspect-video border border-gray-700"
          >
            {/* VIDEO PLACEHOLDER */}
            <p className="text-gray-400">
              {user === "local" ? "You" : `User ${user}`}
            </p>

            {/* NAME OVERLAY */}
            <div className="absolute bottom-2 left-2 px-2 py-1 text-xs bg-black/60 rounded">
              {user === "local" ? "You" : `User ${user}`}
            </div>

            {/* LOCAL VIDEO BADGE */}
            {user === "local" && (
              <div className="absolute top-2 left-2 text-xs bg-blue-600 px-2 py-1 rounded">
                You
              </div>
            )}

            {/* SPEAKING INDICATOR (demo) */}
            {i === 1 && (
              <div className="absolute inset-0 rounded-xl border-2 border-green-500 pointer-events-none" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainVideos;

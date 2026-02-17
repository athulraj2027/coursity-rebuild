import React from "react";
import { VideoPlayer } from "./VideoPlayer";
import { getGridClass } from "@/utils/getGridClass";

const MainVideos = ({
  localStream,
  remoteStreams,
  localScreenStream,
}: {
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  localScreenStream: MediaStream | null;
}) => {
  const remoteUsers = [1, 2, 3, 4, 5, 6];
  const participants = ["local", ...remoteUsers];
  const count = participants.length;

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div
        className={`grid ${getGridClass(count)} gap-4 content-start auto-rows-fr`}
      >
        <div className="relative rounded-xl flex items-center justify-center aspect-video border border-gray-700 overflow-hidden">
          {localStream && <VideoPlayer stream={localStream} />}
          <div className="absolute top-2 left-2 text-xs bg-blue-600 px-2 py-1 rounded">
            You
          </div>
        </div>
        {/* {participants.map((user, i) => (
          <div
            key={i}
            className="relative rounded-xl flex items-center justify-center aspect-video border border-gray-700 overflow-hidden"
          >
            {user === "local" ? (
              stream ? (
                <VideoPlayer stream={stream} />
              ) : (
                <p className="text-gray-400">Starting camera...</p>
              )
            ) : (
              <p className="text-gray-400">User {user}</p>
            )}

            <div className="absolute bottom-2 left-2 px-2 py-1 text-xs bg-black/60 rounded">
              {user === "local" ? "You" : `User ${user}`}
            </div>

            {user === "local" && (
              <div className="absolute top-2 left-2 text-xs bg-blue-600 px-2 py-1 rounded">
                You
              </div>
            )}
          </div>
        ))} */}
      </div>
    </div>
  );
};

export default MainVideos;

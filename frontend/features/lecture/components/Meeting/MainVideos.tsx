import React from "react";
import { VideoPlayer } from "./VideoPlayer";
import { getGridClass } from "@/utils/getGridClass";
import { RemoteStreamData } from "../../hooks/useJoinRoom";

const MainVideos = ({
  localStream,
  remoteStreams,
  localScreenStream,
}: {
  localStream: MediaStream | null;
  remoteStreams: Map<string, RemoteStreamData>;
  localScreenStream: MediaStream | null;
}) => {
  const remoteStreamsArray = Array.from(remoteStreams.entries());

  const count =
    remoteStreamsArray.length +
    (localStream ? 1 : 0) +
    (localScreenStream ? 1 : 0);

  return (
    <div className="flex-1 p-4 overflow-y-auto">
      <div
        className={`grid ${getGridClass(count)} gap-4 content-start auto-rows-fr`}
      >
        {/* LOCAL VIDEO */}
        {localStream && (
          <div className="relative rounded-xl aspect-video border border-gray-700 overflow-hidden">
            <VideoPlayer stream={localStream} />
            <div className="absolute top-2 left-2 text-xs bg-blue-600 px-2 py-1 rounded">
              You
            </div>
          </div>
        )}

        {/* SCREEN SHARE (if exists) */}
        {localScreenStream && (
          <div className="relative rounded-xl aspect-video border border-yellow-600 overflow-hidden">
            <VideoPlayer stream={localScreenStream} />
            <div className="absolute top-2 left-2 text-xs bg-yellow-600 px-2 py-1 rounded">
              Your Screen
            </div>
          </div>
        )}

        {/* REMOTE VIDEOS */}
        {remoteStreamsArray.map(([socketId, data]) => (
          <div
            key={socketId}
            className="relative rounded-xl aspect-video border border-gray-700 overflow-hidden"
          >
            <VideoPlayer stream={data.stream} />
            <div className="absolute top-2 left-2 text-xs bg-gray-800 px-2 py-1 rounded">
              {data.appData?.username}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainVideos;

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

  // Separate audio & video
  const remoteVideoStreams = remoteStreamsArray.filter(
    ([, data]) => data.kind === "video",
  );

  const remoteAudioStreams = remoteStreamsArray.filter(
    ([, data]) => data.kind === "audio",
  );

  // Detect remote screen share
  const remoteScreenShare = remoteVideoStreams.find(
    ([, data]) => data.appData?.mediaTag === "screen",
  );

  const normalRemoteVideos = remoteVideoStreams.filter(
    ([, data]) => data.appData?.mediaTag !== "screen",
  );

  const hasAnyScreenShare = !!remoteScreenShare || !!localScreenStream;

  return (
    <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
      {/* ================== SCREEN SPOTLIGHT ================== */}
      {hasAnyScreenShare && (
        <div className="w-full rounded-xl border border-yellow-600 overflow-hidden aspect-video">
          {/* Local Screen */}
          {localScreenStream && <VideoPlayer stream={localScreenStream} />}

          {/* Remote Screen */}
          {remoteScreenShare && !localScreenStream && (
            <>
              <VideoPlayer stream={remoteScreenShare[1].stream} />
              <div className="absolute top-2 left-2 text-xs bg-yellow-600 px-2 py-1 rounded">
                {remoteScreenShare[1].appData?.username} &apos; s Screen
              </div>
            </>
          )}
        </div>
      )}

      {/* ================== VIDEO GRID ================== */}
      <div
        className={`grid ${
          hasAnyScreenShare
            ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
            : getGridClass(normalRemoteVideos.length + (localStream ? 1 : 0))
        } gap-4 auto-rows-fr`}
      >
        {/* LOCAL CAMERA */}
        {localStream && (
          <div className="relative rounded-xl aspect-video border border-gray-700 overflow-hidden">
            <VideoPlayer stream={localStream} />
            <div className="absolute top-2 left-2 text-xs bg-blue-600 px-2 py-1 rounded">
              You
            </div>
          </div>
        )}

        {/* REMOTE NORMAL VIDEOS */}
        {normalRemoteVideos.map(([key, data]) => (
          <div
            key={key}
            className="relative rounded-xl aspect-video border border-gray-700 overflow-hidden"
          >
            <VideoPlayer stream={data.stream} />
            <div className="absolute top-2 left-2 text-xs bg-gray-800 px-2 py-1 rounded">
              {data.appData?.username}
            </div>
          </div>
        ))}
      </div>

      {/* ================== HIDDEN AUDIO ================== */}
      {remoteAudioStreams.map(([key, data]) => (
        <audio
          key={key}
          ref={(el) => {
            if (el && el.srcObject !== data.stream) {
              el.srcObject = data.stream;
            }
          }}
          autoPlay
        />
      ))}
    </div>
  );
};

export default MainVideos;

import React from "react";
import { VideoPlayer } from "./VideoPlayer";
import { getGridClass } from "@/utils/getGridClass";
import { RemoteStreamData } from "../../hooks/useJoinRoom";
import { Monitor, VideoOff, User } from "lucide-react";

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

  const remoteVideoStreams = remoteStreamsArray.filter(
    ([, data]) => data.kind === "video",
  );
  const remoteAudioStreams = remoteStreamsArray.filter(
    ([, data]) => data.kind === "audio",
  );

  const remoteScreenShare = remoteVideoStreams.find(
    ([, data]) => data.appData?.mediaTag === "screen",
  );
  const normalRemoteVideos = remoteVideoStreams.filter(
    ([, data]) => data.appData?.mediaTag !== "screen",
  );

  const hasAnyScreenShare = !!remoteScreenShare || !!localScreenStream;
  const totalParticipants = normalRemoteVideos.length + (localStream ? 1 : 0);

  return (
    <div className="flex-1 flex flex-col gap-3 p-3 overflow-hidden bg-neutral-950 min-h-0">
      {/* ── SCREEN SHARE SPOTLIGHT ── */}
      {hasAnyScreenShare && (
        <div
          className="relative w-full rounded-xl overflow-hidden border border-white/10 shrink-0 bg-black"
          style={{ maxHeight: "58vh", aspectRatio: "16/9" }}
        >
          {localScreenStream && (
            <>
              <VideoPlayer stream={localScreenStream} />
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm border border-white/10 text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full">
                <Monitor className="w-3 h-3" />
                Your Screen
              </div>
            </>
          )}

          {remoteScreenShare && !localScreenStream && (
            <>
              <VideoPlayer stream={remoteScreenShare[1].stream} />
              <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm border border-white/10 text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full">
                <Monitor className="w-3 h-3" />
                {remoteScreenShare[1].appData?.username}&apos;s Screen
              </div>
            </>
          )}
        </div>
      )}

      {/* ── VIDEO GRID ── */}
      <div
        className={`
          flex-1 min-h-0 grid overflow-y-auto auto-rows-fr gap-3
          ${
            hasAnyScreenShare
              ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
              : getGridClass(totalParticipants)
          }
        `}
      >
        {/* LOCAL CAMERA */}
        {localStream && (
          <div className="relative rounded-xl aspect-video border border-white/10 overflow-hidden bg-neutral-900 group">
            <VideoPlayer stream={localStream} />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm border border-white/10 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
              You
            </div>
          </div>
        )}

        {/* REMOTE VIDEOS */}
        {normalRemoteVideos.map(([key, data]) => (
          <div
            key={key}
            className="relative rounded-xl aspect-video border border-white/10 overflow-hidden bg-neutral-900 group"
          >
            {!data.paused ? (
              <>
                <VideoPlayer stream={data.stream} />
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-neutral-900">
                <div className="w-10 h-10 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center">
                  <User
                    className="w-5 h-5 text-neutral-500"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex items-center gap-1.5 text-neutral-500 text-[10px] font-medium">
                  <VideoOff className="w-3 h-3" />
                  Camera Off
                </div>
              </div>
            )}

            {/* Name tag */}
            <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm border border-white/10 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 inline-block" />
              {data.appData?.username ?? "Participant"}
            </div>
          </div>
        ))}

        {/* EMPTY STATE — no participants yet */}
        {totalParticipants === 0 && !hasAnyScreenShare && (
          <div className="col-span-full flex flex-col items-center justify-center h-full gap-3 text-center">
            <div className="w-12 h-12 rounded-2xl bg-neutral-800 border border-white/10 flex items-center justify-center">
              <User className="w-6 h-6 text-neutral-600" strokeWidth={1.5} />
            </div>
            <p className="text-neutral-500 text-sm font-medium">
              Waiting for participants to join…
            </p>
          </div>
        )}
      </div>

      {/* ── HIDDEN AUDIO ── */}
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

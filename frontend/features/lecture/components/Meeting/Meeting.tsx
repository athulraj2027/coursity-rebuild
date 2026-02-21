"use client";

import React, { useEffect, useRef, useState } from "react";
import ControlBar from "./ControlBar";
import MainVideos from "./MainVideos";
import Participants from "./Participants";
import Chat from "./Chat";
import { useJoinRoom } from "../../hooks/useJoinRoom";
import { socket } from "@/lib/socket";
import { toast } from "sonner";
import Header from "./Header";
import { useLectureSocket } from "../../hooks/useLectureSocket";
import { useMessage } from "../../hooks/useMessage";
import { MessageSquare, Users, Video } from "lucide-react";

type ActivePanel = "chat" | "participants" | null;

const Meeting = ({
  lectureId,
  role,
}: {
  lectureId: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
}) => {
  const [activePanel, setActivePanel] = useState<ActivePanel>(null);
  const hasInitialized = useRef(false);

  const {
    createMeetingEssentials,
    startVideo,
    stopVideo,
    startMic,
    stopMic,
    startScreenShare,
    stopScreenShare,
    localStream,
    remoteStreams,
    localScreenStream,
    existingUsers,
    setExistingUsers,
    consume,
    leaveRoom,
    removeProducerById,
    pauseVideoUI,
    resumeVideoUI,
  } = useJoinRoom();

  const { message, setMessage, messages, sendMessage } = useMessage(lectureId);

  useLectureSocket(
    lectureId,
    setExistingUsers,
    consume,
    removeProducerById,
    pauseVideoUI,
    resumeVideoUI,
  );

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const init = async () => {
      try {
        if (role === "TEACHER") {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const createResponse = await new Promise<any>((resolve) => {
            socket.emit("create-room", { lectureId }, resolve);
          });
          if (!createResponse.success) {
            toast.error("Failed to start lecture");
            return;
          }
          toast.success("Lecture has been started.");
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const joinResponse = await new Promise<any>((resolve) => {
          socket.emit("join-room", { lectureId }, resolve);
        });

        if (!joinResponse.success) {
          toast.error("Failed to join lecture");
          return;
        }

        if (role !== "TEACHER") toast.success("You have joined the lecture");

        await createMeetingEssentials(
          joinResponse.rtpCapabilities,
          lectureId,
          joinResponse.existingUsers,
        );
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
      }
    };

    init();
  }, [lectureId, role, createMeetingEssentials]);

  const mobileTabs: {
    key: ActivePanel;
    label: string;
    icon: React.ElementType;
  }[] = [
    { key: null, label: "Videos", icon: Video },
    { key: "chat", label: "Chat", icon: MessageSquare },
    { key: "participants", label: "People", icon: Users },
  ];

  return (
    <div className="h-screen w-full flex flex-col bg-neutral-950 text-white overflow-hidden">
      {/* Header */}
      <Header />

      {/* Mobile tab switcher */}
      <div className="lg:hidden flex items-center gap-1 px-3 py-2 border-b border-white/8 bg-neutral-900 shrink-0">
        {mobileTabs.map(({ key, label, icon: Icon }) => {
          const isActive = activePanel === key;
          return (
            <button
              key={String(key)}
              onClick={() => setActivePanel(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                isActive
                  ? "bg-white text-black"
                  : "text-neutral-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-3.5 h-3.5" strokeWidth={1.8} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Videos */}
        <div
          className={`flex-1 min-w-0 min-h-0 ${activePanel !== null ? "hidden lg:flex" : "flex"} flex-col`}
        >
          <MainVideos
            localStream={localStream}
            remoteStreams={remoteStreams}
            localScreenStream={localScreenStream}
          />
        </div>

        {/* Chat panel */}
        <div
          className={`
            w-full lg:w-80 shrink-0
            border-l border-white/8 bg-neutral-900
            flex flex-col min-h-0
            ${activePanel === "chat" ? "flex" : "hidden lg:flex"}
          `}
        >
          <div className="hidden lg:flex items-center gap-2 px-4 py-3 border-b border-white/8 shrink-0">
            <MessageSquare
              className="w-4 h-4 text-neutral-400"
              strokeWidth={1.8}
            />
            <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              Chat
            </span>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <Chat
              message={message}
              messages={messages}
              sendMessage={sendMessage}
              setMessage={setMessage}
            />
          </div>
        </div>

        {/* Participants panel */}
        <div
          className={`
            w-full lg:w-64 shrink-0
            border-l border-white/8 bg-neutral-900
            flex flex-col min-h-0
            ${activePanel === "participants" ? "flex" : "hidden lg:flex"}
          `}
        >
          <div className="hidden lg:flex items-center gap-2 px-4 py-3 border-b border-white/8 shrink-0">
            <Users className="w-4 h-4 text-neutral-400" strokeWidth={1.8} />
            <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              Participants
            </span>
            <span className="ml-auto text-[10px] font-bold text-neutral-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
              {existingUsers.length}
            </span>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <Participants users={existingUsers} />
          </div>
        </div>
      </div>

      {/* Control bar */}
      <ControlBar
        lectureId={lectureId}
        startVideo={startVideo}
        stopVideo={stopVideo}
        startMic={startMic}
        stopMic={stopMic}
        startScreenShare={startScreenShare}
        stopScreenShare={stopScreenShare}
        leaveRoom={leaveRoom}
      />
    </div>
  );
};

export default Meeting;

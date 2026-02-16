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

const Meeting = ({
  lectureId,
  role,
}: {
  lectureId: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
}) => {
  const [activePanel, setActivePanel] = useState<
    "chat" | "participants" | null
  >(null);
  const hasInitialized = useRef(false);

  const {
    createMeetingEssentials,
    startVideo,
    stopVideo,
    startMic,
    stopMic,
    startScreenShare,
    stopScreenShare,
  } = useJoinRoom();

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
        await createMeetingEssentials(joinResponse.rtpCapabilities, lectureId);
      } catch (err) {
        console.error(err);
        toast.error("Something went wrong");
      }
    };

    init();

    return () => {
      socket.emit("leave-room", { lectureId });
    };
  }, [lectureId, role, createMeetingEssentials]);

  return (
    <div className="h-screen w-full flex flex-col bg-gray-900 text-white">
      <Header />
      {/* MOBILE PANEL SWITCH BUTTONS */}
      <div className="lg:hidden flex gap-2 px-4 py-2 border-b border-gray-700">
        <button
          onClick={() => setActivePanel("chat")}
          className="px-3 py-1 bg-gray-800 rounded"
        >
          Chat
        </button>
        <button
          onClick={() => setActivePanel("participants")}
          className="px-3 py-1 bg-gray-800 rounded"
        >
          Participants
        </button>
        <button
          onClick={() => setActivePanel(null)}
          className="px-3 py-1 bg-gray-800 rounded"
        >
          Videos
        </button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        {/* VIDEOS (always visible on desktop, conditional on mobile) */}
        <div
          className={`
            flex-1
            ${activePanel ? "hidden lg:block" : "block"}
          `}
        >
          {/* <MainVideos stream={stream} /> */}
        </div>

        {/* CHAT */}
        <div
          className={`
            w-full lg:w-80 border-l border-gray-700 h-full
            ${activePanel === "chat" ? "block" : "hidden lg:block"}
          `}
        >
          <Chat />
        </div>

        {/* PARTICIPANTS */}
        <div
          className={`
            w-full lg:w-72 border-l border-gray-700
            ${activePanel === "participants" ? "block" : "hidden lg:block"}
          `}
        >
          <Participants />
        </div>
      </div>

      <ControlBar
        lectureId={lectureId}
        startVideo={startVideo}
        stopVideo={stopVideo}
        startMic={startMic}
        stopMic={stopMic}
        startScreenShare={startScreenShare}
        stopScreenShare={stopScreenShare}
      />
    </div>
  );
};

export default Meeting;

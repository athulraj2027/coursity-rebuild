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

          console.log("createresponse  : ", createResponse);
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
        console.log("join response : ", joinResponse);
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
          <MainVideos
            localStream={localStream}
            remoteStreams={remoteStreams}
            localScreenStream={localScreenStream}
          />
        </div>

        {/* CHAT */}
        <div
          className={`
            w-full lg:w-80 border-l border-gray-700 h-full
            ${activePanel === "chat" ? "block" : "hidden lg:block"}
          `}
        >
          <Chat
            message={message}
            messages={messages}
            sendMessage={sendMessage}
            setMessage={setMessage}
          />
        </div>

        {/* PARTICIPANTS */}
        <div
          className={`
            w-full lg:w-72 border-l border-gray-700
            ${activePanel === "participants" ? "block" : "hidden lg:block"}
          `}
        >
          <Participants users={existingUsers} />
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
        leaveRoom={leaveRoom}
      />
    </div>
  );
};

export default Meeting;

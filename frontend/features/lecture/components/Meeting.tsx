"use client";

import React, { useState } from "react";
import ControlBar from "./ControlBar";
import MainVideos from "./MainVideos";
import Participants from "./Participants";
import Chat from "./Chat";

const Meeting = ({ lectureId }: { lectureId: string }) => {
  const [activePanel, setActivePanel] = useState<
    "chat" | "participants" | null
  >(null);

  return (
    <div className="h-screen w-full flex flex-col bg-gray-900 text-white">
      {/* HEADER */}
      <div className="flex justify-between items-center px-4 lg:px-6 py-3 border-b border-gray-700">
        <h1 className="text-lg font-semibold">Lecture Room</h1>
        <p className="text-sm text-gray-300">ID: {lectureId}</p>
      </div>

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
          <MainVideos />
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

      <ControlBar />
    </div>
  );
};

export default Meeting;

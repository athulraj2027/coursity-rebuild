import {
  Mic,
  MicOff,
  PhoneOff,
  Video,
  VideoOff,
  MonitorUp,
} from "lucide-react";
import React, { useState } from "react";

type ControlBarProps = {
  startVideo: (lectureId: string) => Promise<void>;
  stopVideo: () => Promise<void>;
  startMic: (lectureId: string) => Promise<void>;
  stopMic: () => Promise<void>;
  startScreenShare: (lectureId: string) => Promise<void>;
  stopScreenShare: () => Promise<void>;
  lectureId: string;
};

const ControlBar = ({
  startVideo,
  stopVideo,
  startMic,
  stopMic,
  startScreenShare,
  stopScreenShare,
  lectureId,
}: ControlBarProps) => {
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const handleVideoToggle = async () => {
    if (isVideoOn) {
      await stopVideo();
      setIsVideoOn(false);
    } else {
      await startVideo(lectureId);
      setIsVideoOn(true);
    }
  };

  const handleMicToggle = async () => {
    if (isMicOn) {
      await stopMic();
      setIsMicOn(false);
    } else {
      await startMic(lectureId);
      setIsMicOn(true);
    }
  };

  const handleScreenToggle = async () => {
    if (isScreenSharing) {
      await stopScreenShare();
      setIsScreenSharing(false);
    } else {
      await startScreenShare(lectureId);
      setIsScreenSharing(true);
    }
  };

  const handleLeave = () => {
    window.location.href = "/"; // or router.push(...)
  };

  return (
    <div className="flex justify-center items-center gap-6 py-4 border-t border-gray-700 bg-gray-900">
      {/* MIC */}
      <button
        onClick={handleMicToggle}
        className={`p-4 rounded-full transition ${
          isMicOn
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-700 hover:bg-gray-600"
        }`}
      >
        {isMicOn ? <Mic size={20} /> : <MicOff size={20} />}
      </button>

      {/* CAMERA */}
      <button
        onClick={handleVideoToggle}
        className={`p-4 rounded-full transition ${
          isVideoOn
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-700 hover:bg-gray-600"
        }`}
      >
        {isVideoOn ? <Video size={20} /> : <VideoOff size={20} />}
      </button>

      {/* SCREEN SHARE */}
      <button
        onClick={handleScreenToggle}
        className={`p-4 rounded-full transition ${
          isScreenSharing
            ? "bg-blue-600 hover:bg-blue-700"
            : "bg-gray-700 hover:bg-gray-600"
        }`}
      >
        <MonitorUp size={20} />
      </button>

      {/* LEAVE */}
      <button
        onClick={handleLeave}
        className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition"
      >
        <PhoneOff size={20} />
      </button>
    </div>
  );
};

export default ControlBar;

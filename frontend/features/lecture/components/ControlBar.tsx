import { Mic, PhoneOff, Video } from "lucide-react";
import React from "react";

const ControlBar = () => {
  return (
    <div className="flex justify-center items-center gap-6 py-4 border-t border-gray-700 bg-gray-900">
      {/* MIC */}
      <button className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition">
        <Mic size={20} />
      </button>

      {/* CAMERA */}
      <button className="p-4 rounded-full bg-gray-700 hover:bg-gray-600 transition">
        <Video size={20} />
      </button>

      {/* LEAVE */}
      <button className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition">
        <PhoneOff size={20} />
      </button>
    </div>
  );
};

export default ControlBar;

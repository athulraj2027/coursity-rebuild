import React from "react";

const Chat = () => {
  return (
    <div className="w-72 border-l border-gray-700 flex flex-col bg-gray-900">
      {/* CHAT HEADER */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="font-medium">Chat</h2>
      </div>

      {/* MESSAGES AREA */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* RECEIVED MESSAGE */}
        <div className="flex flex-col">
          <span className="text-xs text-gray-400">John</span>
          <div className="bg-gray-800 px-3 py-2 rounded-lg w-fit max-w-[80%]">
            Hello everyone 👋
          </div>
        </div>

        {/* SENT MESSAGE */}
        <div className="flex flex-col items-end">
          <span className="text-xs text-gray-400">You</span>
          <div className="bg-blue-600 px-3 py-2 rounded-lg w-fit max-w-[80%]">
            Hi!
          </div>
        </div>
      </div>

      {/* INPUT AREA */}
      <div className="p-3 border-t border-gray-700 flex gap-2">
        <input
          type="text"
          placeholder="Send a message..."
          className="flex-1 px-3 py-2 rounded-lg bg-gray-800 outline-none text-sm"
        />
        <button className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

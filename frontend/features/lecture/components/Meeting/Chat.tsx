"use client";

import { useEffect, useRef } from "react";

type Message = {
  message: string;
  lectureId: string;
  senderId?: string;
};

type ChatProps = {
  message: string;
  setMessage: (value: string) => void;
  messages: Message[];
  sendMessage: () => void;
};

const Chat = ({ message, setMessage, messages, sendMessage }: ChatProps) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // ✅ Auto scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* HEADER */}
      <div className="p-4 border-b border-gray-700 shrink-0">
        <h2 className="font-medium text-white">Chat</h2>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => {
          const isOwnMessage = msg.senderId === "You";

          return (
            <div
              key={index}
              className={`flex ${
                isOwnMessage ? "justify-end" : "justify-start"
              }`}
            >
              <div className="flex flex-col max-w-[80%]">
                <span
                  className={`text-xs mb-1 ${
                    isOwnMessage
                      ? "text-blue-400 text-right"
                      : "text-gray-400 text-left"
                  }`}
                >
                  {isOwnMessage ? "You" : msg.senderId || "User"}
                </span>

                <div
                  className={`px-4 py-2 rounded-2xl text-sm wrap-break-word ${
                    isOwnMessage
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-gray-700 text-white rounded-bl-sm"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            </div>
          );
        })}

        {/* Invisible div for auto-scroll */}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div className="p-3 border-t border-gray-700 shrink-0 bg-gray-900">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Send a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-4 py-2 rounded-full bg-gray-800 outline-none text-sm text-white"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <button
            className="px-5 py-2 bg-blue-600 rounded-full hover:bg-blue-700 transition text-white text-sm"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

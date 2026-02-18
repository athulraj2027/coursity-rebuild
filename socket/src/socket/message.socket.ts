import type { Socket } from "socket.io";
import { SendMessageHandler } from "../handlers/message.handler.js";

export function messageSocket(socket: Socket) {
  socket.on(
    "send-message",
    async ({ message, lectureId }) =>
      await SendMessageHandler(socket, message, lectureId),
  );
}

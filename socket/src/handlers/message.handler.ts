import type { Socket } from "socket.io";

export async function SendMessageHandler(
  socket: Socket,
  message: string,
  lectureId: string,
) {
  const { id, username } = socket;
  console.log("message sending : ", message);
  socket
    .to(lectureId)
    .emit("receive-message", { message, user: { id, username } });
}

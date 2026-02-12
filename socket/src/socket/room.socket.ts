import type { Socket } from "socket.io";

export function roomSocket(socket: Socket) {
  socket.on("create-room", () => {
    console.log("room created");
  });
  socket.on("join-room", () => {});
  socket.on("leave-room", () => {});
  socket.on("close-room", () => {});
  socket.on("disconnect", () => {});
}

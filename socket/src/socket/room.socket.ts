import type { Socket } from "socket.io";
import {
  CreateRoomHandler,
  JoinRoomHandler,
} from "../handlers/room.handlers.js";

export function roomSocket(socket: Socket) {
  socket.on("create-room", async ({ lectureId }, cb) =>
    CreateRoomHandler(socket, lectureId, cb),
  );
  socket.on("join-room", async ({ lectureId }, cb) =>
    JoinRoomHandler(socket, lectureId, cb),
  );
  socket.on("leave-room", () => {});
  socket.on("close-room", () => {});
  socket.on("disconnect", () => {});
}

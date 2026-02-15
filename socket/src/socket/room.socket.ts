import type { Socket } from "socket.io";
import {
  CloseRoomHandler,
  CreateRoomHandler,
  DisconnectHandler,
  JoinRoomHandler,
  LeaveRoomHandler,
} from "../handlers/room.handlers.js";

export function roomSocket(socket: Socket) {
  socket.on("create-room", async ({ lectureId }, cb) =>
    CreateRoomHandler(socket, lectureId, cb),
  );
  socket.on("join-room", async ({ lectureId }, cb) =>
    JoinRoomHandler(socket, lectureId, cb),
  );
  socket.on("leave-room", ({ lectureId }) => {
    LeaveRoomHandler(socket, lectureId);
  });
  socket.on("close-room", ({ lectureId }) =>
    CloseRoomHandler(socket, lectureId),
  );
  socket.on("disconnect", () => DisconnectHandler(socket));
}

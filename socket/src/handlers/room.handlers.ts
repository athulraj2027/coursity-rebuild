import { createRouter } from "../mediasoup/router.js";
import { Room } from "../store/room.js";
import type { Socket } from "socket.io";
import { User } from "../store/user.js";
import { roomStore } from "../store/roomStore.js";

export async function CreateRoomHandler(
  socket: Socket,
  lectureId: string,
  cb: (data: any) => void,
) {
  const { id, userId } = socket;
  const router = await createRouter();
  const user = new User(id, userId);
  const room = new Room(lectureId, router, userId);
  roomStore.addRoom(lectureId, room);
  room.addPeer(user);
  socket.join(lectureId);
  console.log("new room : ", room);
  cb({ success: true });
}

export function JoinRoomHandler(
  socket: Socket,
  lectureId: string,
  cb: (data: any) => void,
) {
  const { id, userId } = socket;
  const room = roomStore.getRoom(lectureId);
  if (!room) {
    cb({ success: false, message: "Room not found" });
    return;
  }
  const user = new User(id, userId);
  room.addPeer(user);
  socket.join(lectureId);
  socket.to(lectureId).emit("new-user-joined", { user });
  console.log("joined room  - ", lectureId);
  cb({ success: true });
}

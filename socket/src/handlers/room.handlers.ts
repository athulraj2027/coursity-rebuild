import { createRouter } from "../mediasoup/router.js";
import { Room } from "../store/room.js";
import type { Socket } from "socket.io";
import { User } from "../store/user.js";

export async function CreateRoomHandler(
  socket: Socket,
  lectureId: string,
  cb: (data: any) => void,
) {
  const { id, userId } = socket;
  const router = await createRouter();
  const user = new User(id, userId);
  const room = new Room(lectureId, router, userId);
  room.addPeer(user);
  socket.join(lectureId);
  console.log("new room : ", room);
  cb({ success: true });
}

export function JoinRoomHandler(lectureId: string) {}

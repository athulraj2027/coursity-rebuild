import { createRouter } from "../mediasoup/router.js";
import { Room } from "../store/room.js";
import type { Socket } from "socket.io";
import { User } from "../store/user.js";
import { roomStore } from "../store/roomStore.js";
import { userStore } from "../store/userStore.js";

export async function CreateRoomHandler(
  socket: Socket,
  lectureId: string,
  cb: (data: any) => void,
) {
  const { id, userId } = socket;
  const router = await createRouter();
  const user = new User(id, userId, lectureId);
  const room = new Room(lectureId, router, userId);
  roomStore.addRoom(lectureId, room);
  userStore.add(socket.id, user);
  room.addPeer(user);
  socket.join(lectureId);
  console.log("new room : ", room);
  cb({ success: true, rtpCapabilities: room.router.rtpCapabilities });
}

export function JoinRoomHandler(
  socket: Socket,
  lectureId: string,
  cb: (data: any) => void,
) {
  const { id, userId, username } = socket;
  const room = roomStore.getRoom(lectureId);
  if (!room) {
    cb({ success: false, message: "Room not found" });
    return;
  }
  if (userStore.get(socket.id)) {
    cb({ success: false, message: "Already joined" });
    return;
  }

  const existingUser = room.peers.get(userId);

  if (existingUser) {
    for (const transport of existingUser.transports.values()) transport.close();
    userStore.remove(existingUser.socketId);
    room.peers.delete(userId);
  }

  const user = new User(id, userId, lectureId);
  room.addPeer(user);
  userStore.add(socket.id, user);
  socket.join(lectureId);
  socket.to(lectureId).emit("new-user-joined", { username });
  console.log("joined room  - ", lectureId);
  cb({ success: true, rtpCapabilities: room.router.rtpCapabilities });
}

export function DisconnectHandler(socket: Socket) {
  console.log("disconnecting the user : ", socket.id);
  const { username } = socket;
  const user = userStore.get(socket.id);
  if (!user) return;

  const room = roomStore.getRoom(user.lectureId);
  if (!room) return;

  for (const transport of user.transports.values()) transport.close();
  for (const producer of user.producers.values()) producer.close();
  for (const consumer of user.consumers.values()) consumer.close();

  room.peers.delete(user.userId);

  socket.to(user.lectureId).emit("peer-left", { username });

  // 4. If teacher disconnected
  if (user.userId === room.teacherId) {
    console.log("emitting the lecture ended");
    socket.to(user.lectureId).emit("lecture-ended");
    roomStore.removeRoom(user.lectureId);
  }
}

export function LeaveRoomHandler(socket: Socket, lectureId: string) {}

export function CloseRoomHandler(socket: Socket, lectureId: string) {}

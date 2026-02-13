import type { Consumer, Producer, Router, Transport } from "mediasoup/types";

export interface User {
  socketId: string;
  userId: string;
  transports: Map<string, Transport>;
  producers: Map<string, Producer>;
  consumers: Map<string, Consumer>;
}

export interface RoomInterface {
  router: Router;
  lectureId: string;
  teacherId: string;
  peers: Map<string, User>;
}

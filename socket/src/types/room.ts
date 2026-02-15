import type { Router } from "mediasoup/types";
import type { User } from "../store/user.js";

export interface RoomInterface {
  router: Router;
  lectureId: string;
  teacherId: string;
  peers: Map<string, User>;
}

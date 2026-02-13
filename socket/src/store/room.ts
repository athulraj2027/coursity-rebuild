import type { Router } from "mediasoup/types";
import type { User } from "../types/room.js";

export class Room {
  public router: Router;
  public lectureId: string;
  public teacherId: string;
  public peers: Map<string, User>;

  constructor(lectureId: string, router: Router, teacherId: string) {
    this.router = router;
    this.lectureId = lectureId;
    this.teacherId = teacherId;
    this.peers = new Map();
  }

  addPeer(user: User) {
    this.peers.set(user.userId, user);
  }
}

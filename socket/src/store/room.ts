import type { Router } from "mediasoup/types";
import type { User } from "./user.js";

export class Room {
  public router: Router;
  public lectureId: string;
  public teacherId: string;
  public teacherName: string;
  public peers: Map<string, User>;

  constructor(
    lectureId: string,
    router: Router,
    teachername: string,
    teacherId: string,
  ) {
    this.router = router;
    this.lectureId = lectureId;
    this.teacherId = teacherId;
    this.teacherName = teachername;
    this.peers = new Map();
  }

  addPeer(user: User) {
    this.peers.set(user.userId, user);
  }

  removePeer(user: User) {
    this.peers.delete(user.userId);
  }

  getRouter() {
    return this.router;
  }

  getUser(userId: string) {
    const user = this.peers.get(userId);
    if (!user) return null;
    return user;
  }

  getAllUsernames() {
    const array: object[] = [];
    this.peers.values().forEach((user) => {
      array.push({ username: user.username, userId: user.userId });
    });

    return array;
  }
}

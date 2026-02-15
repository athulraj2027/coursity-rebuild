import type { User } from "./user.js";

class UserStore {
  private users = new Map<string, User>();

  add(socketId: string, user: User) {
    this.users.set(socketId, user);
  }

  get(socketId: string) {
    return this.users.get(socketId);
  }

  remove(socketId: string) {
    this.users.delete(socketId);
  }
}

export const userStore = new UserStore();

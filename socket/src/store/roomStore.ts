import { Room } from "./room.js";

class RoomStore {
  private rooms: Map<string, Room> = new Map();

  addRoom(lectureId: string, room: Room) {
    this.rooms.set(lectureId, room);
  }

  getRoom(lectureId: string) {
    return this.rooms.get(lectureId);
  }

  removeRoom(lectureId: string) {
    this.rooms.delete(lectureId);
  }

  hasRoom(lectureId: string) {
    return this.rooms.has(lectureId);
  }
}

export const roomStore = new RoomStore();

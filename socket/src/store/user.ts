import type { Consumer, Producer, Transport } from "mediasoup/types";

export class User {
  public socketId: string;
  public userId: string;
  public transports: Map<string, Transport>;
  public producers: Map<string, Producer>;
  public consumers: Map<string, Consumer>;

  constructor(socketId: string, userId: string) {
    this.socketId = socketId;
    this.userId = userId;
    this.transports = new Map();
    this.consumers = new Map();
    this.producers = new Map();
  }
}

import type { Consumer, Producer, Transport } from "mediasoup/types";

export class User {
  public socketId: string;
  public userId: string;
  public username: string;
  public transports: Map<string, Transport>;
  public producers: Map<string, Producer>;
  public consumers: Map<string, Consumer>;
  public lectureId: string;

  constructor(
    socketId: string,
    userId: string,
    username: string,
    lectureId: string,
  ) {
    this.socketId = socketId;
    this.userId = userId;
    this.username = username;
    this.lectureId = lectureId;
    this.transports = new Map();
    this.consumers = new Map();
    this.producers = new Map();
  }
  addTransport(transport: Transport) {
    this.transports.set(transport.id, transport);
  }
  getTransportById(id: string) {
    return this.transports.get(id);
  }
  addProducer(producer: Producer) {
    this.producers.set(producer.id, producer);
  }
  getProducerById(producerId: string) {
    return this.producers.get(producerId);
  }
  addConsumer(consumer: Consumer) {
    this.consumers.set(consumer.id, consumer);
  }

  getConsumerById(consumerId: string) {
    return this.consumers.get(consumerId);
  }
}

import type { Socket } from "socket.io";
import {
  ConsumeHandler,
  GetProducersHandler,
  ResumeConsumerHandler,
  StopConsumerHandler,
} from "../handlers/consumer.handlers.js";

export function consumerSocket(socket: Socket) {
  socket.on(
    "consume",
    async ({ lectureId, producer, rtpCapabilities, transportId }, cb) =>
      await ConsumeHandler(
        socket,
        lectureId,
        producer,
        rtpCapabilities,
        transportId,
        cb,
      ),
  );

  socket.on(
    "get-producers",
    async ({ lectureId }, cb) =>
      await GetProducersHandler(socket, lectureId, cb),
  );

  socket.on(
    "resume-consumer",
    async ({ lectureId, consumerId }, cb) =>
      await ResumeConsumerHandler(socket, lectureId, consumerId, cb),
  );

  socket.on("close-consumer", async ({ producerId, lectureId }, cb) =>
    StopConsumerHandler(socket, producerId, lectureId, cb),
  );
}

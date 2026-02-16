import type { Socket } from "socket.io";
import {
  PauseProducerHandler,
  ProduceHandler,
  ResumeProducerHandler,
  StopProducerHandler,
} from "../handlers/producer.handlers.js";

export function producerSocket(socket: Socket) {
  socket.on(
    "produce",
    async ({ transportId, rtpParameters, kind, appData }, cb) =>
      await ProduceHandler(
        socket,
        transportId,
        rtpParameters,
        kind,
        appData,
        cb,
      ),
  );

  socket.on(
    "pause-produce",
    async ({ producerId, lectureId }, cb) =>
      await PauseProducerHandler(socket, producerId, lectureId, cb),
  );

  socket.on(
    "resume-produce",
    async ({ producerId, lectureId }) =>
      await ResumeProducerHandler(socket, producerId, lectureId),
  );

  socket.on(
    "stop-screen-share",
    async ({ producerId, lectureId }, cb) =>
      await StopProducerHandler(socket, producerId, lectureId, cb),
  );
}

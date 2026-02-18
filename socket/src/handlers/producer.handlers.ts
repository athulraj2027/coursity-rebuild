import type { RtpParameters } from "mediasoup/types";
import type { Socket } from "socket.io";
import { roomStore } from "../store/roomStore.js";
import {
  CloseProducer,
  CreateProducer,
  PauseProducer,
  ResumeProducer,
} from "../mediasoup/producer.js";

export async function ProduceHandler(
  socket: Socket,
  transportId: string,
  rtpParameters: RtpParameters,
  kind: "audio" | "video",
  appData: any,
  cb: (data: any) => void,
) {
  const { lectureId } = appData;
  const { userId, username } = socket;
  const user = roomStore.getRoom(lectureId)?.getUser(userId);
  const transport = user?.getTransportById(transportId);
  if (!transport) return;
  const producer = await CreateProducer(transport, {
    kind,
    rtpParameters,
    appData: { ...appData, username },
  });

  producer.observer.on("pause", () => {
    socket.to(lectureId).emit("producerpaused", { producerId: producer.id });
  });
  producer.observer.on("resume", () => {
    socket.to(lectureId).emit("producerresumed", { producerId: producer.id });
  });
  producer.observer.on("close", () => {
    socket.to(lectureId).emit("producerclosed", { producerId: producer.id });
  });

  if (!producer) return;
  user?.addProducer(producer);

  cb({ id: producer.id });
  socket.to(lectureId).emit("new-producer", {
    producer: {
      appData: producer.appData,
      producerId: producer.id,
      kind,
      paused: producer.paused,
    },
  });
}

export async function PauseProducerHandler(
  socket: Socket,
  producerId: string,
  lectureId: string,
  cb: (data: any) => void,
) {
  const { userId } = socket;
  const producer = roomStore
    .getRoom(lectureId)
    ?.getUser(userId)
    ?.getProducerById(producerId);

  if (!producer) {
    cb({ success: false });
    return;
  }
  await PauseProducer(producer);
  cb({ success: true, producerId });
}

export async function ResumeProducerHandler(
  socket: Socket,
  producerId: string,
  lectureId: string,
) {
  const { userId } = socket;
  const producer = roomStore
    .getRoom(lectureId)
    ?.getUser(userId)
    ?.getProducerById(producerId);

  if (!producer) {
    return;
  }
  await ResumeProducer(producer);
  return;
}

export async function StopProducerHandler(
  socket: Socket,
  producerId: string,
  lectureId: string,
  cb: (data: any) => void,
) {
  const { userId } = socket;
  const producer = roomStore
    .getRoom(lectureId)
    ?.getUser(userId)
    ?.getProducerById(producerId);
  if (!producer) {
    cb({ success: false });
    return;
  }

  await CloseProducer(producer);
}

import type { AppData, Consumer, RtpCapabilities } from "mediasoup/types";
import type { Socket } from "socket.io";
import { roomStore } from "../store/roomStore.js";

interface ProducersListInterface {
  producerId: string;
  userId: string;
  appData: AppData;
  kind: "audio" | "video";
  paused: boolean;
}

export async function ConsumeHandler(
  socket: Socket,
  lectureId: string,
  producer: {
    producerId: string;
    kind: "audio" | "video";
    appData: AppData;
    paused: boolean;
  },
  rtpCapabilities: RtpCapabilities,
  transportId: string,
  cb: (data: any) => void,
) {
  const { userId } = socket;
  const { producerId, appData } = producer;

  const user = roomStore.getRoom(lectureId)?.getUser(userId);
  const transport = user?.getTransportById(transportId);
  if (!transport) {
    cb({ success: false, message: "No transport found" });
    return;
  }
  const consumer = await transport.consume({
    producerId,
    rtpCapabilities,
    appData,
  });
  if (!consumer) {
    console.log("no consumer created");
    cb({ success: false, message: "Consumer creation failed" });
    return;
  }

  consumer.observer.on("close", () => {
    console.log("consumer closed : ", consumer.id);
    user?.removeConsumer(consumer.id);
  });

  user?.addConsumer(consumer);

  const params = {
    id: consumer.id,
    producerId,
    appData: consumer.appData,
    kind: consumer.kind,
    rtpParameters: consumer.rtpParameters,
    producerUserId: userId,
  };

  console.log("the params sending from the consume event");
  cb({ success: true, params });
}

export async function GetProducersHandler(
  socket: Socket,
  lectureId: string,
  cb: (data: any) => void,
) {
  console.log("gettting producers for lecture id : ", lectureId);
  const { userId } = socket;
  const room = roomStore.getRoom(lectureId);
  if (!room) {
    console.log("no room");
    cb({ success: false, message: "No room found" });
    return;
  }

  console.log("user id : ", userId);
  const producerList: ProducersListInterface[] = [];
  room.peers.forEach((peer, id) => {
    if (id === userId) return;
    peer.producers.forEach((producer, id) => {
      producerList.push({
        producerId: producer.id,
        userId,
        appData: producer.appData,
        kind: producer.kind,
        paused: producer.paused,
      });
    });
  });

  console.log("producerList : ", producerList);
  cb({
    success: true,
    producers: producerList,
  });
}

export async function ResumeConsumerHandler(
  socket: Socket,
  lectureId: string,
  consumerId: string,
  cb: (data: any) => void,
) {
  const { userId } = socket;

  const consumer = roomStore
    .getRoom(lectureId)
    ?.getUser(userId)
    ?.getConsumerById(consumerId);

  if (!consumer) {
    cb({ success: false, message: "No consumer found" });
    return;
  }

  if (!consumer.paused) {
    cb({ success: false, message: "Consumer already resumed" });
    return;
  }

  await consumer.resume();
}

export async function StopConsumerHandler(
  socket: Socket,
  producerId: string,
  lectureId: string,
  cb: (data: any) => void,
) {
  const { userId } = socket;
  const room = roomStore.getRoom(lectureId);
  if (!room) {
    console.log("No room found");
    cb({ success: false, message: "No room found" });
    return;
  }
  const user = room.getUser(userId);
  if (!user) {
    console.log("No user found");
    cb({ success: false, message: "No user found" });
    return;
  }
  console.log('user"s consumers :', user.consumers.values());
  console.log("producerid : ", producerId);
  const consumer = user.getConsumerByProducerId(producerId);
  if (!consumer) {
    console.log("No consumer found");
    cb({ success: false, message: "No consumer found" });
    return;
  }
  cb({ success: true });
}

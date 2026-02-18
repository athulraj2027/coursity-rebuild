import type { Socket } from "socket.io";
import { connectTransport, createTransport } from "../mediasoup/transport.js";
import { roomStore } from "../store/roomStore.js";
import type { DtlsParameters } from "mediasoup/types";

export async function CreateTransportHandler(
  socket: Socket,
  direction: "recv" | "send",
  appData: { lectureId: string },
  cb: (data: any) => void,
) {
  const { userId } = socket;
  const room = roomStore.getRoom(appData.lectureId);
  const router = room?.getRouter();
  if (!router) {
    cb({ success: false, message: "No router found" });
    return;
  }
  const transport = await createTransport(router, direction);
  if (!transport) {
    cb({ success: false, message: "No transport created" });
    return;
  }
  const user = room?.getUser(userId);
  if (!user) {
    cb({ success: false, message: "No user found" });
    return;
  }
  user.addTransport(transport);
  cb({
    id: transport.id,
    iceParameters: transport.iceParameters,
    iceCandidates: transport.iceCandidates,
    dtlsParameters: transport.dtlsParameters,
  });
}

export async function ConnectTransportHandler(
  socket: Socket,
  transportId: string,
  dtlsParameters: DtlsParameters,
  appData: { lectureId: string },
  cb: (data: any) => void,
) {
  const { userId } = socket;
  const transport = roomStore
    .getRoom(appData.lectureId)
    ?.getUser(userId)
    ?.getTransportById(transportId);

  if (!transport) {
    cb({ success: false, message: "Transport not found" });
    return;
  }

  const res = await connectTransport(transport, dtlsParameters);
  cb(res);
}

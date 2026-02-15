import type { Socket } from "socket.io";
import {
  ConnectTransportHandler,
  CreateTransportHandler,
} from "../handlers/transport.handler.js";

export function transportSocket(socket: Socket) {
  socket.on(
    "create-transport",
    async ({ direction, appData }, cb) =>
      await CreateTransportHandler(socket, direction, appData, cb),
  );

  socket.on(
    "connect-transport",
    async ({ transportId, dtlsParameters, appData }, cb) => {
      await ConnectTransportHandler(
        socket,
        transportId,
        dtlsParameters,
        appData,
        cb,
      );
    },
  );
}

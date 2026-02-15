import { socket } from "@/lib/socket";
import * as mediasoupClient from "mediasoup-client";
import { Transport, TransportOptions } from "mediasoup-client/types";
import { useRef } from "react";

export const useJoinRoom = () => {
  const deviceRef = useRef<mediasoupClient.Device | null>(null);
  const sendTransportRef = useRef<Transport | null>(null);
  const recvTransportRef = useRef<Transport | null>(null);

  const createMeetingEssentials = async (
    rtpCapabilities: mediasoupClient.types.RtpCapabilities,
    lectureId: string,
  ) => {
    console.log("rtpcapabilities : ", rtpCapabilities);
    const device = new mediasoupClient.Device();
    await device.load({ routerRtpCapabilities: rtpCapabilities });
    deviceRef.current = device;
    console.log("new device loaded : ", device, "loaded : ", device.loaded);

    socket.emit(
      "create-transport",
      { direction: "send", appData: { lectureId } },
      async (params: TransportOptions) => {
        console.log("Transport params received for send : ", params);
        const sendTransport = device.createSendTransport(params);

        sendTransport?.on(
          "connect",
          async ({ dtlsParameters }, callback, errback) => {
            console.log(" Connect event fired - sending DTLS");
            console.log("dtls received : ", dtlsParameters);

            try {
              socket.emit(
                "connect-transport",
                {
                  transportId: sendTransport.id,
                  dtlsParameters,
                  appData: { lectureId },
                },
                (response: { success: boolean }) => {
                  console.log("Server response after connecting :", response);

                  if (response?.success) {
                    callback(); // Tell transport connection succeeded
                  } else {
                    const error = new Error("Connection failed");
                    errback(error);
                  }
                },
              );
            } catch (error) {
              console.error(" Connect error:", error);
              errback(error as Error);
            }
          },
        );

        sendTransport?.on("produce", ({ kind, rtpParameters, appData }, cb) => {
          console.log("produce event fired");
          socket.emit(
            "produce",
            {
              transportId: sendTransport.id,
              kind,
              rtpParameters,

              appData: { ...appData, lectureId },
            },
            ({ id }: { id: string }) => cb({ id }),
          );
        });
        sendTransportRef.current = sendTransport;
      },
    );

    socket.emit(
      "create-transport",
      { direction: "recv", appData: { lectureId } },
      async (params: TransportOptions) => {
        console.log("Transport params received for recv : ", params);
        const recvTransport = device.createRecvTransport(params);
        recvTransport?.on(
          "connect",
          async ({ dtlsParameters }, callback, errback) => {
            console.log(" Connect event fired - sending DTLS");
            console.log("dtls received : ", dtlsParameters);

            try {
              socket.emit(
                "connect-transport",
                {
                  transportId: recvTransport.id,
                  dtlsParameters,
                  appData: { lectureId },
                },
                (response: { success: boolean }) => {
                  console.log(" Server response after connecting :", response);
                  if (response?.success) {
                    callback();
                  } else {
                    const error = new Error("Connection failed");
                    errback(error);
                  }
                },
              );
            } catch (error) {
              console.error(" Connect error:", error);
              errback(error as Error);
            }
          },
        );
        recvTransportRef.current = recvTransport;
        console.log(
          "recvTransportId && recvTransportrefId",
          recvTransport.id,
          recvTransportRef.current.id,
        );
      },
    );
    return;
  };

  
  return { createMeetingEssentials };
};

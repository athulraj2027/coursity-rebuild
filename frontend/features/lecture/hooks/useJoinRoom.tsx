import { socket } from "@/lib/socket";
import * as mediasoupClient from "mediasoup-client";
import { Producer, Transport, TransportOptions } from "mediasoup-client/types";
import { useRef } from "react";
import { toast } from "sonner";

export const useJoinRoom = () => {
  const deviceRef = useRef<mediasoupClient.Device | null>(null);
  const sendTransportRef = useRef<Transport | null>(null);
  const recvTransportRef = useRef<Transport | null>(null);
  const videoProducerRef = useRef<Producer | undefined>(undefined);
  const audioProducerRef = useRef<Producer | undefined>(undefined);
  const screenProducerRef = useRef<Producer | undefined>(undefined);

  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localScreenStreamRef = useRef<MediaStream | null>(null);
  const localScreenRef = useRef<HTMLVideoElement>(null);

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
      },
    );
    return;
  };

  const startVideo = async (lectureId: string) => {
    try {
      if (videoProducerRef.current) {
        const mediastream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        localStreamRef.current = mediastream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = mediastream;
        }
        const newTrack = mediastream.getVideoTracks()[0];
        await videoProducerRef.current.replaceTrack({
          track: newTrack,
        });
        videoProducerRef.current.resume();
        return;
      }
      const mediastream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      localStreamRef.current = mediastream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = mediastream;
      }
      const track = mediastream.getVideoTracks()[0];
      const videoProducer = await sendTransportRef.current?.produce({
        track,
      });

      videoProducer?.observer.on("pause", () => {
        console.log("pausing producer...");
        console.log("video producer : ", videoProducer);
        socket.emit(
          "pause-produce",
          {
            producerId: videoProducer.id,
            lectureId,
          },
          ({ success }: { success: boolean; producerId: string }) => {
            console.log("pause : ", success);
          },
        );
      });

      videoProducer?.observer.on("resume", () => {
        console.log("resuming producer ...");
        socket.emit("resume-produce", {
          producerId: videoProducer.id,
          lectureId,
        });
      });

      videoProducer?.observer.on("close", () => {});

      videoProducerRef.current = videoProducer;
    } catch (error) {
      console.log("Error starting video:", error);
      toast.error("Camera permission required");
    }
  };

  const stopVideo = async () => {
    try {
      videoProducerRef.current?.pause();
      const track = localStreamRef.current?.getVideoTracks()[0];
      track?.stop();
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
    } catch (error) {
      console.log("Error in stopping video : ", error);
      toast.error("Failed to turn off camera.");
    }
  };

  const startMic = async (lectureId: string) => {
    try {
      if (audioProducerRef.current) {
        const mediastream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        localStreamRef.current = mediastream;
        const newTrack = mediastream.getAudioTracks()[0];
        await audioProducerRef.current.replaceTrack({
          track: newTrack,
        });
        audioProducerRef.current.resume();
        return;
      }
      const mediastream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      localStreamRef.current = mediastream;
      const track = mediastream.getAudioTracks()[0];
      const audioProducer = await sendTransportRef.current?.produce({
        track,
      });

      audioProducer?.observer.on("pause", () => {
        socket.emit(
          "pause-produce",
          {
            producerId: audioProducer.id,
            lectureId,
          },
          ({ success }: { success: boolean; producerId: string }) => {
            console.log("pause : ", success);
          },
        );
      });

      audioProducer?.observer.on("resume", () => {
        socket.emit("resume-produce", {
          producerId: audioProducer.id,
          lectureId,
        });
      });

      audioProducer?.observer.on("close", () => {});
      audioProducerRef.current = audioProducer;
    } catch (error) {
      console.log("Error starting mic:", error);
      toast.error("Mic permission required");
    }
  };

  const stopMic = async () => {
    try {
      audioProducerRef.current?.pause();
      const track = localStreamRef.current?.getAudioTracks()[0];
      track?.stop();
    } catch (error) {
      console.log("Error muting mic:", error);
      toast.error("Failed to mute mic");
    }
  };

  const startScreenShare = async (lectureId: string) => {
    try {
      const mediastream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      localScreenStreamRef.current = mediastream;
      if (localScreenRef.current) {
        localScreenRef.current.srcObject = mediastream;
      }
      const track = mediastream.getVideoTracks()[0];
      track.onended = () => {
        console.log("Screen share ended by browser");

        screenProducerRef.current?.close();
        screenProducerRef.current = undefined;
      };
      const screenProducer = await sendTransportRef.current?.produce({
        track,
        appData: { mediaTag: "screen" },
      });

      if (!screenProducer) {
        toast.error("Failed to share screen");
        return;
      }

      screenProducer.observer.on("close", () => {
        socket.emit(
          "stop-screen-share",
          { producerId: screenProducer.id, lectureId },
          () => {},
        );
      });

      screenProducerRef.current = screenProducer;
    } catch (error) {
      console.log("Error starting screenshare:", error);
      toast.error("Screen permission required");
    }
  };

  const stopScreenShare = async () => {
    try {
      screenProducerRef.current?.close();
      const track = localScreenStreamRef.current?.getVideoTracks()[0];
      track?.stop();
    } catch (error) {
      console.log("Error stopping screenshare:", error);
      toast.error("Failed to stop screenshare");
    }
  };

  return {
    createMeetingEssentials,
    stopScreenShare,
    startMic,
    startVideo,
    startScreenShare,
    stopMic,
    stopVideo,
  };
};

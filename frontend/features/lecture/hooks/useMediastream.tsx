"use client";
import { useState } from "react";
import { toast } from "sonner";

export const useMediastream = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const requestMedia = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      if (!mediaStream) {
        toast.error("Please allow camera and microphone access.");
        return null;
      }
      setStream(mediaStream);
      return mediaStream;
    } catch (error) {
      console.log(error);
      toast.error("Camera or microphone not available.");
      return null;
    }
  };

  const stopMedia = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  };
  return { stream, requestMedia, stopMedia };
};

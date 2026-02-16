"use client";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export const useMediastream = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);

  const requestMedia = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setStream(mediaStream);
      return mediaStream;
    } catch (error) {
      console.log(error);
      toast.error("Camera or microphone not available.");
      return null;
    }
  }, []);

  const stopMedia = useCallback(() => {
    setStream((prev) => {
      prev?.getTracks().forEach((track) => track.stop());
      return null;
    });
  }, []);

  return { stream, requestMedia, stopMedia };
};

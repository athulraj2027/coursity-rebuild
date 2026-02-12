"use client"
import { useState } from "react";

export const useMediastream = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const requestMedia = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setStream(mediaStream);
    return mediaStream;
  };

  const stopMedia = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  };
  return { stream, requestMedia, stopMedia };
};

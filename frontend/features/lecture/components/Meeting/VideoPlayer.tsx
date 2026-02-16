"use client";
import { useEffect, useRef } from "react";

interface Props {
  stream: MediaStream | null;
}

export const VideoPlayer = ({ stream }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current || !stream) return;
    console.log(videoRef.current);

    videoRef.current.srcObject = stream;
    videoRef.current.play().catch(() => {});
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      playsInline
      muted
      className="w-full h-full object-cover rounded-xl"
    />
  );
};

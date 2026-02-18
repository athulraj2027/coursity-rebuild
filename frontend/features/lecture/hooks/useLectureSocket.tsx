/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { socket } from "@/lib/socket";
import { useEffect } from "react";
import { toast } from "sonner";

export const useLectureSocket = (
  setExistingUsers: React.Dispatch<React.SetStateAction<any[]>>,
) => {
  useEffect(() => {
    const handleNewUser = (params: { userId: string; username: string }) => {
      console.log("new user joined");
      toast.success(`${params.username} joined the lecture`);

      setExistingUsers((prev) => [...prev, params]);
    };

    const handlePeerLeft = ({ username }: { username: string }) => {
      toast.warning(`${username} left the lecture`);

      setExistingUsers((prev) =>
        prev.filter((user: any) => user.username !== username),
      );
    };

    const handleLectureEnded = () => {
      toast.warning("Lecture has ended");

      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    };

    socket.on("new-user-joined", handleNewUser);
    socket.on("peer-left", handlePeerLeft);
    socket.on("lecture-ended", handleLectureEnded);

    return () => {
      socket.off("new-user-joined", handleNewUser);
      socket.off("peer-left", handlePeerLeft);
      socket.off("lecture-ended", handleLectureEnded);
    };
  }, [setExistingUsers]);
};

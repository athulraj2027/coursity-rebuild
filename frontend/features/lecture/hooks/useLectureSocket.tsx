"use client";
import { socket } from "@/lib/socket";
import { useEffect } from "react";
import { toast } from "sonner";

export const useLectureSocket = () => {
  useEffect(() => {
    socket.on("new-user-joined", ({ username }) => {
      toast.success(`${username} joined the lecture`);
    });

    socket.on("peer-left", ({ username }) => {
      toast.warning(`${username} left the lecture`);
    });

    socket.on("lecture-ended", () => {
      toast.warning("Lecture has ended");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    });
    
    return () => {
      socket.off("new-user-joined");
      socket.off("peer-left");
      socket.off("lecture-ended");
    };
  });
};

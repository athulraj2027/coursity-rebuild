import React from "react";
import { Button } from "../../../components/ui/button";
import { socket } from "@/lib/socket";

const StartLectureBtn = ({ onStart }: { onStart: () => void }) => {
  const handleStart = async () => {
    socket.emit("create-room");
    onStart();
  };
  return <Button onClick={handleStart}>Start Lecture</Button>;
};

export default StartLectureBtn;

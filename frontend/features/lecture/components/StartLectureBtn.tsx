import React from "react";
import { Button } from "../../../components/ui/button";
import { socket } from "@/lib/socket";
import { startLecture } from "@/services/lecture.services";
import { toast } from "sonner";

const StartLectureBtn = ({
  onStart,
  lectureId,
}: {
  onStart: () => void;
  lectureId: string;
}) => {
  const handleStart = async () => {
    // update lecture status to started from backend
    const data = await startLecture(lectureId);
    console.log(data);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.emit("create-room", { lectureId }, (response: any) => {
      if (response.success) {
        toast.success("Lecture has been started.");
        return;
      }
    });
    onStart();
  };
  return <Button onClick={handleStart}>Start Lecture</Button>;
};

export default StartLectureBtn;

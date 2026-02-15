import React from "react";
import { Button } from "../../../components/ui/button";
import { socket } from "@/lib/socket";
import { startLecture } from "@/services/lecture.services";
import { toast } from "sonner";
import { useJoinRoom } from "../hooks/useJoinRoom";

const StartLectureBtn = ({
  onStart,
  lectureId,
}: {
  onStart: () => void;
  lectureId: string;
}) => {
  const { createMeetingEssentials } = useJoinRoom();
  const handleStart = async () => {
    // update lecture status to started from backend
    const data = await startLecture(lectureId);
    console.log(data);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.emit("create-room", { lectureId }, async (response: any) => {
      if (response.success) {
        await createMeetingEssentials(response.rtpCapabilities, lectureId);
        toast.success("Lecture has been started.");
        return;
      }
    });
    onStart();
  };
  return <Button onClick={handleStart}>Start Lecture</Button>;
};

export default StartLectureBtn;

import { Button } from "@/components/ui/button";
import { socket } from "@/lib/socket";
import { joinLecture } from "@/services/lecture.services";
import React from "react";
import { toast } from "sonner";
import { useJoinRoom } from "../hooks/useJoinRoom";

const JoinLectureBtn = ({
  onStart,
  lectureId,
}: {
  onStart: () => void;
  lectureId: string;
}) => {
  const { createMeetingEssentials } = useJoinRoom();
  const handleJoin = async () => {
    const data = await joinLecture(lectureId);
    console.log(data);
    //emit join-room event
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.emit("join-room", { lectureId }, async (response: any) => {
      console.log("response : ", response);
      if (response.success) {
        await createMeetingEssentials(response.rtpCapabilities, lectureId);
        toast.success("You have joined the lecture");
        return;
      }
    });
    onStart();
  };
  return <Button onClick={handleJoin}>Join Lecture</Button>;
};

export default JoinLectureBtn;

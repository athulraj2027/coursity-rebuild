import { Button } from "@/components/ui/button";
import { socket } from "@/lib/socket";
import { joinLecture } from "@/services/lecture.services";
import React from "react";
import { toast } from "sonner";

const JoinLectureBtn = ({
  onStart,
  lectureId,
}: {
  onStart: () => void;
  lectureId: string;
}) => {
  const handleJoin = async () => {
    const data = await joinLecture(lectureId);
    console.log(data);
    //emit join-room event
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socket.emit("join-room", { lectureId }, (response: any) => {
      if (response.success) {
        toast.success("You have joined the lecture");
        return;
      }
    });
    onStart();
  };
  return <Button onClick={handleJoin}>Join Lecture</Button>;
};

export default JoinLectureBtn;

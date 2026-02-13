import { Button } from "@/components/ui/button";
import React from "react";

const JoinLectureBtn = ({
  onStart,
  lectureId,
}: {
  onStart: () => void;
  lectureId: string;
}) => {
  const handleJoin = async () => {
    //get data from backend of join class
    //emit join-room event
    onStart();
  };
  return <Button onClick={handleJoin}>Join Lecture</Button>;
};

export default JoinLectureBtn;

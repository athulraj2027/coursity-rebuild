import { Button } from "@/components/ui/button";
import { joinLecture } from "@/services/lecture.services";
import React from "react";

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
    onStart();
  };
  return <Button onClick={handleJoin}>Join Lecture</Button>;
};

export default JoinLectureBtn;

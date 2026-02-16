import React from "react";
import { Button } from "../../../components/ui/button";
import { startLecture } from "@/services/lecture.services";

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

    onStart();
  };
  return <Button onClick={handleStart}>Start Lecture</Button>;
};

export default StartLectureBtn;

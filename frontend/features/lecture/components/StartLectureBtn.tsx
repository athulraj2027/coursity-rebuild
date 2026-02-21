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
  return (
    <Button
      className="bg-black text-white border-black hover:bg-black/80 active:bg-black/90"
      onClick={handleStart}
    >
      Start Lecture
    </Button>
  );
};

export default StartLectureBtn;

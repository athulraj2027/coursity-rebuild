import React from "react";
import { Button } from "../../../components/ui/button";

const StartLectureBtn = ({ onStart }: { onStart: () => void }) => {
  const handleStart = async () => {
    onStart();
  };
  return <Button onClick={handleStart}>Start Lecture</Button>;
};

export default StartLectureBtn;

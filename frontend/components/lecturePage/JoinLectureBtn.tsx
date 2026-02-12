import React from "react";
import { Button } from "../ui/button";

const JoinLectureBtn = ({ onStart }: { onStart: () => void }) => {
  const handleJoin = async () => {
    onStart();
  };
  return <Button onClick={handleJoin}>Join Lecture</Button>;
};

export default JoinLectureBtn;

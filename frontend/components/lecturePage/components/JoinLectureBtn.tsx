import { Button } from "@/components/ui/button";
import React from "react";

const JoinLectureBtn = ({ onStart }: { onStart: () => void }) => {
  const handleJoin = async () => {
    onStart();
  };
  return <Button onClick={handleJoin}>Join Lecture</Button>;
};

export default JoinLectureBtn;

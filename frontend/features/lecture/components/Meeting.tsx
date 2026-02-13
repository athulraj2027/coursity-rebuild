import React from "react";

const Meeting = ({ lectureId }: { lectureId: string }) => {
  return (
    <div>
      <p>{lectureId}</p>
    </div>
  );
};

export default Meeting;

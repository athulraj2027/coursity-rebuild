import React, { useState } from "react";
import { joinLecture } from "@/services/lecture.services";
import { toast } from "sonner";
import { Loader2, Video } from "lucide-react";

const JoinLectureBtn = ({
  onStart,
  lectureId,
}: {
  onStart: () => void;
  lectureId: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleJoin = async () => {
    setIsLoading(true);
    try {
      const data: any = await joinLecture(lectureId);

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      onStart();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleJoin}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 h-10 px-6 rounded-xl bg-black text-white text-sm font-semibold border border-black hover:bg-black/80 active:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Joining…
        </>
      ) : (
        <>
          <Video className="w-4 h-4" strokeWidth={1.8} />
          Join Lecture
        </>
      )}
    </button>
  );
};

export default JoinLectureBtn;

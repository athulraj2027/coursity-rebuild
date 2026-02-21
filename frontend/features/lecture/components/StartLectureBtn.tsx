import React, { useState } from "react";
import { startLecture } from "@/services/lecture.services";
import { toast } from "sonner";
import { Loader2, Radio } from "lucide-react";

const StartLectureBtn = ({
  onStart,
  lectureId,
}: {
  onStart: () => void;
  lectureId: string;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    setIsLoading(true);
    try {
      const data: any = await startLecture(lectureId);
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
      onClick={handleStart}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2 h-10 px-6 rounded-xl bg-black text-white text-sm font-semibold border border-black hover:bg-black/80 active:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Starting…
        </>
      ) : (
        <>
          <Radio className="w-4 h-4" strokeWidth={1.8} />
          Start Lecture
        </>
      )}
    </button>
  );
};

export default StartLectureBtn;

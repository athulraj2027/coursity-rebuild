"use client";
import Loading from "../../common/Loading";
import NoAccess from "./NoAccess";
import StartLectureBtn from "./StartLectureBtn";
import JoinLectureBtn from "./JoinLectureBtn";
import Meeting from "./Meeting";
import { useMediastream } from "../hooks/useMediastream";
import { useLectureAccess } from "../hooks/useLectureAccess";

const LecturePageComponent = ({ lectureId }: { lectureId: string }) => {
  const { requestMedia } = useMediastream();
  const { isLoading, mode, setMode, role, error } = useLectureAccess(lectureId);

  const handleEnter = async () => {
    requestMedia();
    setMode("MEETING");
  };

  if (isLoading) return <Loading />;
  if (error) return <NoAccess error={error} />;
  if (mode === "MEETING") return <Meeting />;
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 to-gray-800 px-4">
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-10 w-full max-w-md text-center">
        <h1 className="text-2xl font-semibold text-white mb-3">
          {role === "TEACHER" ? "Start Your Lecture" : "Join Lecture"}
        </h1>

        <p className="text-gray-300 text-sm mb-8">
          {role === "TEACHER"
            ? "You are about to begin the live session."
            : "You are about to enter the live lecture."}
        </p>

        <div className="flex justify-center">
          {role === "TEACHER" ? (
            <StartLectureBtn onStart={handleEnter} />
          ) : (
            <JoinLectureBtn onStart={handleEnter} />
          )}
        </div>
      </div>
    </div>
  );
};

export default LecturePageComponent;

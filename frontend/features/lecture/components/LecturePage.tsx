"use client";
import Loading from "../../../components/common/Loading";
import NoAccess from "./NoAccess";
import StartLectureBtn from "./StartLectureBtn";
import JoinLectureBtn from "./JoinLectureBtn";
import Meeting from "./Meeting";
import { useMediastream } from "../hooks/useMediastream";
import { useLectureAccess } from "../hooks/useLectureAccess";
import { useSocketStatus } from "../hooks/useSocketStatus";

const LecturePageComponent = ({ lectureId }: { lectureId: string }) => {
  const { requestMedia } = useMediastream();
  const { isLoading, mode, setMode, role, error, lectureStatus } =
    useLectureAccess(lectureId);
  const { isConnected, transport } = useSocketStatus();
  const handleEnter = async () => {
    const media = await requestMedia();
    if (!media) return;
    setMode("MEETING");
  };

  if (error) return <NoAccess error={error} />;
  if (isLoading || !role) return <Loading />;

  if (mode === "MEETING" || (lectureStatus === "STARTED" && role === "TEACHER"))
    return <Meeting lectureId={lectureId} />;

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
            <StartLectureBtn onStart={handleEnter} lectureId={lectureId} />
          ) : (
            <JoinLectureBtn onStart={handleEnter} lectureId={lectureId} />
          )}
        </div>
        <div>
          <p className="text-white">
            {isConnected ? "Connected" : "Not connected"}
          </p>
          <p className="text-white">
            {transport ? "Transport created " : "No transport"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LecturePageComponent;

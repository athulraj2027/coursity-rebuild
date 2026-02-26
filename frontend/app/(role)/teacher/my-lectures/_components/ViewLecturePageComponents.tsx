"use client";
import Error from "@/components/common/Error";
import Loading from "@/components/common/Loading";
import { useMyLectureQueryById } from "@/queries/lectures.queries";
import React from "react";
import {
  Video,
  BookOpen,
  Users,
  Clock,
  Calendar,
  CheckCircle,
  Radio,
  Timer,
  Eye,
  UserCheck,
  Mail,
  TrendingUp,
  MoveLeftIcon,
} from "lucide-react";

/* ─── Types ───────────────────────────────────────────────────────────────── */
type LectureStatus = "NOT_STARTED" | "STARTED" | "COMPLETED";
type AttendanceStatus = "PRESENT" | "LATE" | "ABSENT";
type Role = "TEACHER" | "STUDENT" | "ADMIN";

interface Student {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  lectureId: string;
  durationSec: number;
  status: AttendanceStatus;
  student: Student;
}

interface Participant {
  id: string;
  userId: string;
  role: Role;
  joinTime: string;
  leaveTime: string | null;
  user: { id: string; name: string; email: string };
}

interface LectureData {
  id: string;
  title: string;
  startTime: string;
  status: LectureStatus;
  meetingId: string | null;
  isDeleted: boolean;
  courseId: string;
  createdAt: string;
  course: {
    id: string;
    title: string;
    price: number;
    startDate: string;
    _count: { enrollments: number; lectures: number };
  };
  attendance: AttendanceRecord[];
  participants: Participant[];
  _count: { attendance: number; participants: number };
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const fmtDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const fmtDuration = (sec: number) => {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
};

const initials = (name: string) =>
  name
    .trim()
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/* ─── Status config ───────────────────────────────────────────────────────── */
const statusConfig: Record<
  LectureStatus,
  { label: string; icon: React.ElementType; pill: string; glow: string }
> = {
  NOT_STARTED: {
    label: "Not Started",
    icon: Clock,
    pill: "bg-neutral-100 text-neutral-500 border-neutral-200",
    glow: "",
  },
  STARTED: {
    label: "Live Now",
    icon: Radio,
    pill: "bg-black text-white border-black",
    glow: "shadow-md shadow-black/20",
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle,
    pill: "bg-violet-600 text-white border-violet-600",
    glow: "shadow-md shadow-violet-200",
  },
};

const attendanceConfig: Record<
  AttendanceStatus,
  { label: string; style: string }
> = {
  PRESENT: {
    label: "Present",
    style: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  LATE: {
    label: "Late",
    style: "bg-amber-100 text-amber-700 border-amber-200",
  },
  ABSENT: {
    label: "Absent",
    style: "bg-rose-100 text-rose-700 border-rose-200",
  },
};

/* ─── Section header ──────────────────────────────────────────────────────── */
const SectionHeader = ({
  icon: Icon,
  title,
  count,
  accent = "violet",
}: {
  icon: React.ElementType;
  title: string;
  count?: number;
  accent?: string;
}) => (
  <div className="flex items-center gap-2 px-5 py-4 border-b border-black/5">
    <Icon className={`w-4 h-4 text-${accent}-500`} strokeWidth={1.8} />
    <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-widest">
      {title}
    </h3>
    {count !== undefined && (
      <span
        className={`text-[10px] font-bold text-${accent}-700 bg-${accent}-100 border border-${accent}-200 px-2 py-0.5 rounded-full`}
      >
        {count}
      </span>
    )}
  </div>
);

/* ─── Empty state ─────────────────────────────────────────────────────────── */
const EmptyState = ({
  icon: Icon,
  message,
}: {
  icon: React.ElementType;
  message: string;
}) => (
  <div className="flex flex-col items-center justify-center py-10 gap-2">
    <Icon className="w-8 h-8 text-neutral-200" strokeWidth={1.5} />
    <p className="text-sm text-neutral-400 font-medium">{message}</p>
  </div>
);

/* ─── Main Component ──────────────────────────────────────────────────────── */
const ViewLecturePageComponents = ({ id }: { id: string }) => {
  const { data, error, isLoading } = useMyLectureQueryById(id);

  if (isLoading) return <Loading />;
  if (error || !data) return <Error />;

  const lecture = data as LectureData;
  const { course } = lecture;
  const cfg = statusConfig[lecture.status];
  const StatusIcon = cfg.icon;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        {/* ── Page header ── */}
        <button
          onClick={() => window.history.back()}
          className="
    inline-flex items-center gap-2
    px-4 py-2
    rounded-xl
    text-sm font-semibold
    text-red-600
    bg-red-50
    hover:bg-red-100
    active:scale-95
    transition-all duration-200 mb-6
    focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
  "
        >
          <MoveLeftIcon size={18} />
          Go Back
        </button>
        <div>
          <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-2">
            Teacher Portal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-violet-600">
            Lecture Detail
          </h1>
          <p className="text-sm text-neutral-400 font-medium mt-1">
            Attendance, participants, and session overview
          </p>
        </div>

        {/* ── Hero card ── */}
        <div className="bg-white border border-black/8 rounded-2xl shadow-sm overflow-hidden">
          <div className="h-0.5 bg-violet-600 w-full" />
          <div className="p-6 space-y-5">
            {/* Title + status */}
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-1">
                  Lecture
                </p>
                <h2 className="text-xl font-bold text-black leading-snug">
                  {lecture.title}
                </h2>
              </div>
              <span
                className={`text-[10px] font-bold tracking-wider uppercase px-3 py-1.5 rounded-full border flex items-center gap-1.5 shrink-0 ${cfg.pill} ${cfg.glow}`}
              >
                <StatusIcon className="w-3 h-3" strokeWidth={2} />
                {cfg.label}
              </span>
            </div>

            <div className="h-px bg-black/5" />

            {/* Meta grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="flex items-center gap-2">
                <BookOpen
                  className="w-4 h-4 text-violet-500 shrink-0"
                  strokeWidth={1.8}
                />
                <div className="min-w-0">
                  <p className="text-[10px] text-neutral-400 font-medium">
                    Course
                  </p>
                  <p className="text-xs font-semibold text-black truncate">
                    {course.title}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar
                  className="w-4 h-4 text-sky-500 shrink-0"
                  strokeWidth={1.8}
                />
                <div>
                  <p className="text-[10px] text-neutral-400 font-medium">
                    Start Time
                  </p>
                  <p className="text-xs font-semibold text-black">
                    {fmtDateTime(lecture.startTime)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users
                  className="w-4 h-4 text-emerald-500 shrink-0"
                  strokeWidth={1.8}
                />
                <div>
                  <p className="text-[10px] text-neutral-400 font-medium">
                    Enrolled
                  </p>
                  <p className="text-xs font-semibold text-black">
                    {course._count.enrollments} students
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Video
                  className="w-4 h-4 text-amber-500 shrink-0"
                  strokeWidth={1.8}
                />
                <div>
                  <p className="text-[10px] text-neutral-400 font-medium">
                    Lectures in course
                  </p>
                  <p className="text-xs font-semibold text-black">
                    {course._count.lectures} total
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="relative bg-violet-600 rounded-2xl p-5 overflow-hidden shadow-md shadow-violet-200">
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/10" />
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 mb-1">
                <UserCheck
                  className="w-3.5 h-3.5 text-violet-200"
                  strokeWidth={1.8}
                />
                <p className="text-[10px] font-bold text-violet-200 uppercase tracking-widest">
                  Attendance
                </p>
              </div>
              <p className="text-3xl font-bold text-white">
                {lecture._count.attendance}
              </p>
            </div>
          </div>

          <div className="bg-white border border-sky-200 rounded-2xl px-5 py-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-2">
              <Eye className="w-3.5 h-3.5 text-sky-500" strokeWidth={1.8} />
              <p className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">
                Participants
              </p>
            </div>
            <p className="text-2xl font-bold text-sky-600">
              {lecture._count.participants}
            </p>
          </div>

          <div className="bg-white border border-emerald-200 rounded-2xl px-5 py-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp
                className="w-3.5 h-3.5 text-emerald-500"
                strokeWidth={1.8}
              />
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                Present
              </p>
            </div>
            <p className="text-2xl font-bold text-emerald-600">
              {lecture.attendance.filter((a) => a.status === "PRESENT").length}
            </p>
          </div>

          <div className="bg-white border border-amber-200 rounded-2xl px-5 py-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="w-3.5 h-3.5 text-amber-500" strokeWidth={1.8} />
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                Late
              </p>
            </div>
            <p className="text-2xl font-bold text-amber-600">
              {lecture.attendance.filter((a) => a.status === "LATE").length}
            </p>
          </div>
        </div>

        {/* ── Attendance ── */}
        <div className="bg-white border border-black/8 rounded-2xl overflow-hidden shadow-sm">
          <SectionHeader
            icon={UserCheck}
            title="Attendance"
            count={lecture.attendance.length}
            accent="violet"
          />

          {lecture.attendance.length === 0 ? (
            <EmptyState icon={UserCheck} message="No attendance records yet" />
          ) : (
            <div className="divide-y divide-black/5">
              {lecture.attendance.map((record, i) => {
                const aCfg = attendanceConfig[record.status];
                return (
                  <div
                    key={record.id}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-neutral-50/70 transition-colors"
                  >
                    <span className="text-xs text-neutral-300 font-semibold w-5 shrink-0 text-right">
                      {i + 1}
                    </span>

                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-white">
                        {initials(record.student.name)}
                      </span>
                    </div>

                    {/* Name + email */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-black truncate">
                        {record.student.name}
                      </p>
                      <p className="text-[11px] text-neutral-400 truncate flex items-center gap-1">
                        <Mail className="w-3 h-3 shrink-0" strokeWidth={1.8} />
                        {record.student.email}
                      </p>
                    </div>

                    {/* Duration */}
                    <div className="hidden sm:flex items-center gap-1 shrink-0">
                      <Timer
                        className="w-3.5 h-3.5 text-neutral-400"
                        strokeWidth={1.8}
                      />
                      <span className="text-xs font-semibold text-neutral-600">
                        {fmtDuration(record.durationSec)}
                      </span>
                    </div>

                    {/* Status badge */}
                    <span
                      className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border shrink-0 ${aCfg.style}`}
                    >
                      {aCfg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Participants ── */}
        <div className="bg-white border border-black/8 rounded-2xl overflow-hidden shadow-sm">
          <SectionHeader
            icon={Eye}
            title="Live Participants"
            count={lecture.participants.length}
            accent="sky"
          />

          {lecture.participants.length === 0 ? (
            <EmptyState icon={Users} message="No participants joined yet" />
          ) : (
            <div className="divide-y divide-black/5">
              {lecture.participants.map((p, i) => {
                const isTeacher = p.role === "TEACHER";
                const duration = p.leaveTime
                  ? fmtDuration(
                      Math.floor(
                        (new Date(p.leaveTime).getTime() -
                          new Date(p.joinTime).getTime()) /
                          1000,
                      ),
                    )
                  : "Active";
                return (
                  <div
                    key={p.id}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-neutral-50/70 transition-colors"
                  >
                    <span className="text-xs text-neutral-300 font-semibold w-5 shrink-0 text-right">
                      {i + 1}
                    </span>

                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${isTeacher ? "bg-amber-500" : "bg-sky-500"}`}
                    >
                      <span className="text-xs font-bold text-white">
                        {initials(p.user.name)}
                      </span>
                    </div>

                    {/* Name + email */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold text-black truncate">
                          {p.user.name}
                        </p>
                        {isTeacher && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200 shrink-0">
                            Host
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {p.user.email}
                      </p>
                    </div>

                    {/* Join time */}
                    <div className="hidden sm:block text-right shrink-0">
                      <p className="text-[11px] text-neutral-500 font-medium">
                        Joined {fmtDateTime(p.joinTime)}
                      </p>
                      {p.leaveTime && (
                        <p className="text-[10px] text-neutral-400">
                          Left {fmtDateTime(p.leaveTime)}
                        </p>
                      )}
                    </div>

                    {/* Duration */}
                    <div
                      className={`flex items-center gap-1 shrink-0 px-2.5 py-1 rounded-full border text-[10px] font-bold tracking-wider uppercase ${
                        !p.leaveTime
                          ? "bg-black text-white border-black"
                          : "bg-neutral-100 text-neutral-500 border-neutral-200"
                      }`}
                    >
                      <Timer className="w-3 h-3" strokeWidth={2} />
                      {duration}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewLecturePageComponents;

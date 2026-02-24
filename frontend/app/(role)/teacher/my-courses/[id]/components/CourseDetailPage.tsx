"use client";
import React from "react";
import { useMyCourseQueryById } from "@/queries/courses.queries";
import Loading from "@/components/common/Loading";
import Error from "@/components/common/Error";
import {
  BookOpen,
  Users,
  IndianRupee,
  Video,
  Calendar,
  CheckCircle,
  Clock,
  Radio,
  BarChart2,
  Eye,
  MoveLeftIcon,
} from "lucide-react";

/* ─── Types ───────────────────────────────────────────────────────────────── */
type LectureStatus = "NOT_STARTED" | "STARTED" | "COMPLETED";

interface Lecture {
  id: string;
  title: string;
  startTime: string;
  status: LectureStatus;
  attendanceCount: number;
  liveParticipantsCount: number;
}

interface Course {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  startDate: string;
  isEnrollmentOpen: boolean;
  isDisabled: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  formattedPrice: string;
  _count: { lectures: number; enrollments: number; payments: number };
}

interface CourseData {
  course: Course;
  stats: {
    totalLectures: number;
    totalStudents: number;
    totalPayments: number;
    revenue: number;
    formattedRevenue: string;
    paymentBreakdown: { amount: number; count: number }[];
  };
  lectureSummary: Lecture[];
  enrollmentPreview: {
    totalStudents: number;
    recentStudents: {
      id: string;
      name: string;
      email: string;
      enrolledAt: string;
    }[];
  };
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

/* ─── Status config ───────────────────────────────────────────────────────── */
const statusConfig: Record<
  LectureStatus,
  { label: string; icon: React.ElementType; style: string }
> = {
  NOT_STARTED: {
    label: "Not Started",
    icon: Clock,
    style: "bg-neutral-100 text-neutral-500 border-neutral-200",
  },
  STARTED: {
    label: "Live",
    icon: Radio,
    style: "bg-black text-white border-black",
  },
  COMPLETED: {
    label: "Completed",
    icon: CheckCircle,
    style: "bg-violet-600 text-white border-none",
  },
};

/* ─── Stat Card ───────────────────────────────────────────────────────────── */
const StatCard = ({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent: string;
}) => (
  <div
    className={`bg-white border rounded-2xl px-5 py-4 shadow-sm border-${accent}-200`}
  >
    <div className="flex items-center gap-1.5 mb-2">
      <Icon className={`w-3.5 h-3.5 text-${accent}-500`} strokeWidth={1.8} />
      <p
        className={`text-[10px] font-bold text-${accent}-600 uppercase tracking-wider`}
      >
        {label}
      </p>
    </div>
    <p className={`text-2xl font-bold text-${accent}-600`}>{value}</p>
  </div>
);

/* ─── Main Component ──────────────────────────────────────────────────────── */
const CourseDetailPageComponent = ({ id }: { id: string }) => {
  const { isLoading, error, data } = useMyCourseQueryById(id);

  if (isLoading) return <Loading />;
  if (error || !data) return <Error />;

  const { course, stats, lectureSummary, enrollmentPreview } =
    data as CourseData;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
        {/* ── Header ── */}
        <div>
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
          <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-2">
            Teacher Portal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-violet-600">
            Course Details
          </h1>
          <p className="text-sm text-neutral-400 font-medium mt-1">
            Full overview of your course performance
          </p>
        </div>

        {/* ── Course hero card ── */}
        <div className="bg-white border border-black/8 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex flex-col sm:flex-row">
            {/* Thumbnail */}
            <div className="sm:w-56 sm:shrink-0 h-44 sm:h-auto bg-neutral-100 relative overflow-hidden">
              {course.imageUrl ? (
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen
                    className="w-10 h-10 text-neutral-300"
                    strokeWidth={1.5}
                  />
                </div>
              )}
              {/* Enrollment badge */}
              <span
                className={`absolute top-2.5 right-2.5 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${
                  course.isEnrollmentOpen
                    ? "bg-black text-white border-black"
                    : "bg-white text-neutral-500 border-black/20"
                }`}
              >
                {course.isEnrollmentOpen ? "Enrolling" : "Closed"}
              </span>
            </div>

            {/* Info */}
            <div className="p-5 flex flex-col justify-between gap-3 flex-1 min-w-0">
              <div>
                <h2 className="text-lg font-bold text-black leading-snug">
                  {course.title}
                </h2>
                <p className="text-sm text-neutral-400 mt-1 line-clamp-2">
                  {course.description}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <div className="flex items-center gap-1.5">
                  <IndianRupee
                    className="w-3.5 h-3.5 text-emerald-500 shrink-0"
                    strokeWidth={1.8}
                  />
                  <span className="text-xs font-semibold text-neutral-700">
                    {course.formattedPrice}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar
                    className="w-3.5 h-3.5 text-violet-500 shrink-0"
                    strokeWidth={1.8}
                  />
                  <span className="text-xs font-semibold text-neutral-700">
                    {fmtDate(course.startDate)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Video
                    className="w-3.5 h-3.5 text-sky-500 shrink-0"
                    strokeWidth={1.8}
                  />
                  <span className="text-xs font-semibold text-neutral-700">
                    {course._count.lectures} lectures
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users
                    className="w-3.5 h-3.5 text-amber-500 shrink-0"
                    strokeWidth={1.8}
                  />
                  <span className="text-xs font-semibold text-neutral-700">
                    {course._count.enrollments} enrolled
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock
                    className="w-3.5 h-3.5 text-neutral-400 shrink-0"
                    strokeWidth={1.8}
                  />
                  <span className="text-xs text-neutral-400">
                    Added {fmtDate(course.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="relative bg-violet-600 rounded-2xl p-5 overflow-hidden shadow-md shadow-violet-200">
            <div className="absolute -top-5 -right-5 w-20 h-20 rounded-full bg-white/10" />
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 mb-1">
                <Video
                  className="w-3.5 h-3.5 text-violet-200"
                  strokeWidth={1.8}
                />
                <p className="text-[10px] font-bold text-violet-200 uppercase tracking-widest">
                  Lectures
                </p>
              </div>
              <p className="text-3xl font-bold text-white">
                {stats.totalLectures}
              </p>
            </div>
          </div>

          <div className="bg-white border border-emerald-200 rounded-2xl px-5 py-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-2">
              <IndianRupee
                className="w-3.5 h-3.5 text-emerald-500"
                strokeWidth={1.8}
              />
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                Revenue
              </p>
            </div>
            <p className="text-2xl font-bold text-emerald-600">
              {stats.formattedRevenue}
            </p>
          </div>

          <div className="bg-white border border-sky-200 rounded-2xl px-5 py-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-2">
              <Users className="w-3.5 h-3.5 text-sky-500" strokeWidth={1.8} />
              <p className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">
                Students
              </p>
            </div>
            <p className="text-2xl font-bold text-sky-600">
              {stats.totalStudents}
            </p>
          </div>

          <div className="bg-white border border-amber-200 rounded-2xl px-5 py-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-2">
              <BarChart2
                className="w-3.5 h-3.5 text-amber-500"
                strokeWidth={1.8}
              />
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                Payments
              </p>
            </div>
            <p className="text-2xl font-bold text-amber-600">
              {stats.totalPayments}
            </p>
          </div>
        </div>

        {/* ── Lectures ── */}
        <div className="bg-white border border-black/8 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-black/5">
            <Video className="w-4 h-4 text-violet-600" strokeWidth={1.8} />
            <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-widest">
              Lectures
            </h3>
            <span className="text-[10px] font-bold text-violet-700 bg-violet-100 border border-violet-200 px-2 py-0.5 rounded-full">
              {lectureSummary.length}
            </span>
          </div>

          {lectureSummary.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <Video className="w-8 h-8 text-neutral-200" strokeWidth={1.5} />
              <p className="text-sm text-neutral-400 font-medium">
                No lectures yet
              </p>
            </div>
          ) : (
            <div className="divide-y divide-black/5">
              {lectureSummary.map((lecture, i) => {
                const cfg = statusConfig[lecture.status];
                const Icon = cfg.icon;
                return (
                  <div
                    key={lecture.id}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-neutral-50/80 transition-colors"
                  >
                    {/* Index */}
                    <span className="text-xs text-neutral-300 font-semibold w-5 shrink-0 text-right">
                      {i + 1}
                    </span>

                    {/* Title + date */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-black line-clamp-1">
                        {lecture.title}
                      </p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        {fmtDateTime(lecture.startTime)}
                      </p>
                    </div>

                    {/* Status */}
                    <span
                      className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border flex items-center gap-1 shrink-0 ${cfg.style}`}
                    >
                      <Icon className="w-3 h-3" strokeWidth={2} />
                      {cfg.label}
                    </span>

                    {/* Counts */}
                    <div className="hidden sm:flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1">
                        <Users
                          className="w-3.5 h-3.5 text-neutral-400"
                          strokeWidth={1.8}
                        />
                        <span className="text-xs font-semibold text-neutral-600">
                          {lecture.attendanceCount}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          attended
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye
                          className="w-3.5 h-3.5 text-neutral-400"
                          strokeWidth={1.8}
                        />
                        <span className="text-xs font-semibold text-neutral-600">
                          {lecture.liveParticipantsCount}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          live
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Enrolled students ── */}
        <div className="bg-white border border-black/8 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-black/5">
            <Users className="w-4 h-4 text-sky-500" strokeWidth={1.8} />
            <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-widest">
              Enrolled Students
            </h3>
            <span className="text-[10px] font-bold text-sky-700 bg-sky-100 border border-sky-200 px-2 py-0.5 rounded-full">
              {enrollmentPreview.totalStudents}
            </span>
          </div>

          {enrollmentPreview.recentStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-2">
              <Users className="w-8 h-8 text-neutral-200" strokeWidth={1.5} />
              <p className="text-sm text-neutral-400 font-medium">
                No students enrolled yet
              </p>
            </div>
          ) : (
            <div className="divide-y divide-black/5">
              {enrollmentPreview.recentStudents.map((student, i) => {
                const initials = student.name
                  .trim()
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                return (
                  <div
                    key={student.id}
                    className="flex items-center gap-4 px-5 py-3.5 hover:bg-neutral-50/80 transition-colors"
                  >
                    <span className="text-xs text-neutral-300 font-semibold w-5 shrink-0 text-right">
                      {i + 1}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-sky-500 flex items-center justify-center shrink-0">
                      <span className="text-xs font-bold text-white">
                        {initials}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-black truncate">
                        {student.name}
                      </p>
                      <p className="text-[11px] text-neutral-400 truncate">
                        {student.email}
                      </p>
                    </div>
                    <p className="text-[11px] text-neutral-400 font-medium shrink-0">
                      {fmtDate(student.enrolledAt)}
                    </p>
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

export default CourseDetailPageComponent;

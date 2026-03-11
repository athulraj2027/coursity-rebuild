"use client";

import Error from "@/components/common/Error";
import Loading from "@/components/common/Loading";
import { useEnrolledCourseQuery } from "@/queries/courses.queries";
import React, { useMemo } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  XCircle,
  User,
  Video,
  TrendingUp,
  Timer,
} from "lucide-react";

/* ─── Types ───────────────────────────────────────────────────────────────── */
interface AttendanceEntry {
  status: "PRESENT" | "LATE" | "ABSENT";
  durationSec: number;
}

interface Lecture {
  id: string;
  title: string;
  startTime: string;
  status: "NOT_STARTED" | "STARTED" | "COMPLETED";
  attendance: AttendanceEntry[];
}

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  startDate: string;
  teacher: { id: string; name: string };
  _count: { lectures: number };
  lectures: Lecture[];
}

interface ApiResponse {
  success: boolean;
  course: {
    id: string;
    course: CourseDetail;
  };
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const fmtTime = (iso: string) =>
  new Date(iso).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const fmtDuration = (sec: number) => {
  if (sec === 0) return null;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return m > 0 ? (s > 0 ? `${m}m ${s}s` : `${m}m`) : `${s}s`;
};

const STATUS_CFG = {
  PRESENT: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
    label: "Present",
  },
  LATE: {
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    dot: "bg-amber-500",
    icon: Clock,
    label: "Late",
  },
  ABSENT: {
    bg: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-600",
    dot: "bg-rose-400",
    icon: XCircle,
    label: "Absent",
  },
} as const;

const LECTURE_STATUS_CFG = {
  NOT_STARTED: {
    label: "Upcoming",
    bg: "bg-neutral-100",
    text: "text-neutral-500",
  },
  STARTED: { label: "Live", bg: "bg-black", text: "text-white" },
  COMPLETED: {
    label: "Completed",
    bg: "bg-violet-100",
    text: "text-violet-700",
  },
} as const;

/* ─── Page ────────────────────────────────────────────────────────────────── */
const PageComponent = ({ id }: { id: string }) => {
  const { data, error, isLoading } = useEnrolledCourseQuery(id);

  const course: CourseDetail | undefined = (data as ApiResponse | undefined)
    ?.course?.course;

  const stats = useMemo(() => {
    if (!course)
      return { present: 0, late: 0, absent: 0, total: 0, rate: 0, totalSec: 0 };
    let present = 0,
      late = 0,
      absent = 0,
      totalSec = 0;
    for (const lec of course.lectures) {
      const a = lec.attendance[0];
      if (!a) continue;
      if (a.status === "PRESENT") present++;
      else if (a.status === "LATE") late++;
      else absent++;
      totalSec += a.durationSec;
    }
    const total = present + late + absent;
    return {
      present,
      late,
      absent,
      total,
      totalSec,
      rate: total > 0 ? Math.round(((present + late) / total) * 100) : 0,
    };
  }, [course]);

  if (isLoading) return <Loading />;
  if (error) return <Error />;
  if (!course) return <Error />;

  const rateColor =
    stats.rate >= 75
      ? "text-emerald-600"
      : stats.rate >= 50
        ? "text-amber-600"
        : "text-rose-600";
  const barColor =
    stats.rate >= 75
      ? "bg-emerald-500"
      : stats.rate >= 50
        ? "bg-amber-500"
        : "bg-rose-500";

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* ── Header ── */}
        <div className="mb-8">
          <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-2">
            Enrolled Course
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-violet-600 mb-1">
            {course.title}
          </h1>
          <p className="text-sm text-neutral-400 font-medium">
            {course.description}
          </p>
        </div>

        {/* ── Course banner + meta ── */}
        <div className="bg-white border border-black/8 rounded-2xl overflow-hidden shadow-sm mb-6">
          <div className="relative h-48 sm:h-56 w-full overflow-hidden">
            <img
              src={course.imageUrl}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center">
                <span className="text-[10px] font-bold text-white">
                  {course.teacher.name
                    .trim()
                    .split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </span>
              </div>
              <span className="text-xs font-semibold text-white">
                {course.teacher.name.trim()}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 px-5 py-4">
            <div className="flex items-center gap-2">
              <User
                className="w-3.5 h-3.5 text-neutral-400"
                strokeWidth={1.8}
              />
              <span className="text-xs font-medium text-neutral-500">
                {course.teacher.name.trim()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays
                className="w-3.5 h-3.5 text-neutral-400"
                strokeWidth={1.8}
              />
              <span className="text-xs font-medium text-neutral-500">
                Started {fmtDate(course.startDate)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Video
                className="w-3.5 h-3.5 text-neutral-400"
                strokeWidth={1.8}
              />
              <span className="text-xs font-medium text-neutral-500">
                {course._count.lectures} lectures
              </span>
            </div>
          </div>
        </div>

        {/* ── Attendance summary cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {/* Attendance rate */}
          <div className="relative bg-violet-600 rounded-2xl p-5 overflow-hidden shadow-md shadow-violet-200">
            <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/10" />
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp
                  className="w-3.5 h-3.5 text-violet-200"
                  strokeWidth={1.8}
                />
                <p className="text-[10px] font-bold text-violet-200 uppercase tracking-widest">
                  Rate
                </p>
              </div>
              <p className="text-3xl font-bold text-white">{stats.rate}%</p>
            </div>
          </div>

          <div className="bg-white border border-emerald-200 rounded-2xl px-4 py-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-2">
              <CheckCircle2
                className="w-3.5 h-3.5 text-emerald-500"
                strokeWidth={1.8}
              />
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                Present
              </p>
            </div>
            <p className="text-2xl font-bold text-emerald-600">
              {stats.present}
            </p>
          </div>

          <div className="bg-white border border-amber-200 rounded-2xl px-4 py-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-2">
              <Clock className="w-3.5 h-3.5 text-amber-500" strokeWidth={1.8} />
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                Late
              </p>
            </div>
            <p className="text-2xl font-bold text-amber-600">{stats.late}</p>
          </div>

          <div className="bg-white border border-rose-200 rounded-2xl px-4 py-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-2">
              <XCircle
                className="w-3.5 h-3.5 text-rose-500"
                strokeWidth={1.8}
              />
              <p className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">
                Absent
              </p>
            </div>
            <p className="text-2xl font-bold text-rose-600">{stats.absent}</p>
          </div>
        </div>

        {/* ── Attendance progress bar ── */}
        <div className="bg-white border border-black/8 rounded-2xl px-5 py-4 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">
              Attendance Progress
            </p>
            <span className={`text-sm font-bold ${rateColor}`}>
              {stats.rate}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-neutral-100 overflow-hidden">
            <div
              className={`h-full rounded-full ${barColor} transition-all duration-500`}
              style={{ width: `${stats.rate}%` }}
            />
          </div>
          <div className="flex items-center gap-4 mt-3">
            {[
              { label: `${stats.present} Present`, color: "bg-emerald-500" },
              { label: `${stats.late} Late`, color: "bg-amber-500" },
              { label: `${stats.absent} Absent`, color: "bg-rose-400" },
            ].map(({ label, color }) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${color}`} />
                <span className="text-[10px] text-neutral-500 font-medium">
                  {label}
                </span>
              </div>
            ))}
            {stats.totalSec > 0 && (
              <div className="flex items-center gap-1.5 ml-auto">
                <Timer className="w-3 h-3 text-neutral-400" strokeWidth={1.8} />
                <span className="text-[10px] text-neutral-400 font-medium">
                  {fmtDuration(stats.totalSec)} total time
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── Lectures list ── */}
        <div className="mb-4">
          <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-3">
            Lectures
          </p>
          <div className="flex flex-col gap-3">
            {course.lectures.map((lec, idx) => {
              const attendance = lec.attendance[0];
              const attCfg = attendance ? STATUS_CFG[attendance.status] : null;
              const lecCfg = LECTURE_STATUS_CFG[lec.status];
              const AttIcon = attCfg?.icon;

              return (
                <div
                  key={lec.id}
                  className="bg-white border border-black/8 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4"
                >
                  {/* Index */}
                  <div className="w-8 h-8 rounded-xl bg-violet-50 border border-violet-100 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-violet-500">
                      L{idx + 1}
                    </span>
                  </div>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-neutral-800 truncate">
                        {lec.title}
                      </p>
                      <span
                        className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${lecCfg.bg} ${lecCfg.text}`}
                      >
                        {lecCfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[11px] text-neutral-400">
                        {fmtDate(lec.startTime)} · {fmtTime(lec.startTime)}
                      </span>
                    </div>
                  </div>

                  {/* Attendance badge */}
                  {attCfg && AttIcon ? (
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${attCfg.bg} ${attCfg.border} shrink-0`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${attCfg.dot}`}
                      />
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider ${attCfg.text}`}
                      >
                        {attCfg.label}
                      </span>
                      {attendance.durationSec > 0 && (
                        <span
                          className={`text-[9px] font-medium ${attCfg.text} opacity-70`}
                        >
                          · {fmtDuration(attendance.durationSec)}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-[10px] text-neutral-300 font-medium shrink-0">
                      —
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageComponent;

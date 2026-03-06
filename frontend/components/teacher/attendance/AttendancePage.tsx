"use client";

import Error from "@/components/common/Error";
import Loading from "@/components/common/Loading";
import { useMyAttendanceQuery } from "@/queries/attendance.queries";
import React, { useMemo, useState } from "react";
import {
  Users,
  BookOpen,
  CheckCircle2,
  Clock,
  XCircle,
  TrendingUp,
  Filter,
  Download,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { downloadAttendanceApi } from "@/services/attendance.services";

/* ─── Types ───────────────────────────────────────────────────────────────── */
interface LectureInfo {
  id: string;
  title: string;
  startTime: string;
}

interface StudentLecture {
  lectureId: string;
  lectureTitle: string;
  startTime: string;
  durationSec: number;
  status: "PRESENT" | "LATE" | "ABSENT";
}

interface StudentEntry {
  studentId: string;
  name: string;
  email: string;
  lectures: StudentLecture[];
}

interface AttendanceData {
  course: string;
  lectures: LectureInfo[];
  students: StudentEntry[];
}

interface AttendanceResponse {
  success: boolean;
  attendanceData: AttendanceData;
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const fmtDuration = (sec: number) => {
  if (sec === 0) return "—";
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
};

const fmtDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};

const fmtTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const STATUS_CONFIG = {
  PRESENT: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
    label: "Present",
  },
  LATE: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    dot: "bg-amber-500",
    icon: Clock,
    label: "Late",
  },
  ABSENT: {
    bg: "bg-rose-50",
    text: "text-rose-600",
    border: "border-rose-200",
    dot: "bg-rose-400",
    icon: XCircle,
    label: "Absent",
  },
} as const;

/* ─── Status Cell ─────────────────────────────────────────────────────────── */
const StatusCell = ({ entry }: { entry: StudentLecture }) => {
  const cfg = STATUS_CONFIG[entry.status];
  return (
    <div
      className={`flex flex-col items-center justify-center gap-1 px-2 py-2 rounded-lg ${cfg.bg} border ${cfg.border} min-w-20`}
    >
      <div className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      <span
        className={`text-[10px] font-bold uppercase tracking-wider ${cfg.text}`}
      >
        {cfg.label}
      </span>
      {entry.durationSec > 0 && (
        <span className={`text-[9px] font-medium ${cfg.text} opacity-70`}>
          {fmtDuration(entry.durationSec)}
        </span>
      )}
    </div>
  );
};

/* ─── Summary Badge ───────────────────────────────────────────────────────── */
const SummaryPill = ({
  present,
  late,
  absent,
  total,
}: {
  present: number;
  late: number;
  absent: number;
  total: number;
}) => {
  const pct = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
  const color =
    pct >= 75
      ? "text-emerald-600"
      : pct >= 50
        ? "text-amber-600"
        : "text-rose-600";
  const barColor =
    pct >= 75 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-rose-500";

  return (
    <div className="flex flex-col gap-1.5 min-w-22.5">
      <div className="flex items-center justify-between">
        <span className={`text-sm font-bold ${color}`}>{pct}%</span>
        <span className="text-[10px] text-neutral-400 font-medium">
          {present + late}/{total}
        </span>
      </div>
      <div className="h-1 rounded-full bg-neutral-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex gap-1">
        {present > 0 && (
          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
            {present}P
          </span>
        )}
        {late > 0 && (
          <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">
            {late}L
          </span>
        )}
        {absent > 0 && (
          <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-full">
            {absent}A
          </span>
        )}
      </div>
    </div>
  );
};

/* ─── Main Component ──────────────────────────────────────────────────────── */
const AttendancePageComponent = ({ courseId }: { courseId: string }) => {
  const { data, error, isLoading } = useMyAttendanceQuery(courseId);
  const [filterStatus, setFilterStatus] = useState<
    "all" | "PRESENT" | "LATE" | "ABSENT"
  >("all");

  /* ── Computed stats (hooks before conditionals) ── */
  const attendanceData: AttendanceData | undefined = (
    data as AttendanceResponse | undefined
  )?.attendanceData;

  const handleDownloadAttendance = async () => {
    try {
      const blob = await downloadAttendanceApi(courseId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const now = new Date();
      const formattedDate =
        now.getFullYear() +
        "-" +
        String(now.getMonth() + 1).padStart(2, "0") +
        "-" +
        String(now.getDate()).padStart(2, "0") +
        "-" +
        String(now.getHours()).padStart(2, "0") +
        "-" +
        String(now.getMinutes()).padStart(2, "0");

      a.download = `attendance-${courseId}-Date-${formattedDate}.xlsx`;
      // file name
      document.body.appendChild(a);

      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
      alert("Failed to download attendance");
    }
  };

  const overallStats = useMemo(() => {
    if (!attendanceData)
      return { present: 0, late: 0, absent: 0, total: 0, rate: 0 };
    let present = 0,
      late = 0,
      absent = 0,
      total = 0;
    for (const s of attendanceData.students) {
      for (const l of s.lectures) {
        total++;
        if (l.status === "PRESENT") present++;
        else if (l.status === "LATE") late++;
        else absent++;
      }
    }
    return {
      present,
      late,
      absent,
      total,
      rate: total > 0 ? Math.round(((present + late) / total) * 100) : 0,
    };
  }, [attendanceData]);

  const filteredStudents = useMemo(() => {
    if (!attendanceData) return [];
    if (filterStatus === "all") return attendanceData.students;
    return attendanceData.students.filter((s) =>
      s.lectures.some((l) => l.status === filterStatus),
    );
  }, [attendanceData, filterStatus]);

  /* ── Lecture column attendance rate ── */
  const lectureStats = useMemo(() => {
    if (!attendanceData) return {};
    const map: Record<
      string,
      { present: number; late: number; absent: number }
    > = {};
    for (const lec of attendanceData.lectures) {
      map[lec.id] = { present: 0, late: 0, absent: 0 };
    }
    for (const s of attendanceData.students) {
      for (const l of s.lectures) {
        if (map[l.lectureId]) {
          if (l.status === "PRESENT") map[l.lectureId].present++;
          else if (l.status === "LATE") map[l.lectureId].late++;
          else map[l.lectureId].absent++;
        }
      }
    }
    return map;
  }, [attendanceData]);

  if (isLoading) return <Loading />;
  if (error) return <Error />;
  if (!attendanceData) return <Error />;

  const { course, lectures, students } = attendanceData;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-full px-4 py-10">
        <div className="max-w-7xl mx-auto">
          {/* ── Header ── */}
          <div className="mb-8">
            <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-2">
              Attendance Register
            </p>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-violet-600">
                  {course}
                </h1>
                <p className="text-sm text-neutral-400 font-medium mt-1">
                  {students.length} students · {lectures.length} lectures
                </p>
              </div>
            </div>
          </div>

          {/* ── Summary Cards ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
            <div className="relative bg-violet-600 rounded-2xl p-5 overflow-hidden shadow-md shadow-violet-200">
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/10" />
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp
                    className="w-3.5 h-3.5 text-violet-200"
                    strokeWidth={1.8}
                  />
                  <p className="text-[10px] font-bold text-violet-200 uppercase tracking-widest">
                    Avg Rate
                  </p>
                </div>
                <p className="text-3xl font-bold text-white">
                  {overallStats.rate}%
                </p>
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
                {overallStats.present}
              </p>
            </div>

            <div className="bg-white border border-amber-200 rounded-2xl px-4 py-4 shadow-sm">
              <div className="flex items-center gap-1.5 mb-2">
                <Clock
                  className="w-3.5 h-3.5 text-amber-500"
                  strokeWidth={1.8}
                />
                <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                  Late
                </p>
              </div>
              <p className="text-2xl font-bold text-amber-600">
                {overallStats.late}
              </p>
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
              <p className="text-2xl font-bold text-rose-600">
                {overallStats.absent}
              </p>
            </div>
          </div>

          {/* ── Toolbar ── */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-neutral-400" />
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Show students with
              </span>
            </div>
            <Select
              value={filterStatus}
              onValueChange={(v: typeof filterStatus) => setFilterStatus(v)}
            >
              <SelectTrigger className="w-40 bg-white border-black/10 rounded-xl text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Students</SelectItem>
                <SelectItem value="PRESENT">Any Present</SelectItem>
                <SelectItem value="LATE">Any Late</SelectItem>
                <SelectItem value="ABSENT">Any Absent</SelectItem>
              </SelectContent>
            </Select>

            {/* Download button */}
            <Button
              className="bg-violet-600 hover:bg-violet-700 text-white flex items-center gap-2 shadow-md"
              onClick={handleDownloadAttendance}
            >
              <Download className="w-4 h-4" />
              Download Excel
            </Button>

            <span className="text-xs text-neutral-400 font-medium ml-auto">
              Showing{" "}
              <span className="text-violet-600 font-semibold">
                {filteredStudents.length}
              </span>{" "}
              of{" "}
              <span className="text-violet-600 font-semibold">
                {students.length}
              </span>{" "}
              students
            </span>
          </div>

          {/* ── Grid Table ── */}
          {filteredStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 border border-dashed border-black/15 rounded-2xl bg-white">
              <Users
                className="w-8 h-8 text-neutral-300 mb-3"
                strokeWidth={1.5}
              />
              <p className="text-neutral-400 text-sm font-medium">
                No students match this filter
              </p>
            </div>
          ) : (
            <div className="bg-white border border-black/8 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    {/* ── Top header: lecture titles ── */}
                    <tr className="border-b border-black/8">
                      {/* Student column header */}
                      <th className="sticky left-0 z-20 bg-neutral-50 border-r border-black/8 px-4 py-3 text-left min-w-50">
                        <div className="flex items-center gap-2">
                          <Users
                            className="w-3.5 h-3.5 text-neutral-400"
                            strokeWidth={1.8}
                          />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                            Student
                          </span>
                        </div>
                      </th>

                      {/* Lecture columns */}
                      {lectures.map((lec, idx) => {
                        const stats = lectureStats[lec.id] ?? {
                          present: 0,
                          late: 0,
                          absent: 0,
                        };
                        const total = stats.present + stats.late + stats.absent;
                        const pct =
                          total > 0
                            ? Math.round(
                                ((stats.present + stats.late) / total) * 100,
                              )
                            : 0;
                        return (
                          <th
                            key={lec.id}
                            className="border-r border-black/5 px-3 py-3 min-w-25 bg-neutral-50"
                          >
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-[9px] font-bold text-violet-500 bg-violet-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                L{idx + 1}
                              </span>
                              <span
                                className="text-[11px] font-semibold text-neutral-700 text-center leading-tight max-w-22.5 truncate"
                                title={lec.title}
                              >
                                {lec.title}
                              </span>
                              <span className="text-[10px] text-neutral-400">
                                {fmtDate(lec.startTime)}
                              </span>
                              <span className="text-[9px] text-neutral-300">
                                {fmtTime(lec.startTime)}
                              </span>
                              {/* Column attendance rate */}
                              <div className="mt-1 flex items-center gap-1">
                                <div className="h-1 w-12 rounded-full bg-neutral-100 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${pct >= 75 ? "bg-emerald-400" : pct >= 50 ? "bg-amber-400" : "bg-rose-400"}`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span
                                  className={`text-[9px] font-bold ${pct >= 75 ? "text-emerald-500" : pct >= 50 ? "text-amber-500" : "text-rose-500"}`}
                                >
                                  {pct}%
                                </span>
                              </div>
                            </div>
                          </th>
                        );
                      })}

                      {/* Summary column */}
                      <th className="px-4 py-3 min-w-27.5 bg-neutral-50">
                        <div className="flex items-center gap-1.5 justify-center">
                          <BookOpen
                            className="w-3.5 h-3.5 text-neutral-400"
                            strokeWidth={1.8}
                          />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                            Summary
                          </span>
                        </div>
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredStudents.map((student, rowIdx) => {
                      const lectureMap: Record<string, StudentLecture> = {};
                      for (const l of student.lectures)
                        lectureMap[l.lectureId] = l;

                      const present = student.lectures.filter(
                        (l) => l.status === "PRESENT",
                      ).length;
                      const late = student.lectures.filter(
                        (l) => l.status === "LATE",
                      ).length;
                      const absent = student.lectures.filter(
                        (l) => l.status === "ABSENT",
                      ).length;
                      const total = student.lectures.length;

                      const initials = student.name
                        .trim()
                        .split(" ")
                        .map((w) => w[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase();

                      return (
                        <tr
                          key={student.studentId}
                          className={`border-b border-black/5 transition-colors hover:bg-violet-50/30 ${rowIdx % 2 === 0 ? "bg-white" : "bg-neutral-50/50"}`}
                        >
                          {/* Student name cell */}
                          <td
                            className={`sticky left-0 z-10 border-r border-black/8 px-4 py-3 ${rowIdx % 2 === 0 ? "bg-white" : "bg-neutral-50/50"} hover:bg-violet-50/30`}
                          >
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center shrink-0">
                                <span className="text-[10px] font-bold text-white">
                                  {initials}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-neutral-800 truncate max-w-32.5">
                                  {student.name.trim()}
                                </p>
                                <p className="text-[10px] text-neutral-400 truncate max-w-32.5">
                                  {student.email}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Status cells for each lecture */}
                          {lectures.map((lec) => {
                            const entry = lectureMap[lec.id];
                            return (
                              <td
                                key={lec.id}
                                className="border-r border-black/5 px-2 py-3 text-center align-middle"
                              >
                                {entry ? (
                                  <div className="flex justify-center">
                                    <StatusCell entry={entry} />
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-neutral-300 font-medium">
                                    —
                                  </span>
                                )}
                              </td>
                            );
                          })}

                          {/* Summary cell */}
                          <td className="px-4 py-3 align-middle">
                            <SummaryPill
                              present={present}
                              late={late}
                              absent={absent}
                              total={total}
                            />
                          </td>
                        </tr>
                      );
                    })}

                    {/* ── Footer row: column totals ── */}
                    <tr className="border-t-2 border-black/10 bg-neutral-50">
                      <td className="sticky left-0 z-10 bg-neutral-50 border-r border-black/8 px-4 py-3">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
                          Total ({students.length} students)
                        </span>
                      </td>
                      {lectures.map((lec) => {
                        const stats = lectureStats[lec.id] ?? {
                          present: 0,
                          late: 0,
                          absent: 0,
                        };
                        return (
                          <td
                            key={lec.id}
                            className="border-r border-black/5 px-2 py-3 text-center"
                          >
                            <div className="flex flex-col items-center gap-0.5">
                              <span className="text-[9px] font-bold text-emerald-600">
                                {stats.present}P
                              </span>
                              <span className="text-[9px] font-bold text-amber-600">
                                {stats.late}L
                              </span>
                              <span className="text-[9px] font-bold text-rose-600">
                                {stats.absent}A
                              </span>
                            </div>
                          </td>
                        );
                      })}
                      <td className="px-4 py-3 text-center">
                        <span className="text-xs font-bold text-neutral-500">
                          {overallStats.rate}% avg
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 px-4 py-3 border-t border-black/5 bg-neutral-50/70">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  Legend
                </span>
                {(["PRESENT", "LATE", "ABSENT"] as const).map((s) => {
                  const cfg = STATUS_CONFIG[s];
                  return (
                    <div key={s} className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                      <span className={`text-[10px] font-semibold ${cfg.text}`}>
                        {cfg.label}
                      </span>
                    </div>
                  );
                })}
                <span className="text-[10px] text-neutral-400 ml-2">
                  · Duration shown for attended sessions
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendancePageComponent;

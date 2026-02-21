"use client";

import { useMyDashboardQuery } from "@/queries/auth.queries";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  IndianRupee,
  Clock,
  Users,
  Play,
  CalendarClock,
  AlertCircle,
  GraduationCap,
  BarChart3,
  CircleDot,
} from "lucide-react";

/* ─── Types ───────────────────────────────────────────────────────────────── */
interface CourseCount {
  enrollments: number;
  lectures: number;
}
interface Course {
  id: string;
  title: string;
  price: number;
  isEnrollmentOpen: boolean;
  _count: CourseCount;
}
interface UpcomingLecture {
  id: string;
  title: string;
  startTime: string;
  status: string;
  course: { title: string };
}
interface DashboardData {
  summary: {
    totalCourses: number;
    totalRevenue: number;
    avgAttendanceDuration: number;
  };
  courses: Course[];
  upcomingLectures: UpcomingLecture[];
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const formatDateTime = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const timeUntil = (iso: string) => {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff < 0) return "Started";
  const h = Math.floor(diff / 3600000);
  const d = Math.floor(h / 24);
  if (d > 0) return `in ${d}d ${h % 24}h`;
  if (h > 0) return `in ${h}h`;
  return `in ${Math.floor(diff / 60000)}m`;
};

/* ─── Color palette ───────────────────────────────────────────────────────── */
const colors = {
  violet: {
    bg: "bg-violet-500",
    light: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-600",
    badge: "bg-violet-100 text-violet-700 border-violet-200",
  },
  emerald: {
    bg: "bg-emerald-500",
    light: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-600",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  amber: {
    bg: "bg-amber-500",
    light: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-600",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
  },
  sky: {
    bg: "bg-sky-500",
    light: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-600",
    badge: "bg-sky-100 text-sky-700 border-sky-200",
  },
  rose: {
    bg: "bg-rose-500",
    light: "bg-rose-50",
    border: "border-rose-200",
    text: "text-rose-600",
    badge: "bg-rose-100 text-rose-700 border-rose-200",
  },
};

const courseAccents = [
  colors.violet,
  colors.sky,
  colors.emerald,
  colors.amber,
  colors.rose,
];

/* ─── Stat Card ───────────────────────────────────────────────────────────── */
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: typeof colors.violet;
}) {
  return (
    <Card
      className={`relative overflow-hidden border ${color.border} bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
    >
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${color.bg}`} />
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] font-semibold tracking-widest uppercase text-neutral-400 mb-2">
              {label}
            </p>
            <p
              className={`text-3xl font-bold tracking-tight leading-none ${color.text}`}
            >
              {value}
            </p>
            {sub && (
              <p className="text-xs text-neutral-400 mt-1.5 font-medium">
                {sub}
              </p>
            )}
          </div>
          <div
            className={`w-9 h-9 rounded-lg ${color.bg} flex items-center justify-center shrink-0`}
          >
            <Icon className="w-4 h-4 text-white" strokeWidth={1.8} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Course Card ─────────────────────────────────────────────────────────── */
function CourseCard({ course, index }: { course: Course; index: number }) {
  const accent = courseAccents[index % courseAccents.length];
  return (
    <Card
      className={`group border ${accent.border} bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden`}
    >
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3 min-w-0">
            <div
              className={`shrink-0 mt-0.5 w-8 h-8 rounded-lg ${accent.bg} flex items-center justify-center`}
            >
              <BookOpen className="w-4 h-4 text-white" strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-neutral-800 leading-snug line-clamp-2 wrap-break-word">
                {course.title}
              </h3>
              <p className={`text-xs font-semibold mt-0.5 ${accent.text}`}>
                {formatCurrency(course.price)}
              </p>
            </div>
          </div>
          <span
            className={`shrink-0 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${
              course.isEnrollmentOpen
                ? accent.badge
                : "bg-neutral-100 text-neutral-400 border-neutral-200"
            }`}
          >
            {course.isEnrollmentOpen ? "Open" : "Closed"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${accent.light} border ${accent.border}`}
          >
            <Users className={`w-3.5 h-3.5 ${accent.text}`} strokeWidth={1.8} />
            <div>
              <p className={`text-base font-bold leading-none ${accent.text}`}>
                {course._count.enrollments}
              </p>
              <p className="text-[10px] text-neutral-400 font-medium mt-0.5">
                Students
              </p>
            </div>
          </div>
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${accent.light} border ${accent.border}`}
          >
            <Play className={`w-3.5 h-3.5 ${accent.text}`} strokeWidth={1.8} />
            <div>
              <p className={`text-base font-bold leading-none ${accent.text}`}>
                {course._count.lectures}
              </p>
              <p className="text-[10px] text-neutral-400 font-medium mt-0.5">
                Lectures
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Upcoming Lecture Card ───────────────────────────────────────────────── */
function LectureCard({ lecture }: { lecture: UpcomingLecture }) {
  return (
    <Card className="relative border border-violet-200 bg-white shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-violet-500" />
      <CardContent className="p-4 pl-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 mb-1">
              <CircleDot
                className="w-3 h-3 text-violet-500 shrink-0"
                strokeWidth={2}
              />
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider truncate">
                {lecture.course.title}
              </p>
            </div>
            <h3 className="text-sm font-semibold text-neutral-800 line-clamp-1">
              {lecture.title}
            </h3>
            <div className="flex items-center gap-1.5 mt-2">
              <CalendarClock
                className="w-3.5 h-3.5 text-neutral-400"
                strokeWidth={1.8}
              />
              <span className="text-xs text-neutral-500 font-medium">
                {formatDateTime(lecture.startTime)}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <span className="inline-block text-xs font-bold text-violet-700 bg-violet-100 border border-violet-200 rounded-full px-2.5 py-1">
              {timeUntil(lecture.startTime)}
            </span>
            <p className="text-[10px] text-neutral-400 font-medium mt-1.5 uppercase tracking-wide">
              {lecture.status.replace("_", " ")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Loading Skeleton ────────────────────────────────────────────────────── */
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl bg-neutral-100" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-xl bg-neutral-100" />
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────────── */
export default function DashboardPage() {
  const { data, isLoading, error } = useMyDashboardQuery();
  const dashboard = data as DashboardData | undefined;

  return (
    <div className="min-h-screen bg-slate-50 text-neutral-800">
      <div className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded bg-violet-500 flex items-center justify-center">
              <GraduationCap
                className="w-3.5 h-3.5 text-white"
                strokeWidth={2}
              />
            </div>
            <span className="text-[10px] font-bold text-violet-500 tracking-widest uppercase">
              Teacher Portal
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-800">
            My Dashboard
          </h1>
          <p className="text-sm text-neutral-400 font-medium mt-1">
            Overview of your courses, revenue & upcoming sessions
          </p>
        </div>

        {/* Loading */}
        {isLoading && <DashboardSkeleton />}

        {/* Error */}
        {error && (
          <Card className="border border-rose-200 bg-rose-50 shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
              <p className="text-sm text-rose-700 font-medium">
                Failed to load dashboard. Please refresh the page.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Content */}
        {dashboard && (
          <div className="space-y-7">
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <StatCard
                icon={BookOpen}
                label="Total Courses"
                value={dashboard.summary.totalCourses}
                sub="Published courses"
                color={colors.violet}
              />
              <StatCard
                icon={IndianRupee}
                label="Total Revenue"
                value={formatCurrency(dashboard.summary.totalRevenue)}
                sub="All time earnings"
                color={colors.emerald}
              />
              <StatCard
                icon={BarChart3}
                label="Avg. Attendance"
                value={`${dashboard.summary.avgAttendanceDuration}m`}
                sub="Per lecture session"
                color={colors.amber}
              />
            </div>

            {/* Courses */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  Your Courses
                </h2>
                <div className="flex-1 h-px bg-neutral-200" />
                <span className="text-[10px] text-neutral-400 font-medium">
                  {dashboard.courses.length} total
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {dashboard.courses.map((course, i) => (
                  <CourseCard key={course.id} course={course} index={i} />
                ))}
              </div>
            </div>

            {/* Upcoming Lectures */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                  Upcoming Lectures
                </h2>
                <div className="flex-1 h-px bg-neutral-200" />
                <span className="text-[10px] text-neutral-400 font-medium">
                  {dashboard.upcomingLectures.length} scheduled
                </span>
              </div>

              {dashboard.upcomingLectures.length === 0 ? (
                <Card className="border border-dashed border-violet-200 bg-violet-50/50 shadow-none">
                  <CardContent className="flex flex-col items-center justify-center py-10 gap-2">
                    <div className="w-10 h-10 rounded-xl border border-violet-200 bg-violet-50 flex items-center justify-center">
                      <Clock
                        className="w-5 h-5 text-violet-300"
                        strokeWidth={1.5}
                      />
                    </div>
                    <p className="text-sm font-semibold text-neutral-400">
                      No upcoming lectures
                    </p>
                    <p className="text-xs text-neutral-300 font-medium">
                      Schedule a session to get started
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-2.5">
                  {dashboard.upcomingLectures.map((lecture) => (
                    <div key={lecture.id} className="relative">
                      <LectureCard lecture={lecture} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

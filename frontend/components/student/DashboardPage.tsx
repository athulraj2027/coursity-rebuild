"use client";
import { useMyDashboardQuery } from "@/queries/auth.queries";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookOpen,
  CalendarCheck2,
  IndianRupee,
  TrendingUp,
  GraduationCap,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

/* ─── Types ───────────────────────────────────────────────────────────────── */
interface Lecture {
  id: string;
  status: string;
}
interface Course {
  id: string;
  title: string;
  price: number;
  teacher: { name: string };
  lectures: Lecture[];
}
interface Payment {
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
}
interface Enrollment {
  id: string;
  createdAt: string;
  course: Course;
  payment: Payment;
}
interface DashboardData {
  summary: { totalCourses: number; attendancePercent: number };
  enrollments: Enrollment[];
  upcomingLectures: unknown[];
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const getCompleted = (lectures: Lecture[]) =>
  lectures.filter((l) => l.status === "COMPLETED").length;

/* ─── Stat Card ───────────────────────────────────────────────────────────── */
function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
}) {
  return (
    <Card className="relative overflow-hidden bg-white border border-black/10 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="absolute inset-0 bg-black/5" />
      <CardContent className="relative p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-gray-600 mb-2">
              {label}
            </p>
            <p className="text-3xl font-bold text-black tracking-tight">
              {value}
            </p>
            {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
          </div>
          <div className="p-2.5 rounded-xl bg-black/10">
            <Icon className="w-5 h-5 text-black" strokeWidth={1.5} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ─── Course Card ─────────────────────────────────────────────────────────── */
function CourseCard({ enrollment }: { enrollment: Enrollment }) {
  const { course, payment, createdAt } = enrollment;
  const done = getCompleted(course.lectures);
  const total = course.lectures.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const isPaid = payment.status === "PAID";

  return (
    <Card className="group relative overflow-hidden bg-white border border-black/10 shadow-sm hover:shadow-lg transition-all duration-300">
      <CardHeader className="pb-3 pt-5 px-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="shrink-0 mt-0.5 w-9 h-9 rounded-lg bg-black/10 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-black" strokeWidth={1.5} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-gray-600 tracking-wide uppercase mb-0.5">
                {course.teacher.name}
              </p>
              <h3 className="text-sm font-semibold text-black leading-snug line-clamp-2">
                {course.title}
              </h3>
            </div>
          </div>

          <Badge
            className={`shrink-0 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${
              isPaid
                ? "bg-black text-white border-black"
                : "bg-white text-black border-black"
            }`}
          >
            {isPaid ? (
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Paid
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Pending
              </span>
            )}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5 space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
              Progress
            </span>
            <span className="text-[11px] font-semibold text-gray-700">
              {total === 0 ? "No lectures yet" : `${done} / ${total} completed`}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-black/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-black transition-all duration-700"
              style={{ width: `${pct}%` }}
            />
          </div>
          {total > 0 && (
            <p className="text-right text-[10px] text-gray-500 mt-1">{pct}%</p>
          )}
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-black/10">
          <div className="flex items-center gap-1.5 text-gray-600">
            <CalendarCheck2 className="w-3.5 h-3.5" />
            <span className="text-xs">{formatDate(createdAt)}</span>
          </div>
          <div className="flex items-center gap-1 text-black">
            <IndianRupee className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-sm font-semibold">
              {payment.amount.toLocaleString("en-IN")}
            </span>
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
          <Skeleton key={i} className="h-28 rounded-2xl bg-black/5" />
        ))}
      </div>
      <div className="space-y-3">
        {[...Array(2)].map((_, i) => (
          <Skeleton key={i} className="h-48 rounded-2xl bg-black/5" />
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────────── */
const DashboardPage = () => {
  const { data, error, isLoading } = useMyDashboardQuery();
  const dashboard = data as DashboardData | undefined;

  const totalSpent =
    dashboard?.enrollments.reduce((s, e) => s + e.payment.amount, 0) ?? 0;

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-black/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-black/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-10">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-md bg-black/10 flex items-center justify-center">
              <GraduationCap className="w-3.5 h-3.5 text-black" />
            </div>
            <span className="text-xs font-semibold text-gray-600 tracking-widest uppercase">
              Student Portal
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black">
            My Dashboard
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Track your learning progress and enrollments
          </p>
        </div>

        {isLoading && <DashboardSkeleton />}

        {error && (
          <Card className="bg-white border border-black shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <AlertCircle className="w-5 h-5 text-black shrink-0" />
              <p className="text-sm text-black">
                Failed to load dashboard. Please refresh the page.
              </p>
            </CardContent>
          </Card>
        )}

        {dashboard && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <StatCard
                icon={BookOpen}
                label="Courses"
                value={dashboard.summary.totalCourses}
                sub="Active enrollments"
              />
              <StatCard
                icon={TrendingUp}
                label="Attendance"
                value={`${dashboard.summary.attendancePercent}%`}
                sub="Overall completion"
              />
              <StatCard
                icon={IndianRupee}
                label="Total Spent"
                value={formatCurrency(totalSpent)}
                sub="Across all courses"
              />
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-widest">
                  Enrolled Courses
                </h2>
                <div className="flex-1 h-px bg-black/10" />
                <span className="text-xs text-gray-500">
                  {dashboard.enrollments.length} total
                </span>
              </div>
              <div className="space-y-3">
                {dashboard.enrollments.map((enrollment) => (
                  <CourseCard key={enrollment.id} enrollment={enrollment} />
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                <h2 className="text-xs font-semibold text-gray-600 uppercase tracking-widest">
                  Upcoming Lectures
                </h2>
                <div className="flex-1 h-px bg-black/10" />
              </div>
              {dashboard.upcomingLectures.length === 0 && (
                <Card className="bg-white border border-black/10 shadow-sm">
                  <CardContent className="flex flex-col items-center justify-center py-10 gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-black/10 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-black" strokeWidth={1.5} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium text-gray-600">
                        No upcoming lectures
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Check back later for scheduled sessions
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

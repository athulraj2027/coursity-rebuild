"use client";

import React from "react";
import { useMyDashboardQuery } from "@/queries/auth.queries";
// import Loading from "@/components/common/Loading";
import Error from "@/components/common/Error";
import {
  Users,
  GraduationCap,
  BookOpen,
  IndianRupee,
  Video,
  CheckCircle,
  CalendarClock,
  Radio,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

/* ─── Types ───────────────────────────────────────────────────────────────── */
interface AdminStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenueReceived: number;
  totalLectures: number;
  completedLectures: number;
  scheduledLectures: number;
  liveLectures: number;
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const formatCurrency = (paise: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise);

/* ─── Stat Card ───────────────────────────────────────────────────────────── */
interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  iconBg: string;
  topBar: string;
  border: string;
  valueColor: string;
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  iconBg,
  topBar,
  border,
  valueColor,
}: StatCardProps) {
  return (
    <div
      className={`relative overflow-hidden bg-white border ${border} rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
    >
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${topBar}`} />
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-2">
              {label}
            </p>
            <p
              className={`text-3xl font-bold tracking-tight leading-none ${valueColor}`}
            >
              {value}
            </p>
            {sub && (
              <p className="text-xs text-neutral-400 font-medium mt-1.5">
                {sub}
              </p>
            )}
          </div>
          <div
            className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}
          >
            <Icon className="w-4 h-4 text-white" strokeWidth={1.8} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Section Header ──────────────────────────────────────────────────────── */
function SectionHeader({ label, count }: { label: string; count?: number }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <h2 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest whitespace-nowrap">
        {label}
      </h2>
      <div className="flex-1 h-px bg-neutral-200" />
      {count !== undefined && (
        <span className="text-[10px] text-neutral-400 font-medium whitespace-nowrap">
          {count} total
        </span>
      )}
    </div>
  );
}

/* ─── Skeleton ────────────────────────────────────────────────────────────── */
function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl bg-neutral-100" />
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl bg-neutral-100" />
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-2xl bg-neutral-100" />
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ───────────────────────────────────────────────────────────── */
export default function AdminDashboardPage() {
  const { data, error, isLoading } = useMyDashboardQuery();
  const stats = data as AdminStats | undefined;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded bg-violet-500 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-white" strokeWidth={2} />
            </div>
            <span className="text-[10px] font-bold text-violet-500 tracking-widest uppercase">
              Admin Portal
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-800">
            Dashboard
          </h1>
          <p className="text-sm text-neutral-400 font-medium mt-1">
            Real-time snapshot of all platform activity
          </p>
        </div>

        {isLoading && <DashboardSkeleton />}
        {error && <Error />}

        {stats && (
          <div className="space-y-10">
            {/* ── Users ── */}
            <section>
              <SectionHeader label="Users" count={stats.totalUsers} />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <StatCard
                  icon={Users}
                  label="Total Users"
                  value={stats.totalUsers}
                  sub="All registered accounts"
                  iconBg="bg-violet-500"
                  topBar="bg-violet-500"
                  border="border-violet-200"
                  valueColor="text-violet-600"
                />
                <StatCard
                  icon={GraduationCap}
                  label="Students"
                  value={stats.totalStudents}
                  sub="Active learners"
                  iconBg="bg-sky-500"
                  topBar="bg-sky-500"
                  border="border-sky-200"
                  valueColor="text-sky-600"
                />
                <StatCard
                  icon={UserCog}
                  label="Teachers"
                  value={stats.totalTeachers}
                  sub="Course instructors"
                  iconBg="bg-indigo-500"
                  topBar="bg-indigo-500"
                  border="border-indigo-200"
                  valueColor="text-indigo-600"
                />
              </div>
            </section>

            {/* ── Courses & Revenue ── */}
            <section>
              <SectionHeader label="Courses & Revenue" />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <StatCard
                  icon={BookOpen}
                  label="Total Courses"
                  value={stats.totalCourses}
                  sub="Published on platform"
                  iconBg="bg-emerald-500"
                  topBar="bg-emerald-500"
                  border="border-emerald-200"
                  valueColor="text-emerald-600"
                />
                <StatCard
                  icon={GraduationCap}
                  label="Total Enrollments"
                  value={stats.totalEnrollments}
                  sub="Student–course pairs"
                  iconBg="bg-teal-500"
                  topBar="bg-teal-500"
                  border="border-teal-200"
                  valueColor="text-teal-600"
                />
                <StatCard
                  icon={IndianRupee}
                  label="Revenue Received"
                  value={formatCurrency(stats.totalRevenueReceived / 100)}
                  sub="Total earnings collected"
                  iconBg="bg-amber-500"
                  topBar="bg-amber-500"
                  border="border-amber-200"
                  valueColor="text-amber-600"
                />
              </div>
            </section>

            {/* ── Lectures ── */}
            <section>
              <SectionHeader label="Lectures" count={stats.totalLectures} />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard
                  icon={Video}
                  label="Total Lectures"
                  value={stats.totalLectures}
                  iconBg="bg-blue-500"
                  topBar="bg-blue-500"
                  border="border-blue-200"
                  valueColor="text-blue-600"
                />
                <StatCard
                  icon={CheckCircle}
                  label="Completed"
                  value={stats.completedLectures}
                  iconBg="bg-emerald-500"
                  topBar="bg-emerald-500"
                  border="border-emerald-200"
                  valueColor="text-emerald-600"
                />
                <StatCard
                  icon={CalendarClock}
                  label="Scheduled"
                  value={stats.scheduledLectures}
                  iconBg="bg-amber-500"
                  topBar="bg-amber-500"
                  border="border-amber-200"
                  valueColor="text-amber-600"
                />
                <div
                  className={`relative overflow-hidden bg-white border border-rose-200 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`}
                >
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-rose-500" />
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-2">
                          Live Now
                        </p>
                        <p className="text-3xl font-bold tracking-tight leading-none text-rose-600">
                          {stats.liveLectures}
                        </p>
                        {stats.liveLectures > 0 && (
                          <p className="text-xs text-rose-400 font-medium mt-1.5 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse inline-block" />
                            Active now
                          </p>
                        )}
                      </div>
                      <div className="w-9 h-9 rounded-xl bg-rose-500 flex items-center justify-center shrink-0">
                        <Radio
                          className="w-4 h-4 text-white"
                          strokeWidth={1.8}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}

"use client";
import { useCourseByIdQueryAdmin } from "@/queries/courses.queries";
import React from "react";
import {
  BookOpen,
  Users,
  IndianRupee,
  Video,
  Calendar,
  CheckCircle,
  Clock,
  Radio,
  GraduationCap,
  Wallet,
  ToggleLeft,
  ToggleRight,
  Trash2,
  Eye,
  ArrowLeft,
  BarChart2,
  CreditCard,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import Loading from "@/components/common/Loading";
import Error from "@/components/common/Error";

/* ─── Types ───────────────────────────────────────────────────────────────── */
type LectureStatus = "NOT_STARTED" | "STARTED" | "COMPLETED";

interface Lecture {
  id: string;
  title: string;
  startTime: string;
  status: LectureStatus;
  meetingId: string | null;
  _count: { participants: number; attendance: number };
}

interface CourseDetail {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  startDate: string;
  isEnrollmentOpen: boolean;
  isDeleted: boolean;
  isDisabled: boolean;
  createdAt: string;
  updatedAt: string;
  teacher: {
    id: string;
    name: string;
    email: string;
    role: string;
    wallet: { balance: number } | null;
  };
  lectures: Lecture[];
  _count: { enrollments: number; payments: number };
  stats: {
    totalEnrollments: number;
    totalPayments: number;
    totalRevenue: number;
  };
}

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const fmt = (paise: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);

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

/* ─── Lecture status config ───────────────────────────────────────────────── */
const statusCfg: Record<
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
    style: "bg-violet-600 text-white border-violet-600",
  },
};

/* ─── Info row ────────────────────────────────────────────────────────────── */
const InfoRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-center gap-3 py-3 border-b border-black/5 last:border-0">
    <div className="w-7 h-7 rounded-lg bg-neutral-100 flex items-center justify-center shrink-0">
      <Icon className="w-3.5 h-3.5 text-neutral-500" strokeWidth={1.8} />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
        {label}
      </p>
      <div className="text-sm font-semibold text-neutral-800 mt-0.5">
        {value}
      </div>
    </div>
  </div>
);

/* ─── Main Component ──────────────────────────────────────────────────────── */
const AdminCourseDetail = ({ id }: { id: string }) => {
  const { data, error, isLoading } = useCourseByIdQueryAdmin(id);

  if (isLoading) return <Loading />;
  if (error || !data) return <Error />;

  const course = data as CourseDetail;

  const teacherInitials = course.teacher.name
    .trim()
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        {/* ── Back + header ── */}
        <div>
          <Link
            href="/admin/courses"
            className="inline-flex items-center gap-1.5 text-xs text-neutral-400 font-semibold hover:text-black transition-colors mb-4"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2} />
            Back to Courses
          </Link>
          <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-2">
            Admin Portal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-violet-600">
            Course Detail
          </h1>
          <p className="text-sm text-neutral-400 font-medium mt-1">
            Full admin view of course info and activity
          </p>
        </div>

        {/* ── Hero card ── */}
        <div className="bg-white border border-black/8 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            {/* Thumbnail */}
            <div className="sm:w-60 shrink-0 h-48 sm:h-auto bg-neutral-100 relative overflow-hidden">
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
              {/* Status chips */}
              <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5">
                <span
                  className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${
                    course.isEnrollmentOpen
                      ? "bg-black text-white border-black"
                      : "bg-white text-neutral-500 border-black/20"
                  }`}
                >
                  {course.isEnrollmentOpen ? "Enrolling" : "Closed"}
                </span>
                {course.isDisabled && (
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border bg-amber-500 text-white border-amber-500">
                    Disabled
                  </span>
                )}
                {course.isDeleted && (
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border bg-rose-500 text-white border-rose-500">
                    Deleted
                  </span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="p-6 flex flex-col justify-between gap-4 flex-1 min-w-0">
              <div>
                <h2 className="text-xl font-bold text-black leading-snug">
                  {course.title}
                </h2>
                <p className="text-sm text-neutral-400 mt-1.5 line-clamp-3">
                  {course.description}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    icon: IndianRupee,
                    label: fmt(course.price),
                    color: "text-emerald-600",
                  },
                  {
                    icon: Calendar,
                    label: fmtDate(course.startDate),
                    color: "text-sky-600",
                  },
                  {
                    icon: Video,
                    label: `${course.lectures.length} lectures`,
                    color: "text-violet-600",
                  },
                  {
                    icon: Users,
                    label: `${course._count.enrollments} enrolled`,
                    color: "text-amber-600",
                  },
                  {
                    icon: CreditCard,
                    label: `${course._count.payments} payments`,
                    color: "text-neutral-600",
                  },
                  {
                    icon: Clock,
                    label: `Added ${fmtDate(course.createdAt)}`,
                    color: "text-neutral-400",
                  },
                ].map(({ icon: Icon, label, color }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <Icon
                      className={`w-3.5 h-3.5 shrink-0 ${color}`}
                      strokeWidth={1.8}
                    />
                    <span className={`text-xs font-semibold ${color} truncate`}>
                      {label}
                    </span>
                  </div>
                ))}
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
                <Users
                  className="w-3.5 h-3.5 text-violet-200"
                  strokeWidth={1.8}
                />
                <p className="text-[10px] font-bold text-violet-200 uppercase tracking-widest">
                  Enrollments
                </p>
              </div>
              <p className="text-3xl font-bold text-white">
                {course.stats.totalEnrollments}
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
              {fmt(course.stats.totalRevenue)}
            </p>
          </div>

          <div className="bg-white border border-sky-200 rounded-2xl px-5 py-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-2">
              <CreditCard
                className="w-3.5 h-3.5 text-sky-500"
                strokeWidth={1.8}
              />
              <p className="text-[10px] font-bold text-sky-600 uppercase tracking-wider">
                Payments
              </p>
            </div>
            <p className="text-2xl font-bold text-sky-600">
              {course.stats.totalPayments}
            </p>
          </div>

          <div className="bg-white border border-amber-200 rounded-2xl px-5 py-4 shadow-sm">
            <div className="flex items-center gap-1.5 mb-2">
              <Video className="w-3.5 h-3.5 text-amber-500" strokeWidth={1.8} />
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                Lectures
              </p>
            </div>
            <p className="text-2xl font-bold text-amber-600">
              {course.lectures.length}
            </p>
          </div>
        </div>

        {/* ── Teacher + course meta ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Teacher card */}
          <div className="bg-white border border-black/8 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-black/5">
              <GraduationCap
                className="w-4 h-4 text-violet-500"
                strokeWidth={1.8}
              />
              <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-widest">
                Teacher
              </h3>
            </div>
            <div className="p-5 space-y-4">
              {/* Avatar row */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-500 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-white">
                    {teacherInitials}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-black truncate">
                    {course.teacher.name}
                  </p>
                  <p className="text-[11px] text-neutral-400 truncate">
                    {course.teacher.email}
                  </p>
                </div>
                <Link
                  href={`/admin/users/${course.teacher.id}`}
                  className="ml-auto flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-violet-50 border border-violet-200 text-violet-700 text-[11px] font-semibold hover:bg-violet-100 transition-colors shrink-0"
                >
                  <Eye className="w-3 h-3" strokeWidth={2} />
                  View
                </Link>
              </div>

              {/* Wallet */}
              {course.teacher.wallet ? (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-100">
                  <Wallet
                    className="w-4 h-4 text-amber-500 shrink-0"
                    strokeWidth={1.8}
                  />
                  <div>
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                      Wallet Balance
                    </p>
                    <p className="text-sm font-bold text-amber-700 mt-0.5">
                      {fmt(course.teacher.wallet.balance)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-neutral-50 border border-black/6">
                  <Wallet
                    className="w-4 h-4 text-neutral-300"
                    strokeWidth={1.8}
                  />
                  <p className="text-xs text-neutral-400 font-medium">
                    No wallet
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Course meta */}
          <div className="bg-white border border-black/8 rounded-2xl shadow-sm overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-4 border-b border-black/5">
              <BarChart2 className="w-4 h-4 text-sky-500" strokeWidth={1.8} />
              <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-widest">
                Course Info
              </h3>
            </div>
            <div className="px-5 py-2">
              <InfoRow
                icon={IndianRupee}
                label="Price"
                value={fmt(course.price)}
              />
              <InfoRow
                icon={Calendar}
                label="Start Date"
                value={fmtDate(course.startDate)}
              />
              <InfoRow
                icon={Clock}
                label="Created"
                value={fmtDateTime(course.createdAt)}
              />
              <InfoRow
                icon={Clock}
                label="Updated"
                value={fmtDateTime(course.updatedAt)}
              />
              <InfoRow
                icon={course.isEnrollmentOpen ? ToggleRight : ToggleLeft}
                label="Enrollment"
                value={
                  <span
                    className={`text-xs font-bold ${course.isEnrollmentOpen ? "text-emerald-600" : "text-neutral-500"}`}
                  >
                    {course.isEnrollmentOpen ? "Open" : "Closed"}
                  </span>
                }
              />
              <InfoRow
                icon={course.isDisabled ? ToggleLeft : ToggleRight}
                label="Status"
                value={
                  <span
                    className={`text-xs font-bold ${course.isDisabled ? "text-amber-600" : course.isDeleted ? "text-rose-600" : "text-emerald-600"}`}
                  >
                    {course.isDeleted
                      ? "Deleted"
                      : course.isDisabled
                        ? "Disabled"
                        : "Active"}
                  </span>
                }
              />
            </div>
          </div>
        </div>

        {/* ── Lectures ── */}
        <div className="bg-white border border-black/8 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-black/5">
            <Video className="w-4 h-4 text-violet-500" strokeWidth={1.8} />
            <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-widest">
              Lectures
            </h3>
            <span className="text-[10px] font-bold text-violet-700 bg-violet-100 border border-violet-200 px-2 py-0.5 rounded-full">
              {course.lectures.length}
            </span>
          </div>

          {course.lectures.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <Video className="w-8 h-8 text-neutral-200" strokeWidth={1.5} />
              <p className="text-sm text-neutral-400 font-medium">
                No lectures yet
              </p>
            </div>
          ) : (
            <div className="divide-y divide-black/5">
              {course.lectures.map((lecture, i) => {
                const cfg = statusCfg[lecture.status];
                const Icon = cfg.icon;
                return (
                  <div
                    key={lecture.id}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-neutral-50/80 transition-colors"
                  >
                    <span className="text-xs text-neutral-300 font-semibold w-5 shrink-0 text-right">
                      {i + 1}
                    </span>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-black truncate">
                        {lecture.title}
                      </p>
                      <p className="text-[11px] text-neutral-400 mt-0.5">
                        {fmtDateTime(lecture.startTime)}
                      </p>
                    </div>

                    <span
                      className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border flex items-center gap-1 shrink-0 ${cfg.style}`}
                    >
                      <Icon className="w-3 h-3" strokeWidth={2} />
                      {cfg.label}
                    </span>

                    <div className="hidden sm:flex items-center gap-3 shrink-0">
                      <div className="flex items-center gap-1">
                        <Eye
                          className="w-3.5 h-3.5 text-neutral-400"
                          strokeWidth={1.8}
                        />
                        <span className="text-xs font-semibold text-neutral-600">
                          {lecture._count.participants}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          live
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users
                          className="w-3.5 h-3.5 text-neutral-400"
                          strokeWidth={1.8}
                        />
                        <span className="text-xs font-semibold text-neutral-600">
                          {lecture._count.attendance}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          attended
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Admin actions ── */}
        <div className="bg-white border border-black/8 rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-4 border-b border-black/5">
            <ShieldCheck className="w-4 h-4 text-rose-500" strokeWidth={1.8} />
            <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-widest">
              Admin Actions
            </h3>
          </div>
          <div className="p-5 flex flex-wrap gap-3">
            <Link
              href={`/admin/courses/${id}/disable`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold hover:bg-amber-100 transition-colors"
            >
              {course.isDisabled ? (
                <ToggleRight className="w-3.5 h-3.5" strokeWidth={2} />
              ) : (
                <ToggleLeft className="w-3.5 h-3.5" strokeWidth={2} />
              )}
              {course.isDisabled ? "Enable Course" : "Disable Course"}
            </Link>
            <Link
              href={`/admin/courses/${id}/delete`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" strokeWidth={2} />
              Delete Course
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseDetail;

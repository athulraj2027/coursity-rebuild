"use client";

import React from "react";
import {
  Calendar,
  IndianRupee,
  GraduationCap,
  BookOpen,
  Clock,
  Users,
} from "lucide-react";
import { useMyCourseQueryById } from "@/queries/courses.queries";
import Loading from "@/components/common/Loading";
import Error from "@/components/common/Error";

export type LectureSummary = {
  id: string;
  title: string;
  startTime: string;
  status: "NOT_STARTED" | "STARTED" | "COMPLETED";
};

export type EnrollmentSummary = {
  id: string;
  studentId: string;
  courseId: string;
  createdAt: string;
};

export type CourseWithDetails = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  startDate: string;
  isEnrollmentOpen: boolean;
  isDeleted: boolean;
  isDisabled: boolean;
  teacherId: string;
  createdAt: string;
  updatedAt: string;
  teacher: { id: string; name: string; email: string };
  lectures: LectureSummary[];
  enrollments: EnrollmentSummary[];
};

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const formatShort = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
  });

/* ─── Stat Box ────────────────────────────────────────────────────────────── */
const StatBox = ({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
}) => (
  <div className="flex flex-col gap-1.5 px-4 py-3.5 rounded-xl bg-neutral-50 border border-black/6">
    <div className="flex items-center gap-1.5 text-neutral-400">
      <Icon className="w-3.5 h-3.5" strokeWidth={1.8} />
      <span className="text-[10px] font-semibold uppercase tracking-wider">
        {label}
      </span>
    </div>
    <p className="text-xl font-bold text-black leading-none">{value}</p>
  </div>
);

/* ─── Main Component ──────────────────────────────────────────────────────── */
const CourseViewCard = ({ courseId }: { courseId: string }) => {
  const { isLoading, error, data } = useMyCourseQueryById(courseId);

  if (isLoading) return <Loading />;
  if (error || !data) return <Error />;

  const {
    title,
    description,
    imageUrl,
    price,
    startDate,
    isEnrollmentOpen,
    isDisabled,
    teacher,
    lectures,
    enrollments,
    createdAt,
  } = data;

  return (
    <div className="w-full bg-white border border-black/8 rounded-2xl overflow-hidden">
      {/* Hero image */}
      <div className="relative h-44 w-full bg-neutral-100 flex items-center justify-center overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="w-12 h-12 rounded-2xl bg-white/60 border border-black/10 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-neutral-400" strokeWidth={1.5} />
          </div>
        )}

        {/* Overlay badges */}
        <div className="absolute top-3 right-3 flex gap-1.5">
          <span
            className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${
              isEnrollmentOpen
                ? "bg-black text-white border-black"
                : "bg-white text-neutral-500 border-black/15"
            }`}
          >
            {isEnrollmentOpen ? "Enrollment Open" : "Enrollment Closed"}
          </span>
          {isDisabled && (
            <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border bg-neutral-900 text-neutral-300 border-neutral-700">
              Draft
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-5 space-y-5">
        {/* Title + price */}
        <div>
          <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
            by {teacher.name}
          </p>
          <h2 className="text-lg font-bold text-black tracking-tight leading-snug">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-neutral-400 mt-1.5 leading-relaxed line-clamp-3">
              {description}
            </p>
          )}
          <p className="text-2xl font-bold text-black mt-3">
            {price === 0 ? "Free" : `₹${price.toLocaleString()}`}
            {price > 0 && (
              <span className="text-sm font-medium text-neutral-400 ml-1">
                / course
              </span>
            )}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-black/6" />

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <StatBox icon={Users} label="Students" value={enrollments.length} />
          <StatBox icon={BookOpen} label="Lectures" value={lectures.length} />
          <StatBox
            icon={Calendar}
            label="Starts"
            value={formatShort(startDate)}
          />
          <StatBox
            icon={Clock}
            label="Created"
            value={formatShort(createdAt)}
          />
        </div>

        {/* Divider */}
        <div className="h-px bg-black/6" />

        {/* Course details */}
        <div className="space-y-2.5">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            Course Details
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-sm">
              <Calendar
                className="w-3.5 h-3.5 text-neutral-400 shrink-0"
                strokeWidth={1.8}
              />
              <span className="text-neutral-400">Starts on</span>
              <span className="font-semibold text-black ml-auto">
                {formatDate(startDate)}
              </span>
            </div>
            <div className="flex items-center gap-2.5 text-sm">
              <IndianRupee
                className="w-3.5 h-3.5 text-neutral-400 shrink-0"
                strokeWidth={1.8}
              />
              <span className="text-neutral-400">Course Fee</span>
              <span className="font-semibold text-black ml-auto">
                {price === 0 ? "Free" : `₹${price.toLocaleString()}`}
              </span>
            </div>
          </div>
        </div>

        {/* Empty states */}
        {(lectures.length === 0 || enrollments.length === 0) && (
          <>
            <div className="h-px bg-black/6" />
            <div className="space-y-2">
              {lectures.length === 0 && (
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-dashed border-black/12 bg-neutral-50">
                  <BookOpen
                    className="w-3.5 h-3.5 text-neutral-300 shrink-0"
                    strokeWidth={1.5}
                  />
                  <p className="text-xs text-neutral-400 font-medium">
                    No lectures added yet
                  </p>
                </div>
              )}
              {enrollments.length === 0 && (
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border border-dashed border-black/12 bg-neutral-50">
                  <GraduationCap
                    className="w-3.5 h-3.5 text-neutral-300 shrink-0"
                    strokeWidth={1.5}
                  />
                  <p className="text-xs text-neutral-400 font-medium">
                    No students enrolled yet
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CourseViewCard;

"use client";

import React, { useEffect } from "react";
import { useMyEnrollmentQuery } from "@/queries/enrollment.queries";
import {
  Loader2,
  CheckCircle,
  BookOpen,
  IndianRupee,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const EnrollmentSuccess = ({ enrollmentId }: { enrollmentId: string }) => {
  const { isLoading, error, data } = useMyEnrollmentQuery(enrollmentId);

  // 🔒 Lock scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        <div className="flex items-center gap-2.5 text-white">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm font-medium">Loading enrollment…</span>
        </div>
      </div>
    );
  }

  if (error || !data?.enrollmentData?.success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4">
        <div className="w-full max-w-sm bg-white border border-rose-200 rounded-2xl p-6 text-center shadow-xl">
          <p className="text-sm font-medium text-rose-600">
            Failed to load enrollment details.
          </p>
        </div>
      </div>
    );
  }

  const { course, payment } = data.enrollmentData;

  // 💰 Convert paise → rupees
  const formattedAmount = (payment.amount / 100).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blur + dark overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Modal Card */}
      <div className="relative w-full max-w-sm mx-4 bg-white border border-black/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top accent */}
        <div className="h-0.5 bg-black w-full" />

        <div className="p-6 space-y-5">
          {/* Success header */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center shrink-0">
              <CheckCircle className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-sm font-bold text-black tracking-tight">
                Enrollment Successful
              </h2>
              <p className="text-[11px] text-neutral-400 font-medium mt-0.5">
                You&apos;re now enrolled in this course
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-black/10" />

          {/* Course info */}
          <div className="flex gap-3 items-start">
            <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 border border-black/10 shrink-0">
              {course.imageUrl ? (
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <BookOpen
                    className="w-5 h-5 text-neutral-400"
                    strokeWidth={1.5}
                  />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">
                Course
              </p>
              <h3 className="text-sm font-semibold text-black leading-snug line-clamp-2">
                {course.title}
              </h3>
              {course.description && (
                <p className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
                  {course.description}
                </p>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-black/10" />

          {/* Payment stats */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="px-3.5 py-3 rounded-xl bg-neutral-50 border border-black/10">
              <div className="flex items-center gap-1.5 mb-1">
                <IndianRupee
                  className="w-3 h-3 text-neutral-400"
                  strokeWidth={1.8}
                />
                <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider">
                  Amount Paid
                </p>
              </div>
              <p className="text-base font-bold text-black">
                ₹{formattedAmount}
              </p>
            </div>

            <div className="px-3.5 py-3 rounded-xl bg-neutral-50 border border-black/10">
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
                Payment Status
              </p>
              <span className="inline-block text-[11px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border bg-black text-white border-black">
                {payment.status}
              </span>
            </div>
          </div>

          {/* CTA */}
          <Link href="/student/enrolled-courses">
            <button className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-black text-white text-sm font-semibold border border-black hover:bg-black/80 active:bg-black/90 transition-all duration-150">
              Go to My Courses
              <ArrowRight className="w-4 h-4" strokeWidth={2} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentSuccess;

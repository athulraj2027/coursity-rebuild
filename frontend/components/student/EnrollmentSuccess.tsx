"use client";

import React from "react";
import { useMyEnrollmentQuery } from "@/queries/enrollment.queries";
import { Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const EnrollmentSuccess = ({ enrollmentId }: { enrollmentId: string }) => {
  const { isLoading, error, data } = useMyEnrollmentQuery(enrollmentId);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-5 w-5 animate-spin text-black" />
      </div>
    );
  }

  if (error || !data?.enrollmentData?.success) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-red-500 text-sm">
          Failed to load enrollment details.
        </div>
      </div>
    );
  }

  const { course, payment } = data.enrollmentData;

  return (
    <div className="flex justify-center p-6">
      <div className="w-full max-w-xl bg-white border rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="bg-black text-white p-2 rounded-full">
            <CheckCircle className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Enrollment Successful</h2>
            <p className="text-xs text-gray-500">
              You’re enrolled in this course.
            </p>
          </div>
        </div>

        {/* Course */}
        <div className="flex gap-4">
          <img
            src={course.imageUrl}
            alt={course.title}
            className="w-16 h-16 rounded-xl object-cover border"
          />

          <div className="flex-1">
            <h3 className="font-medium text-sm">{course.title}</h3>
            <p className="text-xs text-gray-500 line-clamp-2">
              {course.description}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-2xl p-3">
            <p className="text-xs text-gray-500">Paid</p>
            <p className="font-semibold text-sm">₹{payment.amount}</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-3">
            <p className="text-xs text-gray-500">Status</p>
            <p className="font-semibold text-sm text-green-600">
              {payment.status}
            </p>
          </div>
        </div>

        {/* CTA */}
        <Link href={`/student/enrolled-courses`}>
          <Button className="w-full rounded-xl text-sm">
            Go to your courses
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default EnrollmentSuccess;

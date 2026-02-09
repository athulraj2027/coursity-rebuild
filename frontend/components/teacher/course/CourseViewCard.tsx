"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Separator } from "../../ui/separator";
// import { Button } from "../../ui/button";
import {
  Calendar,
  IndianRupee,
  GraduationCap,
  BookOpen,
  Clock,
  // Edit,
  // Trash2,
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
  teacher: {
    id: string;
    name: string;
    email: string;
  };
  lectures: LectureSummary[];
  enrollments: EnrollmentSummary[];
};

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Main Course Card */}
      <Card className="overflow-hidden">
        {/* Course Image Header */}
        <div className="relative h-64 w-full bg-linear-to-br from-primary/20 to-primary/5">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="w-20 h-20 text-muted-foreground/30" />
            </div>
          )}

          {/* Overlay Badges */}
          <div className="absolute top-4 right-4 flex gap-2">
            <Badge
              variant={isEnrollmentOpen ? "default" : "secondary"}
              className="text-xs"
            >
              {isEnrollmentOpen ? "Enrollment Open" : "Enrollment Closed"}
            </Badge>
            {isDisabled && (
              <Badge variant="destructive" className="text-xs">
                Draft
              </Badge>
            )}
          </div>
        </div>

        <CardHeader className="space-y-4">
          {/* Title and Actions */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2 flex-1">
              <CardTitle className="text-3xl font-bold tracking-tight">
                {title}
              </CardTitle>
              <p className="text-muted-foreground leading-relaxed">
                {description}
              </p>
            </div>
          </div>

          {/* Price Tag */}
          <div className="flex items-center gap-2">
            <div className="text-3xl font-bold text-primary">
              {price === 0 ? "Free" : `₹${price.toLocaleString()}`}
            </div>
            {price > 0 && (
              <span className="text-sm text-muted-foreground">/ course</span>
            )}
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                <span className="text-xs font-medium">Students</span>
              </div>
              <div className="text-2xl font-bold">{enrollments.length}</div>
            </div>

            <div className="space-y-2 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span className="text-xs font-medium">Lectures</span>
              </div>
              <div className="text-2xl font-bold">{lectures.length}</div>
            </div>

            <div className="space-y-2 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span className="text-xs font-medium">Start Date</span>
              </div>
              <div className="text-sm font-semibold">
                {new Date(startDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>

            <div className="space-y-2 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span className="text-xs font-medium">Created</span>
              </div>
              <div className="text-sm font-semibold">
                {new Date(createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
            </div>
          </div>

          <Separator />

          {/* Course Details */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Course Details
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Starts on:</span>
                <span className="font-medium">{formatDate(startDate)}</span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Course Fee:</span>
                <span className="font-medium">
                  {price === 0 ? "Free" : `₹${price.toLocaleString()}`}
                </span>
              </div>
            </div>
          </div>

          {/* Empty States */}
          {lectures.length === 0 && (
            <div className="p-6 border-2 border-dashed rounded-lg text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No lectures added yet
              </p>
            </div>
          )}

          {enrollments.length === 0 && (
            <div className="p-6 border-2 border-dashed rounded-lg text-center">
              <GraduationCap className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No students enrolled yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseViewCard;

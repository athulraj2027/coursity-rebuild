"use client";

import React, { useMemo, useState } from "react";
import Error from "@/components/common/Error";
import Loading from "@/components/common/Loading";
import { useEnrolledCoursesQuery } from "@/queries/courses.queries";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GraduationCap, Calendar, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";

const EnrolledCourses = () => {
  const { isLoading, error, data } = useEnrolledCoursesQuery();
  const router = useRouter();

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  // Flatten data
  const courses = data?.courses.map((e: any) => e.course) ?? [];

  if (courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground mb-2">
          You haven’t enrolled in any courses yet
        </p>
        <Button onClick={() => router.push("/courses")}>Explore Courses</Button>
      </div>
    );
  }

  return (
    <div className="px-7 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">My Courses</h1>
        <div className="text-sm text-muted-foreground">
          {courses.length} {courses.length === 1 ? "course" : "courses"}{" "}
          enrolled
        </div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course: any) => {
          const totalLectures = course.lectures?.length ?? 0;
          const completedLectures =
            course.lectures?.filter((l: any) => l.status === "COMPLETED")
              .length ?? 0;

          const progress =
            totalLectures === 0
              ? 0
              : Math.round((completedLectures / totalLectures) * 100);

          return (
            <Card
              key={course.id}
              className="overflow-hidden rounded-2xl border bg-background hover:shadow-xl transition-all duration-300"
            >
              {/* Hero Section */}
              <div className="relative h-48 w-full bg-gradient-to-br from-muted/40 to-muted/10 flex items-center justify-center">
                {course.imageUrl ? (
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-4xl font-bold text-muted-foreground">
                    {course.title.charAt(0)}
                  </div>
                )}
              </div>

              <CardContent className="p-5 space-y-4">
                {/* Title */}
                <div>
                  <h3 className="text-lg font-semibold leading-tight line-clamp-2">
                    {course.title}
                  </h3>

                  {/* Subtle badge */}
                  <span className="inline-block mt-2 text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
                    Live Course
                  </span>
                </div>

                {/* Description Preview */}
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>

                {/* Meta Row */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{course.teacher?.name}</span>
                  <span>{new Date(course.startDate).toLocaleDateString()}</span>
                </div>

                {/* Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-muted h-1.5 rounded-full">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </CardContent>

              {/* CTA */}
              <div className="px-5 pb-5">
                <Button
                  variant="secondary"
                  className="w-full rounded-xl"
                  onClick={() => router.push(`/student/course/${course.id}`)}
                >
                  Open Course
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default EnrolledCourses;

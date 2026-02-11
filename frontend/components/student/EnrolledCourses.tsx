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
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Image */}
              <div className="relative h-40 w-full bg-linear-to-br from-primary/20 to-primary/5">
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                  }}
                />
              </div>

              <CardHeader className="space-y-2">
                <h3 className="font-bold text-lg line-clamp-2">
                  {course.title}
                </h3>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Teacher */}
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {course.teacher?.name}
                  </span>
                </div>

                {/* Start Date */}
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Started {new Date(course.startDate).toLocaleDateString()}
                  </span>
                </div>

                {/* Progress */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-muted h-2 rounded-full">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Lectures count */}
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {completedLectures}/{totalLectures} lectures completed
                  </span>
                </div>
              </CardContent>

              <CardFooter className="border-t pt-4">
                <Button
                  className="w-full"
                  onClick={() => router.push(`/student/course/${course.id}`)}
                >
                  Go to Course
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default EnrolledCourses;

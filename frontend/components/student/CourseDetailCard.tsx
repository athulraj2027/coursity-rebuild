"use client";

import React from "react";
import { useCourseByIdQueryPublic } from "@/queries/courses.queries";
import Loading from "../common/Loading";
import Error from "../common/Error";

import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Calendar, IndianRupee, GraduationCap, BookOpen } from "lucide-react";
import { Button } from "../ui/button";
import EnrollBtn from "./EnrollBtn";

const CourseDetailCard = ({ courseId }: { courseId: string }) => {
  const { isLoading, error, data } = useCourseByIdQueryPublic(courseId);

  if (isLoading) return <Loading />;
  if (error || !data) return <Error />;

  const {
    title,
    description,
    imageUrl,
    price,
    startDate,
    isEnrollmentOpen,
    teacher,
    _count,
  } = data;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card
        className="group overflow-hidden rounded-3xl border bg-background shadow-sm 
             transition-all duration-500 ease-out 
             hover:shadow-2xl hover:-translate-y-1"
      >
        {/* Hero Section */}
        <div className="relative h-72 w-full overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/5" />

          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-24 w-24 text-muted-foreground/20 transition-all duration-500 group-hover:scale-110" />
            </div>
          )}

          {/* Enrollment Badge */}
          <div className="absolute top-6 right-6">
            <Badge
              className={`rounded-md px-3 py-1 text-xs ${
                isEnrollmentOpen
                  ? "bg-emerald-500 text-white"
                  : "bg-muted text-foreground"
              }`}
            >
              {isEnrollmentOpen ? "Enrollment Open" : "Enrollment Closed"}
            </Badge>
          </div>
        </div>

        <CardHeader className="space-y-5 pt-8">
          <CardTitle className="text-4xl font-bold tracking-tight leading-tight">
            {title}
          </CardTitle>

          <p className="text-muted-foreground text-base leading-relaxed max-w-3xl">
            {description}
          </p>

          {/* Instructor */}
          <div className="text-sm text-muted-foreground">
            Instructor:{" "}
            <span className="font-semibold text-foreground">
              {teacher?.name}
            </span>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3">
            <div className="text-4xl font-bold text-primary">
              {price === 0 ? "Free" : `₹${price.toLocaleString()}`}
            </div>
            {price > 0 && (
              <span className="text-sm text-muted-foreground mb-1">
                one-time payment
              </span>
            )}
          </div>
        </CardHeader>

        <Separator className="opacity-40" />

        <CardContent className="pt-8 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="rounded-2xl bg-muted/40 p-6 transition-all duration-300 hover:bg-muted/60 hover:-translate-y-1">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Lectures
              </div>
              <div className="text-3xl font-bold mt-2">
                {_count?.lectures ?? 0}
              </div>
            </div>

            <div className="rounded-2xl bg-muted/40 p-6 transition-all duration-300 hover:bg-muted/60 hover:-translate-y-1">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Start Date
              </div>
              <div className="text-sm font-semibold mt-2">
                {new Date(startDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>

            <div className="rounded-2xl bg-muted/40 p-6 transition-all duration-300 hover:bg-muted/60 hover:-translate-y-1">
              <div className="text-xs text-muted-foreground uppercase tracking-wide">
                Price
              </div>
              <div className="text-2xl font-bold text-primary mt-2">
                {price === 0 ? "Free" : `₹${price.toLocaleString()}`}
              </div>
            </div>
          </div>

          {/* Enroll Button */}
          <div className="pt-4">
            <EnrollBtn courseId={courseId} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseDetailCard;

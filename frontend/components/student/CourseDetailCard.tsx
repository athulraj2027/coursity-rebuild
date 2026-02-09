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
      <Card className="overflow-hidden">
        {/* Image */}
        <div className="relative h-64 w-full bg-linear-to-br from-primary/20 to-primary/5">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-20 w-20 text-muted-foreground/30" />
            </div>
          )}

          <div className="absolute top-4 right-4">
            <Badge variant={isEnrollmentOpen ? "default" : "secondary"}>
              {isEnrollmentOpen ? "Enrollment Open" : "Enrollment Closed"}
            </Badge>
          </div>
        </div>

        <CardHeader className="space-y-4">
          <CardTitle className="text-3xl font-bold tracking-tight">
            {title}
          </CardTitle>

          <p className="text-muted-foreground leading-relaxed">{description}</p>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="h-4 w-4" />
            <span>Instructor:</span>
            <span className="font-medium text-foreground">{teacher?.name}</span>
          </div>

          {/* Price */}
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
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <BookOpen className="h-4 w-4" />
                Lectures completed
              </div>
              <div className="text-2xl font-bold">{_count?.lectures ?? 0}</div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Calendar className="h-4 w-4" />
                Start Date
              </div>
              <div className="text-sm font-semibold">
                {new Date(startDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-muted/50 space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <IndianRupee className="h-4 w-4" />
                Price
              </div>
              <div className="text-lg font-bold text-primary">
                {price === 0 ? "Free" : `₹${price.toLocaleString()}`}
              </div>
            </div>
          </div>
          <Button>Enroll now</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseDetailCard;

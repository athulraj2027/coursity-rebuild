"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, Video, BookOpen, Users } from "lucide-react";
import { useMyLectureQueryById } from "@/queries/lectures.queries";
import Loading from "@/components/common/Loading";
import Error from "@/components/common/Error";

const statusColorMap: Record<
  "NOT_STARTED" | "STARTED" | "COMPLETED",
  "secondary" | "default" | "outline"
> = {
  NOT_STARTED: "secondary",
  STARTED: "default",
  COMPLETED: "outline",
};

const LectureViewCard = ({ lectureId }: { lectureId: string }) => {
  const { isLoading, error, data } = useMyLectureQueryById(lectureId);

  if (isLoading) return <Loading />;
  if (error || !data) return <Error />;

  const { title, startTime, status, meetingId, createdAt, course, attendance } =
    data;

  const formatDateTime = (date: string) =>
    new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card>
        <CardHeader className="space-y-4">
          {/* Title + Status */}
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold">{title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span>{course.title}</span>
              </div>
            </div>

            <Badge variant={statusColorMap[status]}>
              {status.replace("_", " ")}
            </Badge>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6 space-y-6">
          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Scheduled Time</span>
              </div>
              <div className="text-sm font-semibold">
                {formatDateTime(startTime)}
              </div>
            </div>

            <div className="space-y-1 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Created</span>
              </div>
              <div className="text-sm font-semibold">
                {formatDateTime(createdAt)}
              </div>
            </div>

            <div className="space-y-1 p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>Attendance Records</span>
              </div>
              <div className="text-sm font-semibold">{attendance.length}</div>
            </div>
          </div>

          <Separator />

          {/* Live State */}
          <div className="flex items-center gap-3 text-sm">
            <Video className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Meeting Status:</span>
            <span className="font-medium">
              {meetingId ? "Live / Started" : "Not started yet"}
            </span>
          </div>

          {/* Action Placeholder */}
          <div className="pt-2 text-sm text-muted-foreground italic">
            Actions (Start / Join) will appear here when realtime is enabled
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LectureViewCard;

"use client";

import React, { useMemo, useState } from "react";
import { useScheduledLecturesQuery } from "@/queries/lectures.queries";
import Error from "@/components/common/Error";
import Loading from "@/components/common/Loading";

import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Calendar,
  GraduationCap,
  Video,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type SortOption = "date-asc" | "date-desc" | "status";

const ITEMS_PER_PAGE = 6;

export default function LecturesPage() {
  const { isLoading, data, error } = useScheduledLecturesQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("date-asc");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "upcoming" | "completed" | "live"
  >("all");
  const [currentPage, setCurrentPage] = useState(1);

  const lectures = data?.lectures ?? [];

  // 🔍 FILTER + SEARCH
  const filteredLectures = useMemo(() => {
    let result = [...lectures];

    // Search
    if (searchQuery) {
      result = result.filter(
        (lecture: any) =>
          lecture.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lecture.course.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          lecture.course.teacher.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    // Status filter
    const now = new Date();

    if (statusFilter !== "all") {
      result = result.filter((lecture: any) => {
        const startTime = new Date(lecture.startTime);

        if (statusFilter === "upcoming") {
          return startTime > now && lecture.status === "NOT_STARTED";
        }

        if (statusFilter === "completed") {
          return lecture.status === "COMPLETED";
        }

        if (statusFilter === "live") {
          return lecture.status === "STARTED";
        }

        return true;
      });
    }

    return result;
  }, [lectures, searchQuery, statusFilter]);

  // 🔃 SORT
  const sortedLectures = useMemo(() => {
    const sorted = [...filteredLectures];

    sorted.sort((a: any, b: any) => {
      if (sortOption === "date-asc") {
        return (
          new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
        );
      }

      if (sortOption === "date-desc") {
        return (
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );
      }

      if (sortOption === "status") {
        return a.status.localeCompare(b.status);
      }

      return 0;
    });

    return sorted;
  }, [filteredLectures, sortOption]);

  // 📄 Pagination
  const totalPages = Math.ceil(sortedLectures.length / ITEMS_PER_PAGE);
  const paginatedData = sortedLectures.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOption, statusFilter]);

  if (isLoading) return <Loading />;
  if (error) return <Error />;
  return (
    <div className="px-7 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">My Lectures</h1>
        <div className="text-sm text-muted-foreground">
          {sortedLectures.length} lectures
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search lectures, courses, teachers..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <Select
          value={statusFilter}
          onValueChange={(value: any) => setStatusFilter(value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="live">Live</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select
          value={sortOption}
          onValueChange={(value: SortOption) => setSortOption(value)}
        >
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date-asc">Date (Old → New)</SelectItem>
            <SelectItem value="date-desc">Date (New → Old)</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Lecture Grid */}
      {paginatedData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No lectures found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedData.map((lecture: any) => {
              const startTime = new Date(lecture.startTime);
              const now = new Date();
              const isUpcoming = startTime > now;

              return (
                <Card
                  key={lecture.id}
                  className="group overflow-hidden rounded-2xl border bg-background hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <CardContent className="p-5 space-y-4">
                    {/* Top Row */}
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-semibold leading-snug line-clamp-2">
                        {lecture.title}
                      </h3>

                      {/* Status Badge */}
                      {lecture.status === "STARTED" && (
                        <Badge className="bg-emerald-500 text-white text-xs rounded-md">
                          Live
                        </Badge>
                      )}
                      {lecture.status === "NOT_STARTED" && isUpcoming && (
                        <Badge
                          variant="secondary"
                          className="text-xs rounded-md"
                        >
                          Upcoming
                        </Badge>
                      )}
                      {lecture.status === "COMPLETED" && (
                        <Badge variant="outline" className="text-xs rounded-md">
                          Completed
                        </Badge>
                      )}
                    </div>

                    {/* Course + Teacher */}
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>{lecture.course.title}</div>
                      <div>{lecture.course.teacher.name}</div>
                    </div>

                    {/* Date */}
                    <div className="text-xs text-muted-foreground">
                      {startTime.toLocaleString()}
                    </div>
                  </CardContent>

                  {/* CTA */}
                  <div className="px-5 pb-5">
                    <Button
                      variant={
                        lecture.status === "STARTED" ? "default" : "secondary"
                      }
                      className="w-full rounded-xl"
                      disabled={lecture.status === "NOT_STARTED"}
                      onClick={() => {
                        if (lecture.status === "STARTED") {
                          window.open(`/lecture/${lecture.id}`, "_blank");
                        }
                      }}
                    >
                      {lecture.status === "STARTED"
                        ? "Join Live Session"
                        : lecture.status === "COMPLETED"
                          ? "View Recording"
                          : "Starts Soon"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>

              <Button
                variant="outline"
                size="icon"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

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
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <h3 className="font-bold text-lg line-clamp-2">
                      {lecture.title}
                    </h3>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Course */}
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {lecture.course.title}
                      </span>
                    </div>

                    {/* Teacher */}
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {lecture.course.teacher.name}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {startTime.toLocaleString()}
                      </span>
                    </div>

                    {/* Status Badge */}
                    <div>
                      {lecture.status === "STARTED" && (
                        <Badge className="bg-green-600">Live</Badge>
                      )}
                      {lecture.status === "NOT_STARTED" && isUpcoming && (
                        <Badge variant="secondary">Upcoming</Badge>
                      )}
                      {lecture.status === "COMPLETED" && (
                        <Badge variant="outline">Completed</Badge>
                      )}
                    </div>
                  </CardContent>

                  <CardFooter className="border-t pt-4">
                    <Button
                      className="w-full"
                      onClick={() => {
                        if (lecture.status === "STARTED") {
                          window.open(`/lecture/${lecture.id}`, "_blank");
                        }
                      }}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      {lecture.status === "STARTED"
                        ? "Join Now"
                        : lecture.status === "COMPLETED"
                          ? "View Details"
                          : "Not Started"}
                    </Button>
                  </CardFooter>
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

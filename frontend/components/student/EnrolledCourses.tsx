"use client";

import React, { useMemo, useState } from "react";
import Error from "@/components/common/Error";
import Loading from "@/components/common/Loading";
import { useEnrolledCoursesQuery } from "@/queries/courses.queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BookOpen, Search, SlidersHorizontal, X } from "lucide-react";
import { useRouter } from "next/navigation";

type Lecture = { id: string; status: string };
type Course = {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  price: number;
  startDate: string;
  teacher?: { name: string };
  lectures?: Lecture[];
};

type SortOption =
  | "newest"
  | "oldest"
  | "name-asc"
  | "name-desc"
  | "progress-high"
  | "progress-low";
type FilterOptions = {
  progress: "all" | "not-started" | "in-progress" | "completed";
};

/* ─── Helpers ─────────────────────────────────────────────────────────────── */
const getPct = (course: Course) => {
  const total = course.lectures?.length ?? 0;
  const done =
    course.lectures?.filter((l) => l.status === "COMPLETED").length ?? 0;
  return total === 0 ? 0 : Math.round((done / total) * 100);
};

/* ─── Course Card ─────────────────────────────────────────────────────────── */
const CourseCard = ({ course }: { course: Course }) => {
  const router = useRouter();
  const total = course.lectures?.length ?? 0;
  const done =
    course.lectures?.filter((l) => l.status === "COMPLETED").length ?? 0;
  const pct = getPct(course);

  const progressLabel =
    total === 0
      ? "No lectures"
      : pct === 100
        ? "Completed"
        : pct === 0
          ? "Not started"
          : "In progress";

  const progressBadgeStyle =
    pct === 100
      ? "bg-black text-white border-black"
      : pct === 0
        ? "bg-neutral-100 text-neutral-500 border-neutral-200"
        : "bg-neutral-900 text-neutral-300 border-neutral-700";

  return (
    <div className="group bg-white border border-black/8 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col">
      {/* Thumbnail */}
      <div className="relative h-32 w-full bg-neutral-100 flex items-center justify-center overflow-hidden shrink-0">
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
          <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" strokeWidth={1.5} />
          </div>
        )}
        <span
          className={`absolute top-2.5 right-2.5 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${progressBadgeStyle}`}
        >
          {progressLabel}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2.5 flex-1">
        <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider truncate">
          {course.teacher?.name ?? "Unknown Teacher"}
        </p>

        <h3 className="text-sm font-semibold text-black leading-snug line-clamp-2">
          {course.title}
        </h3>

        {course.description && (
          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        )}

        {/* Progress bar */}
        <div className="mt-auto pt-2">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">
              Progress
            </span>
            <span className="text-[10px] font-semibold text-black">
              {total === 0 ? "No lectures" : `${done} / ${total}`}
            </span>
          </div>
          <div className="h-1 rounded-full bg-neutral-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-black transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Meta footer */}
        <div className="flex items-center justify-between pt-2 border-t border-black/5">
          <span className="text-[11px] text-neutral-400 font-medium">
            {new Date(course.startDate).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="text-[11px] font-semibold text-black">
            {course.price === 0 ? "Free" : `₹${course.price.toLocaleString()}`}
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <Button
          onClick={() => router.push(`/student/course/${course.id}`)}
          className="w-full bg-black text-white hover:bg-black/80 rounded-xl text-xs h-8"
        >
          Open Course
        </Button>
      </div>
    </div>
  );
};

/* ─── Main Page ───────────────────────────────────────────────────────────── */
const EnrolledCourses = () => {
  const { isLoading, error, data } = useEnrolledCoursesQuery();
  const router = useRouter();

  // ✅ All hooks declared before any early returns
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [filters, setFilters] = useState<FilterOptions>({ progress: "all" });
  const [showFilters, setShowFilters] = useState(false);

  const allCourses: Course[] = useMemo(
    () => data?.courses.map((e: any) => e.course) ?? [],
    [data],
  );

  const processedData = useMemo(() => {
    let filtered = [...allCourses];

    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.teacher?.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (filters.progress !== "all") {
      filtered = filtered.filter((c) => {
        const pct = getPct(c);
        switch (filters.progress) {
          case "not-started":
            return pct === 0;
          case "in-progress":
            return pct > 0 && pct < 100;
          case "completed":
            return pct === 100;
          default:
            return true;
        }
      });
    }

    filtered.sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return (
            new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
          );
        case "oldest":
          return (
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          );
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        case "progress-high":
          return getPct(b) - getPct(a);
        case "progress-low":
          return getPct(a) - getPct(b);
        default:
          return 0;
      }
    });

    return filtered;
  }, [allCourses, searchQuery, sortOption, filters]);

  const hasActiveFilters = filters.progress !== "all" || searchQuery !== "";
  const clearFilters = () => {
    setSearchQuery("");
    setFilters({ progress: "all" });
  };

  // ✅ Early returns AFTER all hooks
  if (isLoading) return <Loading />;
  if (error) return <Error />;

  if (allCourses.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="mb-8">
            <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-2">
              Student Portal
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black">
              Enrolled Courses
            </h1>
          </div>
          <div className="flex flex-col items-center justify-center h-56 border border-dashed border-black/15 rounded-2xl bg-white">
            <p className="text-sm font-medium text-neutral-400 mb-3">
              You haven&apos;t enrolled in any courses yet
            </p>
            <Button
              onClick={() => router.push("/courses")}
              className="bg-black text-white hover:bg-black/80 rounded-xl text-xs h-8 px-4"
            >
              Explore Courses
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-2">
            Student Portal
          </p>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-black">
                My Courses
              </h1>
              <p className="text-sm text-neutral-400 font-medium mt-1">
                Track your progress across enrolled courses
              </p>
            </div>
            <span className="text-xs text-neutral-400 font-medium shrink-0">
              <span className="text-black font-semibold">
                {processedData.length}
              </span>{" "}
              of{" "}
              <span className="text-black font-semibold">
                {allCourses.length}
              </span>{" "}
              courses
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search courses or teachers..."
              className="pl-10 bg-white border-black/10 rounded-xl focus-visible:ring-black/20 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select
            value={sortOption}
            onValueChange={(v: SortOption) => setSortOption(v)}
          >
            <SelectTrigger className="w-48 bg-white border-black/10 rounded-xl text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name-asc">Name (A–Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z–A)</SelectItem>
              <SelectItem value="progress-high">Progress (High–Low)</SelectItem>
              <SelectItem value="progress-low">Progress (Low–High)</SelectItem>
            </SelectContent>
          </Select>

          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="gap-2 bg-white border-black/10 rounded-xl text-sm hover:bg-neutral-50"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {hasActiveFilters && (
                  <Badge className="ml-1 px-1.5 min-w-5 h-5 bg-black text-white text-[10px] rounded-full">
                    {[
                      filters.progress !== "all" ? 1 : 0,
                      searchQuery ? 1 : 0,
                    ].reduce((a, b) => a + b, 0)}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-64 rounded-2xl border-black/10 shadow-xl"
              align="end"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-black">Filters</h4>
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="h-auto p-0 text-xs text-neutral-400 hover:text-black"
                    >
                      Clear all
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Progress
                  </label>
                  <Select
                    value={filters.progress}
                    onValueChange={(v: FilterOptions["progress"]) =>
                      setFilters((p) => ({ ...p, progress: v }))
                    }
                  >
                    <SelectTrigger className="rounded-xl border-black/10 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="not-started">Not Started</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="gap-2 text-neutral-400 hover:text-black rounded-xl"
            >
              <X className="h-4 w-4" />
              Clear
            </Button>
          )}
        </div>

        {/* No results from filter */}
        {processedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-56 border border-dashed border-black/15 rounded-2xl bg-white">
            <p className="text-sm font-medium text-neutral-400 mb-3">
              No courses match your filters
            </p>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-black underline text-xs"
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {processedData.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledCourses;

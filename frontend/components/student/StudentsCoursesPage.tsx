"use client";

import { useAllCoursesQueryPublic } from "@/queries/courses.queries";
import React, { useMemo, useState } from "react";
import Loading from "../common/Loading";
import Error from "../common/Error";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Badge } from "../ui/badge";
import {
  Search,
  SlidersHorizontal,
  X,
  Users,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import Modal from "../common/Modal";
import CourseDetailCard from "./CourseDetailCard";

type Course = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  startDate: string;
  teacher: { id: string; name: string };
  _count: { enrollments: number };
  createdAt: string;
};

type SortOption =
  | "newest"
  | "oldest"
  | "price-low"
  | "price-high"
  | "popular"
  | "name-asc"
  | "name-desc";

type FilterOptions = {
  priceRange:
    | "all"
    | "free"
    | "paid"
    | "under1000"
    | "1000to5000"
    | "above5000";
  startDate: "all" | "upcoming" | "this-week" | "this-month";
};

const ITEMS_PER_PAGE = 9;

/* ─── Course Card ─────────────────────────────────────────────────────────── */
const CourseCard = ({
  course,
  onView,
}: {
  course: Course;
  onView: () => void;
}) => {
  const startDate = new Date(course.startDate);

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
        {/* Price badge */}
        <span
          className={`absolute top-2.5 right-2.5 text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full border ${
            course.price === 0
              ? "bg-black text-white border-black"
              : "bg-white text-black border-black/15"
          }`}
        >
          {course.price === 0 ? "Free" : `₹${course.price.toLocaleString()}`}
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2.5 flex-1">
        {/* Teacher */}
        <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider truncate">
          {course.teacher.name}
        </p>

        {/* Title */}
        <h3 className="text-sm font-semibold text-black leading-snug line-clamp-2">
          {course.title}
        </h3>

        {/* Description */}
        {course.description && (
          <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        )}

        {/* Meta footer */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-black/5">
          <div className="flex items-center gap-1 text-neutral-400">
            <Users className="w-3 h-3" strokeWidth={1.8} />
            <span className="text-[11px] font-medium">
              {course._count.enrollments} student
              {course._count.enrollments !== 1 ? "s" : ""}
            </span>
          </div>
          <span className="text-[11px] text-neutral-400 font-medium">
            {startDate.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* CTA */}
      <div className="px-4 pb-4">
        <Button
          onClick={onView}
          className="w-full bg-green-500 text-white hover:bg-green-400 rounded-xl text-xs h-8"
        >
          View Course
        </Button>
      </div>
    </div>
  );
};

/* ─── Main Page ───────────────────────────────────────────────────────────── */
const StudentsCoursesPage = () => {
  const { isLoading, error, data } = useAllCoursesQueryPublic();

  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: "all",
    startDate: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const filterData = (courses: Course[]): Course[] => {
    let filtered = [...courses];
    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.teacher.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    if (filters.priceRange !== "all") {
      filtered = filtered.filter((c) => {
        switch (filters.priceRange) {
          case "free":
            return c.price === 0;
          case "paid":
            return c.price > 0;
          case "under1000":
            return c.price > 0 && c.price < 1000;
          case "1000to5000":
            return c.price >= 1000 && c.price <= 5000;
          case "above5000":
            return c.price > 5000;
          default:
            return true;
        }
      });
    }
    if (filters.startDate !== "all") {
      const now = new Date();
      filtered = filtered.filter((c) => {
        const diffDays = Math.ceil(
          (new Date(c.startDate).getTime() - now.getTime()) / 86400000,
        );
        switch (filters.startDate) {
          case "upcoming":
            return diffDays > 0;
          case "this-week":
            return diffDays >= 0 && diffDays <= 7;
          case "this-month":
            return diffDays >= 0 && diffDays <= 30;
          default:
            return true;
        }
      });
    }
    return filtered;
  };

  const sortData = (courses: Course[]): Course[] =>
    [...courses].sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "popular":
          return b._count.enrollments - a._count.enrollments;
        case "name-asc":
          return a.title.localeCompare(b.title);
        case "name-desc":
          return b.title.localeCompare(a.title);
        default:
          return 0;
      }
    });

  const processedData = useMemo(() => {
    if (!data) return [];
    return sortData(filterData(data));
  }, [data, searchQuery, sortOption, filters]);

  const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);
  const paginatedData = processedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOption, filters]);

  const hasActiveFilters =
    filters.priceRange !== "all" ||
    filters.startDate !== "all" ||
    searchQuery !== "";
  const clearFilters = () => {
    setSearchQuery("");
    setFilters({ priceRange: "all", startDate: "all" });
  };

  if (isLoading) return <Loading />;
  if (error) return <Error />;

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
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-green-400">
                Explore Courses
              </h1>
              <p className="text-sm text-neutral-400 font-medium mt-1">
                Discover and enroll in courses that match your goals
              </p>
            </div>
            <span className="text-xs text-neutral-400 font-medium shrink-0">
              <span className="text-black font-semibold">
                {processedData.length}
              </span>{" "}
              {processedData.length === 1 ? "course" : "courses"} available
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
            <Input
              placeholder="Search courses, teachers..."
              className="pl-10 bg-white border-black/10 rounded-xl focus-visible:ring-black/20 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select
            value={sortOption}
            onValueChange={(v: SortOption) => setSortOption(v)}
          >
            <SelectTrigger className="w-44 bg-white border-black/10 rounded-xl text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="name-asc">Name (A–Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z–A)</SelectItem>
              <SelectItem value="price-low">Price (Low–High)</SelectItem>
              <SelectItem value="price-high">Price (High–Low)</SelectItem>
              <SelectItem value="popular">Most Popular</SelectItem>
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
                      filters.priceRange !== "all" ? 1 : 0,
                      filters.startDate !== "all" ? 1 : 0,
                      searchQuery ? 1 : 0,
                    ].reduce((a, b) => a + b, 0)}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-72 rounded-2xl border-black/10 shadow-xl"
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
                    Price Range
                  </label>
                  <Select
                    value={filters.priceRange}
                    onValueChange={(v: FilterOptions["priceRange"]) =>
                      setFilters((p) => ({ ...p, priceRange: v }))
                    }
                  >
                    <SelectTrigger className="rounded-xl border-black/10 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="free">Free</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="under1000">Under ₹1,000</SelectItem>
                      <SelectItem value="1000to5000">
                        ₹1,000 – ₹5,000
                      </SelectItem>
                      <SelectItem value="above5000">Above ₹5,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                    Start Date
                  </label>
                  <Select
                    value={filters.startDate}
                    onValueChange={(v: FilterOptions["startDate"]) =>
                      setFilters((p) => ({ ...p, startDate: v }))
                    }
                  >
                    <SelectTrigger className="rounded-xl border-black/10 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Dates</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="this-week">This Week</SelectItem>
                      <SelectItem value="this-month">This Month</SelectItem>
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

        {/* Empty State */}
        {paginatedData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-56 border border-dashed border-black/15 rounded-2xl bg-white">
            <p className="text-sm font-medium text-neutral-400 mb-3">
              No courses found
            </p>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-black underline text-xs"
              >
                Clear filters to see all courses
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedData.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onView={() => setSelectedCourseId(course.id)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-8">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-xl border-black/10 bg-white w-8 h-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          size="icon"
                          onClick={() => setCurrentPage(page)}
                          className={`rounded-xl w-8 h-8 text-xs font-semibold ${
                            currentPage === page
                              ? "bg-black text-white border-black"
                              : "bg-white text-black border border-black/10 hover:bg-neutral-50"
                          }`}
                        >
                          {page}
                        </Button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span
                          key={page}
                          className="text-neutral-400 text-sm px-1"
                        >
                          …
                        </span>
                      );
                    }
                    return null;
                  },
                )}

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-xl border-black/10 bg-white w-8 h-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {selectedCourseId && (
        <Modal
          Card={<CourseDetailCard courseId={selectedCourseId} />}
          setModal={() => setSelectedCourseId(null)}
        />
      )}
    </div>
  );
};

export default StudentsCoursesPage;

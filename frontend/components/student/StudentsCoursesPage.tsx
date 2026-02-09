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
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import {
  Search,
  SlidersHorizontal,
  X,
  GraduationCap,
  Calendar,
  IndianRupee,
  ChevronLeft,
  ChevronRight,
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
  teacher: {
    id: string;
    name: string;
  };
  _count: {
    enrollments: number;
  };
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

const StudentsCoursesPage = () => {
  const { isLoading, error, data } = useAllCoursesQueryPublic();

  const [modal, setModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: "all",
    startDate: "all",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter function
  const filterData = (courses: Course[]): Course[] => {
    let filtered = [...courses];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          course.teacher.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Price range filter
    if (filters.priceRange !== "all") {
      filtered = filtered.filter((course) => {
        switch (filters.priceRange) {
          case "free":
            return course.price === 0;
          case "paid":
            return course.price > 0;
          case "under1000":
            return course.price > 0 && course.price < 1000;
          case "1000to5000":
            return course.price >= 1000 && course.price <= 5000;
          case "above5000":
            return course.price > 5000;
          default:
            return true;
        }
      });
    }

    // Start date filter
    if (filters.startDate !== "all") {
      const now = new Date();
      filtered = filtered.filter((course) => {
        const startDate = new Date(course.startDate);
        const diffTime = startDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

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

  // Sort function
  const sortData = (courses: Course[]): Course[] => {
    const sorted = [...courses];

    sorted.sort((a, b) => {
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

    return sorted;
  };

  // Process data
  const processedData = useMemo(() => {
    if (!data) return [];
    const filtered = filterData(data);
    return sortData(filtered);
  }, [data, searchQuery, sortOption, filters]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / ITEMS_PER_PAGE);
  const paginatedData = processedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortOption, filters]);

  // Check if any filters are active
  const hasActiveFilters =
    filters.priceRange !== "all" ||
    filters.startDate !== "all" ||
    searchQuery !== "";

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setFilters({
      priceRange: "all",
      startDate: "all",
    });
  };

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <div className="px-7 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold">Explore Courses</h1>
        <div className="text-sm text-muted-foreground">
          {processedData.length}{" "}
          {processedData.length === 1 ? "course" : "courses"} available
        </div>
      </div>

      {/* Search, Filter, and Sort Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-62.5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses, teachers..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Sort */}
        <Select
          value={sortOption}
          onValueChange={(value: SortOption) => setSortOption(value)}
        >
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="price-low">Price (Low-High)</SelectItem>
            <SelectItem value="price-high">Price (High-Low)</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>

        {/* Filters Popover */}
        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-1 px-1 min-w-5">
                  {[
                    filters.priceRange !== "all" ? 1 : 0,
                    filters.startDate !== "all" ? 1 : 0,
                    searchQuery ? 1 : 0,
                  ].reduce((a, b) => a + b, 0)}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Filters</h4>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-auto p-0 text-xs"
                  >
                    Clear all
                  </Button>
                )}
              </div>

              {/* Price Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Price Range</label>
                <Select
                  value={filters.priceRange}
                  onValueChange={(value: FilterOptions["priceRange"]) =>
                    setFilters((prev) => ({ ...prev, priceRange: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="under1000">Under ₹1,000</SelectItem>
                    <SelectItem value="1000to5000">₹1,000 - ₹5,000</SelectItem>
                    <SelectItem value="above5000">Above ₹5,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Start Date Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Start Date</label>
                <Select
                  value={filters.startDate}
                  onValueChange={(value: FilterOptions["startDate"]) =>
                    setFilters((prev) => ({ ...prev, startDate: value }))
                  }
                >
                  <SelectTrigger>
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

        {/* Clear filters button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-2"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      {/* Course Grid */}
      {paginatedData.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-2">No courses found</p>
          {hasActiveFilters && (
            <Button variant="link" onClick={clearFilters}>
              Clear filters to see all courses
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedData.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                modal={modal}
                setModal={setModal}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="icon"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      );
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <span key={page} className="px-2">
                          ...
                        </span>
                      );
                    }
                    return null;
                  },
                )}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Course Card Component
const CourseCard = ({
  course,
  setModal,
  modal,
}: {
  course: Course;
  modal: boolean;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [courseId, setCourseId] = useState<string | null>(null);
  const startDate = new Date(course.startDate);
  const isUpcoming = startDate > new Date();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      {/* Course Image */}
      <div className="relative h-48 w-full bg-linear-to-br from-primary/20 to-primary/5">
        <img
          src={course.imageUrl}
          alt={course.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
        {course.price === 0 && (
          <Badge className="absolute top-3 right-3 bg-green-600">Free</Badge>
        )}
      </div>

      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-lg line-clamp-2">{course.title}</h3>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Teacher */}
        <div className="flex items-center gap-2 text-sm">
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{course.teacher.name}</span>
        </div>

        {/* Start Date */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            Starts{" "}
            {startDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          {isUpcoming && (
            <Badge variant="secondary" className="text-xs">
              Upcoming
            </Badge>
          )}
        </div>

        {/* Students Enrolled */}
        <div className="flex items-center gap-2 text-sm">
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">
            {course._count.enrollments}{" "}
            {course._count.enrollments === 1 ? "student" : "students"} enrolled
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t pt-4">
        <div className="flex items-center gap-1">
          <IndianRupee className="h-5 w-5 text-primary" />
          <span className="text-2xl font-bold text-primary">
            {course.price === 0 ? "Free" : course.price.toLocaleString()}
          </span>
        </div>
        <Button
          onClick={() => {
            setModal(true);
            setCourseId(course.id);
          }}
        >
          View Details
        </Button>
      </CardFooter>
      {modal && courseId && (
        <Modal
          Card={<CourseDetailCard courseId={courseId} />}
          setModal={setModal}
        />
      )}
    </Card>
  );
};

export default StudentsCoursesPage;

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import { DataTable } from "../../common/Table";
import { Button } from "../../ui/button";
import { Plus, Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "../../ui/input";
import Modal from "../../common/Modal";
import NewCourseCard from "./NewCourseCard";
import CourseActions from "./CourseActions";
import { useMyCoursesQuery } from "@/queries/courses.queries";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";
import Loading from "../../common/Loading";
import Error from "../../common/Error";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Badge } from "../../ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

type CourseTableRow = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  students: number;
  createdAt: string;
  updatedAt: string;
  rawCreatedAt: Date;
  rawUpdatedAt: Date;
};

type SortOption = {
  field: "name" | "price" | "students" | "createdAt" | "updatedAt";
  direction: "asc" | "desc";
};

type FilterOptions = {
  priceRange:
    | "all"
    | "free"
    | "paid"
    | "under1000"
    | "1000to5000"
    | "above5000";
  studentRange: "all" | "none" | "1to10" | "11to50" | "above50";
  dateRange: "all" | "today" | "week" | "month" | "year";
};

const Label = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <label className={className}>{children}</label>;

const MyCoursesPage = () => {
  const { isLoading, data, error } = useMyCoursesQuery();
  const [modal, setModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>({
    field: "createdAt",
    direction: "desc",
  });
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: "all",
    studentRange: "all",
    dateRange: "all",
  });
  const [showFilters, setShowFilters] = useState(false);

  React.useEffect(() => {
    if (error) {
      toast.error("Failed to fetch courses");
    }
  }, [error]);

  const tableData: CourseTableRow[] = useMemo(() => {
    if (!data) return [];
    return data.map((course: any) => ({
      id: course.id,
      name: course.title,
      imageUrl: course.imageUrl || "/placeholder-course.jpg",
      price: course.price,
      students: course.enrollments?.length ?? 0,
      createdAt: new Date(course.createdAt).toLocaleDateString(),
      updatedAt: new Date(course.updatedAt).toLocaleDateString(),
      rawCreatedAt: new Date(course.createdAt),
      rawUpdatedAt: new Date(course.updatedAt),
    }));
  }, [data]);

  const filterData = (data: CourseTableRow[]): CourseTableRow[] => {
    let filtered = [...data];
    if (searchQuery) {
      filtered = filtered.filter((course) =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
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
    if (filters.studentRange !== "all") {
      filtered = filtered.filter((course) => {
        switch (filters.studentRange) {
          case "none":
            return course.students === 0;
          case "1to10":
            return course.students >= 1 && course.students <= 10;
          case "11to50":
            return course.students >= 11 && course.students <= 50;
          case "above50":
            return course.students > 50;
          default:
            return true;
        }
      });
    }
    if (filters.dateRange !== "all") {
      const now = new Date();
      filtered = filtered.filter((course) => {
        const diffDays = Math.ceil(
          Math.abs(now.getTime() - course.rawCreatedAt.getTime()) /
            (1000 * 60 * 60 * 24),
        );
        switch (filters.dateRange) {
          case "today":
            return diffDays <= 1;
          case "week":
            return diffDays <= 7;
          case "month":
            return diffDays <= 30;
          case "year":
            return diffDays <= 365;
          default:
            return true;
        }
      });
    }
    return filtered;
  };

  const sortData = (data: CourseTableRow[]): CourseTableRow[] => {
    return [...data].sort((a, b) => {
      let aValue: any, bValue: any;
      switch (sortOption.field) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "price":
          aValue = a.price;
          bValue = b.price;
          break;
        case "students":
          aValue = a.students;
          bValue = b.students;
          break;
        case "createdAt":
          aValue = a.rawCreatedAt.getTime();
          bValue = b.rawCreatedAt.getTime();
          break;
        case "updatedAt":
          aValue = a.rawUpdatedAt.getTime();
          bValue = b.rawUpdatedAt.getTime();
          break;
        default:
          return 0;
      }
      if (aValue < bValue) return sortOption.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOption.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const processedData = useMemo(() => {
    return sortData(filterData(tableData));
  }, [tableData, searchQuery, sortOption, filters]);

  const hasActiveFilters =
    filters.priceRange !== "all" ||
    filters.studentRange !== "all" ||
    filters.dateRange !== "all" ||
    searchQuery !== "";

  const clearFilters = () => {
    setSearchQuery("");
    setFilters({ priceRange: "all", studentRange: "all", dateRange: "all" });
  };

  const columns: ColumnDef<CourseTableRow>[] = useMemo(
    () => [
      {
        id: "serial",
        header: "SI.No",
        cell: ({ row }) => row.index + 1,
      },
      {
        accessorKey: "name",
        header: "Course",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <img
              src={row.original.imageUrl}
              alt={row.original.name}
              className="h-10 w-14 rounded-md object-cover border"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/placeholder-course.jpg";
              }}
            />
            <span className="font-medium">{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: "price",
        header: "Price",
        cell: ({ getValue }) => {
          const price = getValue<number>();
          return price === 0 ? "Free" : `₹${price.toLocaleString()}`;
        },
      },
      { accessorKey: "students", header: "Students" },
      { accessorKey: "createdAt", header: "Created" },
      { accessorKey: "updatedAt", header: "Updated" },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <CourseActions courseId={row.original.id} />,
      },
    ],
    [],
  );

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Subtle grid background */}

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-2">
            Teacher Portal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-blue-500">
            My Courses
          </h1>
          <p className="text-sm text-neutral-400 font-medium mt-1">
            Manage and track all your published courses
          </p>
        </div>

        {/* Empty state */}
        {!data || data.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border border-dashed border-black/15 rounded-2xl bg-white">
            <p className="text-neutral-400 text-sm font-medium mb-4">
              No courses yet
            </p>
            <Button
              onClick={() => setModal(true)}
              className="bg-black text-white hover:bg-black/80 rounded-xl gap-2"
            >
              Create Your First Course <Plus className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {/* Search */}
              <div className="relative flex-1 min-w-62.5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder="Search courses..."
                  className="pl-10 bg-white border-black/10 rounded-xl focus-visible:ring-black/20 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Sort */}
              <Select
                value={`${sortOption.field}-${sortOption.direction}`}
                onValueChange={(value) => {
                  const [field, direction] = value.split("-") as [
                    SortOption["field"],
                    SortOption["direction"],
                  ];
                  setSortOption({ field, direction });
                }}
              >
                <SelectTrigger className="w-44 bg-white border-black/10 rounded-xl text-sm">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Newest First</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  <SelectItem value="name-asc">Name (A–Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z–A)</SelectItem>
                  <SelectItem value="price-asc">Price (Low–High)</SelectItem>
                  <SelectItem value="price-desc">Price (High–Low)</SelectItem>
                  <SelectItem value="students-desc">Most Students</SelectItem>
                  <SelectItem value="students-asc">Least Students</SelectItem>
                </SelectContent>
              </Select>

              {/* Filters Popover */}
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
                          filters.studentRange !== "all" ? 1 : 0,
                          filters.dateRange !== "all" ? 1 : 0,
                          searchQuery ? 1 : 0,
                        ].reduce((a, b) => a + b, 0)}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-80 rounded-2xl border-black/10 shadow-xl"
                  align="end"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-black text-sm">
                        Filters
                      </h4>
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
                      <Label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Price Range
                      </Label>
                      <Select
                        value={filters.priceRange}
                        onValueChange={(value: FilterOptions["priceRange"]) =>
                          setFilters((prev) => ({ ...prev, priceRange: value }))
                        }
                      >
                        <SelectTrigger className="rounded-xl border-black/10 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Prices</SelectItem>
                          <SelectItem value="free">Free</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="under1000">
                            Under ₹1,000
                          </SelectItem>
                          <SelectItem value="1000to5000">
                            ₹1,000 – ₹5,000
                          </SelectItem>
                          <SelectItem value="above5000">
                            Above ₹5,000
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Student Count
                      </Label>
                      <Select
                        value={filters.studentRange}
                        onValueChange={(value: FilterOptions["studentRange"]) =>
                          setFilters((prev) => ({
                            ...prev,
                            studentRange: value,
                          }))
                        }
                      >
                        <SelectTrigger className="rounded-xl border-black/10 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="none">No Students</SelectItem>
                          <SelectItem value="1to10">1–10 Students</SelectItem>
                          <SelectItem value="11to50">11–50 Students</SelectItem>
                          <SelectItem value="above50">50+ Students</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Created Date
                      </Label>
                      <Select
                        value={filters.dateRange}
                        onValueChange={(value: FilterOptions["dateRange"]) =>
                          setFilters((prev) => ({ ...prev, dateRange: value }))
                        }
                      >
                        <SelectTrigger className="rounded-xl border-black/10 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Time</SelectItem>
                          <SelectItem value="today">Today</SelectItem>
                          <SelectItem value="week">Past Week</SelectItem>
                          <SelectItem value="month">Past Month</SelectItem>
                          <SelectItem value="year">Past Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Clear filters */}
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

              <div className="flex-1" />

              {/* New Course */}
              <Button
                onClick={() => setModal(true)}
                className="bg-blue-500 text-white hover:bg-blue-700 rounded-xl gap-2"
              >
                New Course <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Results count */}
            <p className="text-xs text-neutral-400 font-medium mb-4">
              Showing{" "}
              <span className="text-black font-semibold">
                {processedData.length}
              </span>{" "}
              of{" "}
              <span className="text-black font-semibold">
                {tableData.length}
              </span>{" "}
              courses
            </p>

            {/* Table */}
            <div className="bg-white border border-black/8 rounded-2xl overflow-hidden shadow-sm">
              <DataTable columns={columns} data={processedData} />
            </div>
          </>
        )}

        {modal && (
          <Modal
            Card={<NewCourseCard setModal={setModal} />}
            setModal={setModal}
          />
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;

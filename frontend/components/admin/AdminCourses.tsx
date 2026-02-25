/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";

import { Search, SlidersHorizontal, X, BookOpen } from "lucide-react";

import type { ColumnDef } from "@tanstack/react-table";

import { useAllCoursesAdminQuery } from "@/queries/courses.queries";
import Loading from "../common/Loading";
import Error from "../common/Error";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { DataTable } from "../common/Table";

/* ─── Types ───────────────────────────────────────────────────────────────── */
type CourseTableRow = {
  id: string;
  name: string;
  imageUrl: string;
  teacherName: string;
  teacherEmail: string;
  price: number;
  students: number;
  lectures: number;
  isEnrollmentOpen: boolean;
  startDate: string;
  createdAt: string;
  updatedAt: string;
  rawCreatedAt: Date;
  rawUpdatedAt: Date;
  rawStartDate: Date;
};

type SortOption = {
  field: "name" | "price" | "students" | "lectures" | "createdAt" | "startDate";
  direction: "asc" | "desc";
};

type FilterOptions = {
  priceRange: "all" | "free" | "paid" | "under500" | "500to1000" | "above1000";
  studentRange: "all" | "none" | "1to10" | "11to50" | "above50";
  enrollment: "all" | "open" | "closed";
  dateRange: "all" | "today" | "week" | "month" | "year";
};

/* ─── Columns ─────────────────────────────────────────────────────────────── */
const columns: ColumnDef<CourseTableRow>[] = [
  {
    id: "serial",
    header: "SI.No",
    cell: ({ row }) => (
      <span className="text-neutral-400 font-medium text-sm">
        {row.index + 1}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "Course",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-12 h-9 rounded-lg overflow-hidden bg-neutral-100 border border-black/8 shrink-0">
          {row.original.imageUrl ? (
            <img
              src={row.original.imageUrl}
              alt={row.original.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen
                className="w-4 h-4 text-neutral-400"
                strokeWidth={1.5}
              />
            </div>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-black line-clamp-1">
            {row.original.name}
          </p>
          <p className="text-[11px] text-neutral-400 truncate">
            {row.original.teacherName}
          </p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ getValue }) => {
      const price = getValue<number>();
      return (
        <span className="text-sm font-semibold text-black">
          {price === 0 ? "Free" : `₹${(price / 100).toLocaleString("en-IN")}`}
        </span>
      );
    },
  },
  {
    accessorKey: "students",
    header: "Students",
    cell: ({ getValue }) => (
      <span className="text-sm font-semibold text-black">
        {getValue<number>()}
      </span>
    ),
  },
  {
    accessorKey: "lectures",
    header: "Lectures",
    cell: ({ getValue }) => (
      <span className="text-sm font-semibold text-black">
        {getValue<number>()}
      </span>
    ),
  },
  {
    accessorKey: "isEnrollmentOpen",
    header: "Enrollment",
    cell: ({ getValue }) => {
      const open = getValue<boolean>();
      return (
        <span
          className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${
            open
              ? "bg-green-400 text-white border-none"
              : "bg-white text-neutral-500 border-black/20"
          }`}
        >
          {open ? "Open" : "Closed"}
        </span>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => (
      <span className="text-xs text-neutral-600 font-medium">
        {row.original.startDate}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => (
      <span className="text-xs text-neutral-400 font-medium">
        {row.original.createdAt}
      </span>
    ),
  },
];

/* ─── Main Page ───────────────────────────────────────────────────────────── */
const AdminCoursesPage = () => {
  const { isLoading, data, error } = useAllCoursesAdminQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>({
    field: "createdAt",
    direction: "desc",
  });
  const [filters, setFilters] = useState<FilterOptions>({
    priceRange: "all",
    studentRange: "all",
    enrollment: "all",
    dateRange: "all",
  });
  const [showFilters, setShowFilters] = useState(false);

  const tableData: CourseTableRow[] = useMemo(() => {
    if (!data) return [];
    return (data as any[]).map((course) => ({
      id: course.id,
      name: course.title,
      imageUrl: course.imageUrl ?? "",
      teacherName: course.teacher?.name ?? "Unknown",
      teacherEmail: course.teacher?.email ?? "",
      price: course.price,
      students: course.enrollments?.length ?? 0,
      lectures: course.lectures?.length ?? 0,
      isEnrollmentOpen: course.isEnrollmentOpen,
      startDate: new Date(course.startDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      createdAt: new Date(course.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      updatedAt: new Date(course.updatedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      rawCreatedAt: new Date(course.createdAt),
      rawUpdatedAt: new Date(course.updatedAt),
      rawStartDate: new Date(course.startDate),
    }));
  }, [data]);

  const processedData = useMemo(() => {
    let filtered = [...tableData];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.teacherName.toLowerCase().includes(q) ||
          c.teacherEmail.toLowerCase().includes(q),
      );
    }

    if (filters.enrollment !== "all") {
      filtered = filtered.filter((c) =>
        filters.enrollment === "open"
          ? c.isEnrollmentOpen
          : !c.isEnrollmentOpen,
      );
    }

    if (filters.priceRange !== "all") {
      filtered = filtered.filter((c) => {
        switch (filters.priceRange) {
          case "free":
            return c.price === 0;
          case "paid":
            return c.price > 0;
          case "under500":
            return c.price > 0 && c.price < 500;
          case "500to1000":
            return c.price >= 500 && c.price <= 1000;
          case "above1000":
            return c.price > 1000;
          default:
            return true;
        }
      });
    }

    if (filters.studentRange !== "all") {
      filtered = filtered.filter((c) => {
        switch (filters.studentRange) {
          case "none":
            return c.students === 0;
          case "1to10":
            return c.students >= 1 && c.students <= 10;
          case "11to50":
            return c.students >= 11 && c.students <= 50;
          case "above50":
            return c.students > 50;
          default:
            return true;
        }
      });
    }

    if (filters.dateRange !== "all") {
      const now = new Date();
      filtered = filtered.filter((c) => {
        const diffDays = Math.ceil(
          Math.abs(now.getTime() - c.rawCreatedAt.getTime()) /
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

    filtered.sort((a, b) => {
      let aVal: any, bVal: any;
      switch (sortOption.field) {
        case "name":
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case "price":
          aVal = a.price;
          bVal = b.price;
          break;
        case "students":
          aVal = a.students;
          bVal = b.students;
          break;
        case "lectures":
          aVal = a.lectures;
          bVal = b.lectures;
          break;
        case "createdAt":
          aVal = a.rawCreatedAt.getTime();
          bVal = b.rawCreatedAt.getTime();
          break;
        case "startDate":
          aVal = a.rawStartDate.getTime();
          bVal = b.rawStartDate.getTime();
          break;
        default:
          return 0;
      }
      if (aVal < bVal) return sortOption.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOption.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [tableData, searchQuery, sortOption, filters]);

  const activeFilterCount = [
    filters.priceRange !== "all",
    filters.studentRange !== "all",
    filters.enrollment !== "all",
    filters.dateRange !== "all",
    searchQuery !== "",
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;
  const clearFilters = () => {
    setSearchQuery("");
    setFilters({
      priceRange: "all",
      studentRange: "all",
      enrollment: "all",
      dateRange: "all",
    });
  };

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="relative z-10 max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-2">
            Admin Portal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-violet-600">
            Courses
          </h1>
          <p className="text-sm text-neutral-400 font-medium mt-1">
            Browse and manage every course on the platform
          </p>
        </div>

        {/* Empty state */}
        {tableData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border border-dashed border-black/15 rounded-2xl bg-white">
            <BookOpen
              className="w-8 h-8 text-neutral-300 mb-3"
              strokeWidth={1.5}
            />
            <p className="text-neutral-400 text-sm font-medium">
              No courses found
            </p>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative flex-1 min-w-62.5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder="Search courses or teachers..."
                  className="pl-10 bg-white border-black/10 rounded-xl focus-visible:ring-black/20 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

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
                  <SelectItem value="lectures-desc">Most Lectures</SelectItem>
                  <SelectItem value="startDate-asc">Start Date ↑</SelectItem>
                  <SelectItem value="startDate-desc">Start Date ↓</SelectItem>
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
                        {activeFilterCount}
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
                      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Enrollment
                      </p>
                      <Select
                        value={filters.enrollment}
                        onValueChange={(v: FilterOptions["enrollment"]) =>
                          setFilters((p) => ({ ...p, enrollment: v }))
                        }
                      >
                        <SelectTrigger className="rounded-xl border-black/10 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Price Range
                      </p>
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
                          <SelectItem value="under500">Under ₹500</SelectItem>
                          <SelectItem value="500to1000">
                            ₹500 – ₹1,000
                          </SelectItem>
                          <SelectItem value="above1000">
                            Above ₹1,000
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Student Count
                      </p>
                      <Select
                        value={filters.studentRange}
                        onValueChange={(v: FilterOptions["studentRange"]) =>
                          setFilters((p) => ({ ...p, studentRange: v }))
                        }
                      >
                        <SelectTrigger className="rounded-xl border-black/10 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="none">No Students</SelectItem>
                          <SelectItem value="1to10">1–10</SelectItem>
                          <SelectItem value="11to50">11–50</SelectItem>
                          <SelectItem value="above50">50+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Created Date
                      </p>
                      <Select
                        value={filters.dateRange}
                        onValueChange={(v: FilterOptions["dateRange"]) =>
                          setFilters((p) => ({ ...p, dateRange: v }))
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
      </div>
    </div>
  );
};

export default AdminCoursesPage;

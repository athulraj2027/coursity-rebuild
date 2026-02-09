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

  // Transform data
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

  // Filter function
  const filterData = (data: CourseTableRow[]): CourseTableRow[] => {
    let filtered = [...data];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter((course) =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase()),
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

    // Student range filter
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

    // Date range filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      filtered = filtered.filter((course) => {
        const diffTime = Math.abs(
          now.getTime() - course.rawCreatedAt.getTime(),
        );
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

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

  // Sort function
  const sortData = (data: CourseTableRow[]): CourseTableRow[] => {
    const sorted = [...data];

    sorted.sort((a, b) => {
      let aValue: any;
      let bValue: any;

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

    return sorted;
  };

  // Apply filters and sort
  const processedData = useMemo(() => {
    const filtered = filterData(tableData);
    return sortData(filtered);
  }, [tableData, searchQuery, sortOption, filters]);

  // Check if any filters are active
  const hasActiveFilters =
    filters.priceRange !== "all" ||
    filters.studentRange !== "all" ||
    filters.dateRange !== "all" ||
    searchQuery !== "";

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setFilters({
      priceRange: "all",
      studentRange: "all",
      dateRange: "all",
    });
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
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-course.jpg";
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
      {
        accessorKey: "students",
        header: "Students",
      },
      {
        accessorKey: "createdAt",
        header: "Created",
      },
      {
        accessorKey: "updatedAt",
        header: "Updated",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => <CourseActions courseId={row.original.id} />,
      },
    ],
    [],
  );

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    return <Error />;
  }

  if (!data || data.length === 0) {
    return (
      <div className="px-7 flex flex-col gap-4">
        <h1 className="text-3xl font-extrabold">My Courses</h1>
        <div className="flex items-center justify-center h-64 border-2 border-dashed rounded-lg">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">No courses yet</p>
            <Button onClick={() => setModal(true)}>
              Create Your First Course <Plus className="ml-2" />
            </Button>
          </div>
        </div>
        {modal && <Modal Card={<NewCourseCard />} setModal={setModal} />}
      </div>
    );
  }

  return (
    <div className="px-7 flex flex-col gap-4">
      <h1 className="text-3xl font-extrabold">My Courses</h1>

      {/* Search, Filter, and Sort Bar */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-62.5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search courses..."
            className="pl-10"
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
          <SelectTrigger className="w-45">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Newest First</SelectItem>
            <SelectItem value="createdAt-asc">Oldest First</SelectItem>
            <SelectItem value="name-asc">Name (A-Z)</SelectItem>
            <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            <SelectItem value="price-asc">Price (Low-High)</SelectItem>
            <SelectItem value="price-desc">Price (High-Low)</SelectItem>
            <SelectItem value="students-desc">Most Students</SelectItem>
            <SelectItem value="students-asc">Least Students</SelectItem>
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
                    filters.studentRange !== "all" ? 1 : 0,
                    filters.dateRange !== "all" ? 1 : 0,
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
                <Label className="text-sm font-medium">Price Range</Label>
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

              {/* Students Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Student Count</Label>
                <Select
                  value={filters.studentRange}
                  onValueChange={(value: FilterOptions["studentRange"]) =>
                    setFilters((prev) => ({ ...prev, studentRange: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="none">No Students</SelectItem>
                    <SelectItem value="1to10">1-10 Students</SelectItem>
                    <SelectItem value="11to50">11-50 Students</SelectItem>
                    <SelectItem value="above50">50+ Students</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Filter */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Created Date</Label>
                <Select
                  value={filters.dateRange}
                  onValueChange={(value: FilterOptions["dateRange"]) =>
                    setFilters((prev) => ({ ...prev, dateRange: value }))
                  }
                >
                  <SelectTrigger>
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

        {/* Clear filters button (when filters are active) */}
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

        <div className="flex-1" />

        {/* New Course Button */}
        <Button onClick={() => setModal(true)}>
          New Course <Plus className="ml-2" />
        </Button>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {processedData.length} of {tableData.length} courses
      </div>

      <DataTable columns={columns} data={processedData} />

      {modal && (
        <Modal
          Card={<NewCourseCard setModal={setModal} />}
          setModal={setModal}
        />
      )}
    </div>
  );
};

const Label = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => <label className={className}>{children}</label>;

export default MyCoursesPage;

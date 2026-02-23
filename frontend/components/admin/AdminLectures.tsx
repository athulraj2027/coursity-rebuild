/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";

import { Search, SlidersHorizontal, Video, X } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

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
import { useAllLecturesQuery } from "@/queries/lectures.queries";

/* ─── Types ───────────────────────────────────────────────────────────────── */
type LectureStatus = "NOT_STARTED" | "STARTED" | "COMPLETED";

type LectureTableRow = {
  id: string;
  title: string;
  courseTitle: string;
  courseId: string;
  teacherName: string;
  teacherEmail: string;
  status: LectureStatus;
  startTime: string;
  createdAt: string;
  rawStartTime: Date;
  rawCreatedAt: Date;
};

type SortOption = {
  field: "title" | "startTime" | "createdAt" | "status";
  direction: "asc" | "desc";
};

type FilterOptions = {
  status: "all" | "NOT_STARTED" | "STARTED" | "COMPLETED";
  dateRange: "all" | "today" | "week" | "month" | "year";
  startRange: "all" | "past" | "upcoming";
};

/* ─── Status config ───────────────────────────────────────────────────────── */
const statusStyles: Record<LectureStatus, string> = {
  NOT_STARTED: "bg-neutral-100 text-violet-600 border-neutral-200",
  STARTED: "bg-black text-white border-black",
  COMPLETED: "bg-violet-600 text-white border-none",
};

const statusLabels: Record<LectureStatus, string> = {
  NOT_STARTED: "Not Started",
  STARTED: "Live",
  COMPLETED: "Completed",
};

/* ─── Columns ─────────────────────────────────────────────────────────────── */
const columns: ColumnDef<LectureTableRow>[] = [
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
    accessorKey: "title",
    header: "Lecture",
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="text-sm font-semibold text-black line-clamp-1">
          {row.original.title}
        </p>
        <p className="text-[11px] text-neutral-400 truncate mt-0.5">
          {row.original.courseTitle}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "teacherName",
    header: "Teacher",
    cell: ({ row }) => (
      <div className="min-w-0">
        <p className="text-sm font-medium text-neutral-700 truncate">
          {row.original.teacherName}
        </p>
        <p className="text-[11px] text-neutral-400 truncate">
          {row.original.teacherEmail}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue<LectureStatus>();
      return (
        <span
          className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${statusStyles[status]}`}
        >
          {statusLabels[status]}
        </span>
      );
    },
  },
  {
    accessorKey: "startTime",
    header: "Start Time",
    cell: ({ row }) => (
      <span className="text-xs text-neutral-600 font-medium">
        {row.original.startTime}
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
const AdminLecturesPage = () => {
  const { isLoading, data, error } = useAllLecturesQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>({
    field: "startTime",
    direction: "desc",
  });
  const [filters, setFilters] = useState<FilterOptions>({
    status: "all",
    dateRange: "all",
    startRange: "all",
  });
  const [showFilters, setShowFilters] = useState(false);

  const tableData: LectureTableRow[] = useMemo(() => {
    const lectures =
      (data as any)?.lectures ?? (Array.isArray(data) ? data : []);
    return lectures.map((l: any) => ({
      id: l.id,
      title: l.title,
      courseTitle: l.course?.title ?? "Unknown Course",
      courseId: l.courseId,
      teacherName: l.course?.teacher?.name ?? "Unknown",
      teacherEmail: l.course?.teacher?.email ?? "",
      status: l.status as LectureStatus,
      startTime: new Date(l.startTime).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      createdAt: new Date(l.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      rawStartTime: new Date(l.startTime),
      rawCreatedAt: new Date(l.createdAt),
    }));
  }, [data]);

  const processedData = useMemo(() => {
    let filtered = [...tableData];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.courseTitle.toLowerCase().includes(q) ||
          l.teacherName.toLowerCase().includes(q) ||
          l.teacherEmail.toLowerCase().includes(q),
      );
    }

    if (filters.status !== "all") {
      filtered = filtered.filter((l) => l.status === filters.status);
    }

    if (filters.startRange !== "all") {
      const now = new Date();
      filtered = filtered.filter((l) =>
        filters.startRange === "upcoming"
          ? l.rawStartTime > now
          : l.rawStartTime <= now,
      );
    }

    if (filters.dateRange !== "all") {
      const now = new Date();
      filtered = filtered.filter((l) => {
        const diffDays = Math.ceil(
          Math.abs(now.getTime() - l.rawCreatedAt.getTime()) /
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
        case "title":
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case "startTime":
          aVal = a.rawStartTime.getTime();
          bVal = b.rawStartTime.getTime();
          break;
        case "createdAt":
          aVal = a.rawCreatedAt.getTime();
          bVal = b.rawCreatedAt.getTime();
          break;
        case "status":
          aVal = a.status;
          bVal = b.status;
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
    filters.status !== "all",
    filters.dateRange !== "all",
    filters.startRange !== "all",
    searchQuery !== "",
  ].filter(Boolean).length;

  const hasActiveFilters = activeFilterCount > 0;
  const clearFilters = () => {
    setSearchQuery("");
    setFilters({ status: "all", dateRange: "all", startRange: "all" });
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
            Lectures
          </h1>
          <p className="text-sm text-neutral-400 font-medium mt-1">
            Monitor every lecture scheduled across the platform
          </p>
        </div>

        {/* Empty state */}
        {tableData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 border border-dashed border-black/15 rounded-2xl bg-white">
            <Video
              className="w-8 h-8 text-neutral-300 mb-3"
              strokeWidth={1.5}
            />
            <p className="text-neutral-400 text-sm font-medium">
              No lectures found
            </p>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <div className="relative flex-1 min-w-62.5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder="Search lectures, courses, teachers..."
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
                  <SelectItem value="startTime-desc">
                    Start Time (New)
                  </SelectItem>
                  <SelectItem value="startTime-asc">
                    Start Time (Old)
                  </SelectItem>
                  <SelectItem value="createdAt-desc">Newest First</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  <SelectItem value="title-asc">Title (A–Z)</SelectItem>
                  <SelectItem value="title-desc">Title (Z–A)</SelectItem>
                  <SelectItem value="status-asc">Status</SelectItem>
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
                  className="w-64 rounded-2xl border-black/10 shadow-xl"
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
                        Status
                      </p>
                      <Select
                        value={filters.status}
                        onValueChange={(v: FilterOptions["status"]) =>
                          setFilters((p) => ({ ...p, status: v }))
                        }
                      >
                        <SelectTrigger className="rounded-xl border-black/10 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="NOT_STARTED">
                            Not Started
                          </SelectItem>
                          <SelectItem value="STARTED">Live</SelectItem>
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                        Start Time
                      </p>
                      <Select
                        value={filters.startRange}
                        onValueChange={(v: FilterOptions["startRange"]) =>
                          setFilters((p) => ({ ...p, startRange: v }))
                        }
                      >
                        <SelectTrigger className="rounded-xl border-black/10 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="upcoming">Upcoming</SelectItem>
                          <SelectItem value="past">Past</SelectItem>
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
              lectures
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

export default AdminLecturesPage;

"use client";

import React, { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Search, SlidersHorizontal, X } from "lucide-react";

import { DataTable } from "@/components/common/Table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Loading from "@/components/common/Loading";
import Error from "@/components/common/Error";

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

import { useMyLecturesQuery } from "@/queries/lectures.queries";
import LectureActions from "./LectureActions";

type LectureTableRow = {
  id: string;
  title: string;
  courseTitle: string;
  status: "NOT_STARTED" | "STARTED" | "COMPLETED";
  startTime: string;
  createdAt: string;
  rawStartTime: Date;
  rawCreatedAt: Date;
};

type SortOption = {
  field: "title" | "startTime" | "createdAt";
  direction: "asc" | "desc";
};

const statusColor: Record<string, "default" | "secondary" | "destructive"> = {
  NOT_STARTED: "secondary",
  STARTED: "default",
  COMPLETED: "destructive",
};

const MyLecturesPage = () => {
  const { data, isLoading, error } = useMyLecturesQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState<
    "all" | "NOT_STARTED" | "STARTED" | "COMPLETED"
  >("all");

  const [sortOption, setSortOption] = useState<SortOption>({
    field: "createdAt",
    direction: "desc",
  });

  const tableData: LectureTableRow[] = useMemo(() => {
    if (!data) return [];

    return data.map((lecture: any) => ({
      id: lecture.id,
      title: lecture.title,
      courseTitle: lecture.course.title,
      status: lecture.status,
      startTime: new Date(lecture.startTime).toLocaleString(),
      createdAt: new Date(lecture.createdAt).toLocaleDateString(),
      rawStartTime: new Date(lecture.startTime),
      rawCreatedAt: new Date(lecture.createdAt),
    }));
  }, [data]);

  const processedData = useMemo(() => {
    let filtered = [...tableData];

    if (searchQuery) {
      filtered = filtered.filter(
        (l) =>
          l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((l) => l.status === statusFilter);
    }

    filtered.sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;

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
        default:
          return 0;
      }

      if (aVal < bVal) return sortOption.direction === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOption.direction === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [tableData, searchQuery, statusFilter, sortOption]);

  const hasActiveFilters = searchQuery !== "" || statusFilter !== "all";

  if (isLoading) return <Loading />;
  if (error) return <Error />;

  const columns: ColumnDef<LectureTableRow>[] = [
    {
      header: "SI.No",
      cell: ({ row }) => row.index + 1,
    },
    {
      accessorKey: "title",
      header: "Lecture",
      cell: ({ row }) => (
        <div>
          <p className="font-medium">{row.original.title}</p>
          <p className="text-xs text-muted-foreground">
            {row.original.courseTitle}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "startTime",
      header: "Start Time",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => (
        <Badge variant={statusColor[getValue<string>()]}>
          {getValue<string>().replace("_", " ")}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => <LectureActions lectureId={row.original.id} />,
    },
  ];

  return (
    <div className="px-7 flex flex-col gap-4">
      <h1 className="text-3xl font-extrabold">My Lectures</h1>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search lectures..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select
          value={`${sortOption.field}-${sortOption.direction}`}
          onValueChange={(v) => {
            const [field, direction] = v.split("-") as any;
            setSortOption({ field, direction });
          }}
        >
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Newest</SelectItem>
            <SelectItem value="createdAt-asc">Oldest</SelectItem>
            <SelectItem value="startTime-asc">Start Time ↑</SelectItem>
            <SelectItem value="startTime-desc">Start Time ↓</SelectItem>
            <SelectItem value="title-asc">Title A–Z</SelectItem>
            <SelectItem value="title-desc">Title Z–A</SelectItem>
          </SelectContent>
        </Select>

        <Popover open={showFilters} onOpenChange={setShowFilters}>
          <PopoverTrigger asChild>
            <Button variant="outline" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-64">
            <div className="space-y-3">
              <p className="font-semibold">Status</p>
              <Select
                value={statusFilter}
                onValueChange={(v: any) => setStatusFilter(v)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="NOT_STARTED">Not Started</SelectItem>
                  <SelectItem value="STARTED">Live</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>

              {hasActiveFilters && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                  }}
                  className="w-full gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear filters
                </Button>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <DataTable columns={columns} data={processedData} />
    </div>
  );
};

export default MyLecturesPage;

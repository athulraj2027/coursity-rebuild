/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState } from "react";
import { DataTable } from "../../common/Table";
import { Button } from "../../ui/button";
import { Plus } from "lucide-react";
import { Input } from "../../ui/input";
import Modal from "../../common/Modal";
import NewCourseCard from "./NewCourseCard";
import CourseActions from "./CourseActions";
import { useMyCoursesQuery } from "@/queries/courses.queries";
import { toast } from "sonner";
import type { ColumnDef } from "@tanstack/react-table";
import Loading from "../../common/Loading";
import Error from "../../common/Error";

type CourseTableRow = {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  students: number;
  createdAt: string;
  updatedAt: string;
};

const MyCoursesPage = () => {
  const { isLoading, data, error } = useMyCoursesQuery();
  const [modal, setModal] = useState(false);

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
      imageUrl: course.imageUrl || "/placeholder-course.jpg", // Fallback image
      price: course.price,
      students: course.enrollments?.length ?? 0,
      createdAt: new Date(course.createdAt).toLocaleDateString(),
      updatedAt: new Date(course.updatedAt).toLocaleDateString(),
    }));
  }, [data]);

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
          return price === 0 ? "Free" : `₹${price}/-`;
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

  /* -----------------------------
     RENDER
  -------------------------------- */
  return (
    <div className="px-7 flex flex-col gap-4">
      <h1 className="text-3xl font-extrabold">My Courses</h1>

      <div className="flex justify-end gap-3">
        <Input placeholder="Search course..." className="w-72" />
        <Button onClick={() => setModal(true)}>
          New Course <Plus className="ml-2" />
        </Button>
      </div>

      <DataTable columns={columns} data={tableData} />

      {modal && <Modal Card={<NewCourseCard />} setModal={setModal} />}
    </div>
  );
};

export default MyCoursesPage;

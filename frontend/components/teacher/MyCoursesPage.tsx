"use client";
import React, { useState } from "react";
import { DataTable } from "../common/Table";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import Modal from "../common/Modal";
import NewCourseCard from "./NewCourseCard";

const MyCoursesPage = () => {
  const [modal, setModal] = useState(false);
  return (
    <div className="px-7 flex flex-col gap-4">
      <h1 className="text-3xl font-extrabold">My Courses</h1>
      <div className="flex justify-end gap-3">
        <Input placeholder="Search course..." className="w-75 relative" />

        <Button onClick={() => setModal(true)}>
          New Course <Plus />
        </Button>
      </div>
      <DataTable
        columns={[
          {
            header: "SI.No",
            cell: ({ row }) => row.index + 1,
          },
          {
            accessorKey: "name",
            header: "Course Name",
          },
          {
            accessorKey: "price",
            header: "Price",
            cell: ({ getValue }) => {
              const price = getValue<number>();
              return price === 0 ? "Free" : `Rs.${price}/-`;
            },
          },
          {
            accessorKey: "students",
            header: "Students",
          },
          {
            accessorKey: "status",
            header: "Status",
            cell: ({ getValue }) => {
              const status = getValue<string>();
              return (
                <Badge className={`text-xs px-3 bg-pink-600`}>
                  {status.toLocaleLowerCase()}
                </Badge>
              );
            },
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
            accessorKey: "actions",
            header: "Actions",
          },
        ]}
        data={[
          {
            id: "1",
            name: "DSA Mastery",
            price: 999,
            students: 120,
            status: "PUBLISHED",
            createdAt: "05 Feb 2026",
            updatedAt: "06 Feb 2026",
          },
          {
            id: "2",
            name: "System Design Fundamentals",
            price: 1499,
            students: 45,
            status: "DRAFT",
            createdAt: "01 Feb 2026",
            updatedAt: "03 Feb 2026",
          },
          {
            id: "3",
            name: "Web Dev Bootcamp",
            price: 0,
            students: 300,
            status: "PUBLISHED",
            createdAt: "15 Jan 2026",
            updatedAt: "20 Jan 2026",
          },
        ]}
      />
      {modal && <Modal Card={<NewCourseCard />} setModal={setModal} />}
    </div>
  );
};

export default MyCoursesPage;

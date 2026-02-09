"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FileUploadCompact from "../../compact-upload";
import type { FileWithPreview } from "@/hooks/use-file-upload";
import { Calendar } from "../../ui/calendar";
import { toast } from "sonner";
import { useCourse } from "@/app/(role)/teacher/my-courses/hooks/useTeacherCourse";

const NewCourseCard = ({
  setModal,
}: {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { createCourse } = useCourse();
  /* -------------------- form state -------------------- */
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });

  const [images, setImages] = useState<FileWithPreview[]>([]);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileUploadKey, setFileUploadKey] = useState(0); // Key to reset file upload component

  /* -------------------- handlers -------------------- */
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const isValid =
      formData.title.trim() !== "" &&
      formData.description.trim() !== "" &&
      formData.price !== "" &&
      images.length > 0 &&
      Boolean(date);

    if (!isValid) {
      if (!formData.title.trim())
        return toast.error("Please enter a course title");
      if (!formData.description.trim())
        return toast.error("Please enter a course description");
      if (!formData.price) return toast.error("Please enter a price");
      if (images.length === 0)
        return toast.error("Please upload a course image");
      if (!date) return toast.error("Please select a starting date");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await createCourse({
        title: formData.title,
        description: formData.description,
        price: formData.price,
        startDate: date!, // safe because validated
        image: images[0], // ✅ single image
      });

      console.log("data created ..", data);

      setFormData({ title: "", description: "", price: "" });
      setImages([]);
      setDate(undefined);
      setFileUploadKey((prev) => prev + 1);
      setModal(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to create course");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* -------------------- UI -------------------- */
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Course</CardTitle>
      </CardHeader>

      <CardContent>
        <form className="space-y-5" onSubmit={onSubmit}>
          {/* Course Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Course Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Master DSA in 30 Days"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Course Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Explain what this course covers, who it's for, outcomes..."
              rows={5}
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price">Price (₹)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              placeholder="999"
              value={formData.price}
              onChange={handleInputChange}
            />
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label>Starting Date</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                if (selectedDate) setDate(selectedDate);
              }}
              className="rounded-lg border"
              captionLayout="dropdown"
            />
          </div>

          {/* Image Upload */}
          <FileUploadCompact
            key={fileUploadKey} // This will remount the component when key changes
            maxFiles={1}
            accept="image/*"
            onFilesChange={(files) => {
              console.log(files);
              setImages(files);
            }}
          />

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Course"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NewCourseCard;

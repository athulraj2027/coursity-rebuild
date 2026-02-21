"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "../../ui/calendar";
import { toast } from "sonner";
import { useCourse } from "@/app/(role)/teacher/my-courses/hooks/useTeacherCourse";
import FileUploadCompact from "../../compact-upload";
import type { FileWithPreview } from "@/hooks/use-file-upload";
import {
  Loader2,
  BookOpen,
  IndianRupee,
  CalendarDays,
  ImagePlus,
  AlignLeft,
} from "lucide-react";

const NewCourseCard = ({
  setModal,
}: {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { createCourse } = useCourse();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
  });
  const [images, setImages] = useState<FileWithPreview[]>([]);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileUploadKey, setFileUploadKey] = useState(0);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title.trim())
      return toast.error("Please enter a course title");
    if (!formData.description.trim())
      return toast.error("Please enter a course description");
    if (!formData.price) return toast.error("Please enter a price");
    if (images.length === 0) return toast.error("Please upload a course image");
    if (!date) return toast.error("Please select a starting date");

    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today)
      return toast.error("Start date cannot be in the past");

    setIsSubmitting(true);
    try {
      await createCourse({
        title: formData.title,
        description: formData.description,
        price: formData.price,
        startDate: date!,
        image: images[0],
      });

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

  return (
    <div className="w-full max-w-xl bg-white border border-black/8 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-black/6">
        <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center shrink-0">
          <BookOpen className="w-4 h-4 text-white" strokeWidth={1.5} />
        </div>
        <div>
          <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase">
            Teacher Portal
          </p>
          <h2 className="text-sm font-bold text-black tracking-tight leading-none mt-0.5">
            Create New Course
          </h2>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="px-6 py-5 space-y-5">
        {/* Title */}
        <div className="space-y-1.5">
          <label
            htmlFor="title"
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600"
          >
            <BookOpen className="w-3.5 h-3.5" strokeWidth={1.8} />
            Course Title
          </label>
          <Input
            id="title"
            name="title"
            placeholder="Master DSA in 30 Days"
            value={formData.title}
            onChange={handleInputChange}
            className="rounded-xl border-black/10 bg-neutral-50 focus-visible:ring-black/20 text-sm placeholder:text-neutral-400"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label
            htmlFor="description"
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600"
          >
            <AlignLeft className="w-3.5 h-3.5" strokeWidth={1.8} />
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            placeholder="Explain what this course covers, who it's for, outcomes..."
            rows={4}
            value={formData.description}
            onChange={handleInputChange}
            className="rounded-xl border-black/10 bg-neutral-50 focus-visible:ring-black/20 text-sm placeholder:text-neutral-400 resize-none"
          />
        </div>

        {/* Price */}
        <div className="space-y-1.5">
          <label
            htmlFor="price"
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600"
          >
            <IndianRupee className="w-3.5 h-3.5" strokeWidth={1.8} />
            Price (₹)
          </label>
          <Input
            id="price"
            name="price"
            type="number"
            placeholder="999"
            value={formData.price}
            onChange={handleInputChange}
            className="rounded-xl border-black/10 bg-neutral-50 focus-visible:ring-black/20 text-sm placeholder:text-neutral-400"
          />
        </div>

        {/* Start Date */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600">
            <CalendarDays className="w-3.5 h-3.5" strokeWidth={1.8} />
            Starting Date
            {date && (
              <span className="ml-auto text-[10px] font-bold text-black bg-neutral-100 border border-black/8 px-2 py-0.5 rounded-full">
                {date.toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            )}
          </label>
          <div className="rounded-xl border border-black/10 bg-neutral-50 overflow-hidden">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                if (selectedDate) setDate(selectedDate);
              }}
              className="w-full"
              captionLayout="dropdown"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600">
            <ImagePlus className="w-3.5 h-3.5" strokeWidth={1.8} />
            Course Image
          </label>
          <FileUploadCompact
            key={fileUploadKey}
            maxFiles={1}
            accept="image/*"
            onFilesChange={(files) => setImages(files)}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-black text-white text-sm font-semibold border border-black hover:bg-black/80 active:bg-black/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating…
            </>
          ) : (
            "Create Course"
          )}
        </button>
      </form>
    </div>
  );
};

export default NewCourseCard;

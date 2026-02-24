"use client";
import Error from "@/components/common/Error";
import Loading from "@/components/common/Loading";
import { useMyCourseQueryById } from "@/queries/courses.queries";
import React, { useEffect, useState } from "react";
import { useCourse } from "../../hooks/useTeacherCourse";
import {
  BookOpen,
  FileText,
  IndianRupee,
  Calendar,
  ImagePlus,
  CheckCircle,
  Loader2,
  Save,
  MoveLeftIcon,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FileUploadCompact from "@/components/compact-upload";
import { FileWithPreview } from "@/hooks/use-file-upload";
import { useRouter } from "next/navigation";

/* ─── Types ───────────────────────────────────────────────────────────────── */
interface CourseData {
  course: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    price: number;
    startDate: string;
    isEnrollmentOpen: boolean;
    formattedPrice: string;
  };
}

/* ─── Field wrapper ───────────────────────────────────────────────────────── */
const Field = ({
  label,
  icon: Icon,
  error,
  children,
}: {
  label: string;
  icon: React.ElementType;
  error?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-600 uppercase tracking-wider">
      <Icon className="w-3.5 h-3.5" strokeWidth={1.8} />
      {label}
    </label>
    {children}
    {error && <p className="text-[11px] text-rose-500 font-medium">{error}</p>}
  </div>
);

/* ─── Main Component ──────────────────────────────────────────────────────── */
const CourseEditComponent = ({ id }: { id: string }) => {
  const router = useRouter();
  const { data, error, isLoading } = useMyCourseQueryById(id);
  const { editCourse } = useCourse();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [images, setImages] = useState<FileWithPreview[]>([]);
  const [fileUploadKey, setFileUploadKey] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Prefill from data
  useEffect(() => {
    if (!data) return;
    const { course } = data as CourseData;
    setTitle(course.title ?? "");
    setDescription(course.description ?? "");
    // price is stored in paise (x100), display in rupees
    setPrice(course.price ? (course.price / 100).toString() : "");
    // format ISO date to yyyy-MM-dd for <input type="date">
    setStartDate(course.startDate ? course.startDate.split("T")[0] : "");
  }, [data]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim()) e.title = "Title is required.";
    if (!description.trim()) e.description = "Description is required.";
    if (!price || Number(price) <= 0)
      e.price = "Enter a valid price greater than 0.";
    if (!startDate) e.startDate = "Start date is required.";
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setErrors({});
    setIsSubmitting(true);

    const payload: {
      title?: string;
      description?: string;
      price?: string;
      startDate?: Date;
      image?: FileWithPreview;
    } = {
      title: title.trim(),
      description: description.trim(),
      price: price,
      startDate: new Date(startDate),
    };
    if (images.length > 0) payload.image = images[0];

    const res = await editCourse(id, payload);
    if (res.success) {
      setIsSubmitting(false);
      setFileUploadKey((k) => k + 1);
      setDone(true);
      setTimeout(() => setDone(false), 1000);
      router.push(`/teacher/my-courses`);
    }
  };

  if (isLoading) return <Loading />;
  if (error || !data) return <Error />;

  const { course } = data as CourseData;
  const hasImage = images.length > 0;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[10px] font-bold text-neutral-400 tracking-widest uppercase mb-2">
            Teacher Portal
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-violet-600">
            Edit Course
          </h1>
          <p className="text-sm text-neutral-400 font-medium mt-1">
            Update your course details below
          </p>
        </div>

        {/* Current thumbnail preview */}
        {course.imageUrl && !hasImage && (
          <div className="mb-6 bg-white border border-black/8 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-black/5">
              <ImagePlus
                className="w-3.5 h-3.5 text-neutral-500"
                strokeWidth={1.8}
              />
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Current Thumbnail
              </p>
            </div>
            <div className="h-36 w-full overflow-hidden">
              <img
                src={course.imageUrl}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Form card */}
        <div className="bg-white border border-black/8 rounded-2xl shadow-sm overflow-hidden">
          <div className="h-0.5 bg-violet-600 w-full" />

          <div className="p-6 space-y-5">
            {/* Title */}
            <Field label="Title" icon={BookOpen} error={errors.title}>
              <Input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors((p) => ({ ...p, title: "" }));
                }}
                placeholder="Course title"
                className={`rounded-xl bg-neutral-50 text-sm placeholder:text-neutral-400 focus-visible:ring-black/20 ${errors.title ? "border-rose-400" : "border-black/10"}`}
              />
            </Field>

            {/* Description */}
            <Field
              label="Description"
              icon={FileText}
              error={errors.description}
            >
              <Textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description)
                    setErrors((p) => ({ ...p, description: "" }));
                }}
                placeholder="Describe what students will learn..."
                rows={4}
                className={`rounded-xl bg-neutral-50 text-sm placeholder:text-neutral-400 focus-visible:ring-black/20 resize-none ${errors.description ? "border-rose-400" : "border-black/10"}`}
              />
            </Field>

            {/* Price + Start date row */}
            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (₹)" icon={IndianRupee} error={errors.price}>
                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    if (errors.price) setErrors((p) => ({ ...p, price: "" }));
                  }}
                  placeholder="e.g. 499"
                  className={`rounded-xl bg-neutral-50 text-sm placeholder:text-neutral-400 focus-visible:ring-black/20 ${errors.price ? "border-rose-400" : "border-black/10"}`}
                />
              </Field>

              <Field
                label="Start Date"
                icon={Calendar}
                error={errors.startDate}
              >
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    if (errors.startDate)
                      setErrors((p) => ({ ...p, startDate: "" }));
                  }}
                  className={`rounded-xl bg-neutral-50 text-sm focus-visible:ring-black/20 ${errors.startDate ? "border-rose-400" : "border-black/10"}`}
                />
              </Field>
            </div>

            {/* Thumbnail upload */}
            <Field label="New Thumbnail (optional)" icon={ImagePlus}>
              <div
                className={`rounded-xl border-2 border-dashed transition-colors duration-150 ${
                  hasImage
                    ? "border-violet-300 bg-violet-50/50"
                    : "border-black/10 bg-neutral-50"
                }`}
              >
                <FileUploadCompact
                  key={fileUploadKey}
                  maxFiles={1}
                  accept="image/*"
                  onFilesChange={(files) => setImages(files)}
                />
              </div>
              {hasImage && (
                <p className="text-[11px] text-violet-600 font-semibold flex items-center gap-1 mt-1">
                  <CheckCircle className="w-3 h-3" strokeWidth={2} />
                  {images[0].file.name}
                </p>
              )}
            </Field>

            <div className="h-px bg-black/5" />

            {/* Save button */}
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="w-full h-10 flex items-center justify-center gap-2 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 active:bg-violet-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving…
                </>
              ) : done ? (
                <>
                  <CheckCircle className="w-4 h-4" strokeWidth={2} />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" strokeWidth={2} />
                  Save Changes
                </>
              )}
            </button>

            <button
              onClick={() => window.history.back()}
              className="
                inline-flex items-center gap-2
                px-4 py-2
                rounded-xl
                text-sm font-semibold
                text-red-600
                bg-red-50
                hover:bg-red-100
                active:scale-95
                transition-all duration-200 mb-6
                focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
              "
            >
              <MoveLeftIcon size={18} />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseEditComponent;

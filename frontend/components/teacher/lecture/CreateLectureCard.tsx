"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { Clock } from "lucide-react";
import { useCreateLecture } from "@/mutations/lecture.mutations";

const CreateLectureCard = ({
  courseId,
  setModal,
}: {
  courseId: string;
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [formData, setFormData] = useState({
    title: "",
    meetingId: "",
  });

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const { mutate: createLectureApi, isPending } = useCreateLecture();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter a lecture title");
      return;
    }
    if (!date) {
      toast.error("Please select a lecture date");
      return;
    }
    if (!time.trim()) {
      toast.error("Please select a lecture time");
      return;
    }
    const [hours, minutes] = time.split(":");
    const startTime = new Date(date);
    startTime.setHours(Number(hours), Number(minutes), 0, 0);
    const now = new Date();
    if (startTime <= now) {
      toast.error("Lecture start time must be in the future");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title.trim(),
        startTime,
        courseId,
      };

      createLectureApi(payload, {
        onSuccess: () => {
          toast.success("Lecture created successfully");
          setModal(false);
          setFormData({ title: "", meetingId: "" });
          setDate(undefined);
          setTime("");
        },
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to create lecture");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Lecture</CardTitle>
      </CardHeader>

      <CardContent>
        <form className="space-y-5" onSubmit={onSubmit}>
          {/* Lecture Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Lecture Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Introduction to Data Structures"
              value={formData.title}
              onChange={handleInputChange}
            />
          </div>

          {/* Start Date */}
          <div className="space-y-2">
            <Label>Lecture Date</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(selectedDate) => {
                if (selectedDate) setDate(selectedDate);
              }}
              className="rounded-lg border"
              captionLayout="dropdown"
              disabled={(date) => date < new Date()}
            />
          </div>

          {/* Start Time */}
          <div className="space-y-2">
            <Label htmlFor="time">Lecture Time (24 hr format)</Label>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="time"
                name="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Preview */}
          {date && time && (
            <div className="p-4 bg-muted rounded-lg space-y-1">
              <p className="text-sm font-medium">Lecture Preview:</p>
              <p className="text-sm text-muted-foreground">
                {formData.title || "Untitled Lecture"} -{" "}
                {new Date(
                  date.setHours(
                    parseInt(time.split(":")[0]),
                    parseInt(time.split(":")[1]),
                  ),
                ).toLocaleString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || isPending}
          >
            {isSubmitting ? "Creating..." : "Create Lecture"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CreateLectureCard;

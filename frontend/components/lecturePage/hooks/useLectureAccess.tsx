"use client";
import { getLectureAccess } from "@/services/lecture.services";
import { useEffect, useState } from "react";

export const useLectureAccess = (lectureId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<"ADMIN" | "TEACHER" | "STUDENT" | null>(
    null,
  );
  const [error, setError] = useState(null);
  const [mode, setMode] = useState<"LOBBY" | "MEETING">("LOBBY");
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = await getLectureAccess(lectureId);
        console.log(data);
        setRole(data.role);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.log(error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [lectureId]);

  return { isLoading, mode, setMode, role, error };
};

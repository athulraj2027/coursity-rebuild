import { apiRequest } from "@/lib/apiClient";

export const createLectureApi = async (payload: {
  title: string;
  startTime: Date;
  courseId: string;
}) => apiRequest({ path: "/lectures/teacher", method: "POST", body: payload });

export const getMyLecturesForOwnerApi = async () =>
  apiRequest({ path: "/lectures/teacher", method: "GET" });

export const getMyLectureByIdForOwnerApi = async (lectureId: string) =>
  apiRequest({ path: `/lectures/teacher/${lectureId}`, method: "GET" });

export const getScheduledLectures = async () =>
  apiRequest({ path: "/lectures/student", method: "GET" });

export const getLectureAccess = async (lectureId: string) =>
  apiRequest({ path: `/lectures/access/${lectureId}`, method: "GET" });

export const startLecture = async (lectureId: string) =>
  apiRequest({ path: `/lectures/teacher/${lectureId}/start`, method: "POST" });

export const endLecture = async (lectureId: string) =>
  apiRequest({ path: `/lectures/teacher/${lectureId}/end`, method: "POST" });

export const joinLecture = async (lectureId: string) =>
  apiRequest({ path: `/lectures/${lectureId}/join`, method: "POST" });

export const getLectureStatus = async (lectureId: string) =>
  apiRequest({ path: `/lectures/status/${lectureId}`, method: "GET" });

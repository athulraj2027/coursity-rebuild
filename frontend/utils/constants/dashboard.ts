import {
  BookSearch,
  Group,
  IndianRupee,
  LayoutDashboard,
  Notebook,
  Pen,
  User,
  User2,
  User2Icon,
} from "lucide-react";

export const TEACHER_LINKS = [
  { name: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { name: "Courses", url: "/courses", icon: Notebook },
  { name: "Lectures", url: "/lectures", icon: Group },
  { name: "Earnings", url: "/payments", icon: IndianRupee },
  { name: "Attendance", url: "/attendance", icon: User2 },
  { name: "Profile", url: "/profile", icon: User },
];

export const STUDENT_LINKS = [
  { name: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { name: "Explore Courses", url: "/courses", icon: Notebook },
  { name: "Lectures", url: "/lectures", icon: Group },
  { name: "Enrolled Courses", url: "/courses", icon: BookSearch },
  { name: "Homeworks", url: "/homeworks", icon: Pen },
  { name: "Profile", url: "/profile", icon: User },
];
export const ADMIN_LINKS = [
  { name: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { name: "Teachers", url: "/homeworks", icon: User },
  { name: "Students", url: "/homeworks", icon: User2Icon },
  { name: "Courses", url: "/courses", icon: Notebook },
  { name: "Lectures", url: "/lectures", icon: Group },
];

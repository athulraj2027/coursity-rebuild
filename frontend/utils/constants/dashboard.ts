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
  { name: "Dashboard", url: "", icon: LayoutDashboard },
  { name: "My Courses", url: "/my-courses", icon: Notebook },
  { name: "My Lectures", url: "/my-lectures", icon: Group },
  { name: "Payouts", url: "/payouts", icon: IndianRupee },
  { name: "Attendance", url: "/attendance", icon: User2 },
  { name: "Profile", url: "/profile", icon: User },
];

export const STUDENT_LINKS = [
  { name: "Dashboard", url: "", icon: LayoutDashboard },
  { name: "Explore Courses", url: "/courses", icon: Notebook },
  { name: "Lectures", url: "/lectures", icon: Group },
  { name: "Enrolled Courses", url: "/courses", icon: BookSearch },
  { name: "Homeworks", url: "/homeworks", icon: Pen },
  { name: "Profile", url: "/profile", icon: User },
];
export const ADMIN_LINKS = [
  { name: "Dashboard", url: "", icon: LayoutDashboard },
  { name: "Teachers", url: "/homeworks", icon: User },
  { name: "Students", url: "/homeworks", icon: User2Icon },
  { name: "Courses", url: "/courses", icon: Notebook },
  { name: "Lectures", url: "/lectures", icon: Group },
];

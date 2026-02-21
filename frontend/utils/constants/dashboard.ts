import {
  ArrowRightLeft,
  Banknote,
  BookSearch,
  Group,
  LayoutDashboard,
  Newspaper,
  Notebook,
  // Pen,
  User,
  // User2,
  User2Icon,
} from "lucide-react";

export const TEACHER_LINKS = [
  { name: "Dashboard", url: "", icon: LayoutDashboard },
  { name: "My Courses", url: "/my-courses", icon: Notebook },
  { name: "My Lectures", url: "/my-lectures", icon: Group },
  { name: "Payouts", url: "/payouts", icon: Banknote },
  { name: "Profile", url: "/profile", icon: User },
];

export const STUDENT_LINKS = [
  { name: "Dashboard", url: "", icon: LayoutDashboard },
  { name: "Explore Courses", url: "/courses", icon: Notebook },
  { name: "Enrolled Courses", url: "/enrolled-courses", icon: BookSearch },
  { name: "Lectures", url: "/lectures", icon: Group },
  // { name: "Homeworks", url: "/homeworks", icon: Pen },
  { name: "Transactions", url: "/transactions", icon: ArrowRightLeft },
  { name: "Profile", url: "/profile", icon: User },
];
export const ADMIN_LINKS = [
  { name: "Dashboard", url: "", icon: LayoutDashboard },
  { name: "Teachers", url: "/teachers", icon: User },
  { name: "Students", url: "/students", icon: User2Icon },
  { name: "Courses", url: "/courses", icon: Notebook },
  { name: "Lectures", url: "/lectures", icon: Group },
  { name: "Enrollments", url: "/enrollments", icon: Newspaper },
];

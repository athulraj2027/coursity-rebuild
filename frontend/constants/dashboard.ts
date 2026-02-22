import {
  ArrowRightLeft,
  Banknote,
  BookSearch,
  Group,
  LayoutDashboard,
  Notebook,
  User,
  Wallet,
} from "lucide-react";

export const TEACHER_LINKS = [
  { name: "Dashboard", url: "", icon: LayoutDashboard },
  { name: "My Courses", url: "/my-courses", icon: Notebook },
  { name: "My Lectures", url: "/my-lectures", icon: Group },
  { name: "Wallet", url: "/wallet", icon: Banknote },
  // { name: "Profile", url: "/profile", icon: User },
];

export const STUDENT_LINKS = [
  { name: "Dashboard", url: "", icon: LayoutDashboard },
  { name: "Explore Courses", url: "/courses", icon: Notebook },
  { name: "Enrolled Courses", url: "/enrolled-courses", icon: BookSearch },
  { name: "Lectures", url: "/lectures", icon: Group },
  // { name: "Homeworks", url: "/homeworks", icon: Pen },
  { name: "Transactions", url: "/transactions", icon: ArrowRightLeft },
  // { name: "Profile", url: "/profile", icon: User },
];
export const ADMIN_LINKS = [
  { name: "Dashboard", url: "", icon: LayoutDashboard },
  { name: "Users", url: "/users", icon: User },
  { name: "Courses", url: "/courses", icon: Notebook },
  { name: "Lectures", url: "/lectures", icon: Group },
  { name: "Wallets", url: "/wallets", icon: Wallet },
];

"use client";

import { useRouter } from "next/navigation";
import { Navbar, NavbarNavLink } from "@/components/ui/navbar";
// import { useAuth } from "@/hooks/useAuth";

export default function AppNavbar() {
  const router = useRouter();
  //   const { user, isAuthenticated, logout } = useAuth();

  // 🔹 Public (not logged in)
  //   if (!isAuthenticated) {
  //     const links: NavbarNavLink[] = [
  //       { href: "/", label: "Home", active: true },
  //       { href: "/features", label: "Features" },
  //     ];

  //     return (
  //       <Navbar
  //         navigationLinks={links}
  //         signInText="Sign In"
  //         ctaText="Get Started"
  //         onSignInClick={() => router.push("/login")}
  //         onCtaClick={() => router.push("/register")}
  //       />
  //     );
  //   }

  // 🔹 Teacher
  //   if (user.role === "TEACHER") {
  //     const links: NavbarNavLink[] = [
  //       { href: "/teacher/dashboard", label: "Dashboard" },
  //       { href: "/teacher/courses", label: "Courses" },
  //       { href: "/teacher/lectures", label: "Lectures" },
  //     ];

  //     return (
  //       <Navbar
  //         navigationLinks={links}
  //         signInText="Logout"
  //         ctaText="Dashboard"
  //         onSignInClick={logout}
  //         onCtaClick={() => router.push("/teacher/dashboard")}
  //       />
  //     );
  //   }

  // 🔹 Student
  const links: NavbarNavLink[] = [
    { href: "/student/courses", label: "Courses" },
    { href: "/student/lectures", label: "Live Classes" },
  ];

  return (
    <Navbar
      navigationLinks={links}
      signInText="Logout"
      ctaText="My Courses"
      //   onSignInClick={logout}
      onCtaClick={() => router.push("/student/courses")}
    />
  );
}

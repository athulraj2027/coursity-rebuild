"use client";

import { useRouter } from "next/navigation";
import { Navbar, NavbarNavLink } from "@/components/ui/navbar";
// import { useAuth } from "@/hooks/useAuth";

export default function AppNavbar() {
  const router = useRouter();
  const links: NavbarNavLink[] = [
    // { href: "/courses", label: "Top Courses" },
    // { href: "/lectures", label: "Top Teachers" },
  ];

  return (
    <Navbar
      navigationLinks={links}
      // signInText="Logout"
      // ctaText="Sign in"
      //   onSignInClick={logout}
      onCtaClick={() => router.push("/sign-in")}
    />
  );
}

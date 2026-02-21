"use client";

import {
  SidebarContent,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useMe } from "@/queries/auth.queries";
import {
  ADMIN_LINKS,
  STUDENT_LINKS,
  TEACHER_LINKS,
} from "@/utils/constants/dashboard";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React from "react";

const Body = () => {
  const { data, isLoading } = useMe();
  const pathname = usePathname();

  if (isLoading) return null;

  const userRole: string = data.user.role;
  let links: { name: string; url: string; icon: any }[] = [];

  if (userRole === "STUDENT") links = STUDENT_LINKS;
  else if (userRole === "TEACHER") links = TEACHER_LINKS;
  else if (userRole === "ADMIN") links = ADMIN_LINKS;

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          {links.map((link) => {
            const fullPath = `/${userRole.toLowerCase()}${link.url}`;
            const isActive = pathname === fullPath;

            return (
              <SidebarMenuItem key={link.name}>
                <SidebarMenuButton
                  asChild
                  className={`transition-all duration-200 rounded-md
                    ${
                      isActive
                        ? "bg-gray-300 text-white shadow-sm"
                        : "hover:bg-gray-100 text-gray-700"
                    }
                  `}
                >
                  <Link href={fullPath} className="flex items-center gap-2">
                    <link.icon
                      className={`h-4 w-4 ${
                        isActive ? "text-white" : "text-gray-500"
                      }`}
                    />
                    <span>{link.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
};

export default Body;

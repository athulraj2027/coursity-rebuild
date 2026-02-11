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

import React from "react";

const Body = () => {
  const { data, isLoading } = useMe();
  if (isLoading) return null;

  const userRole: string = data.user.role;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any 
  let links: { name: string; url: string; icon: any }[] = [];

  if (userRole === "STUDENT") links = STUDENT_LINKS;
  else if (userRole === "TEACHER") links = TEACHER_LINKS;
  else if (userRole === "ADMIN") links = ADMIN_LINKS;

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          {links.map((link) => (
            <SidebarMenuItem key={link.name}>
              <SidebarMenuButton asChild>
                <a href={`/${userRole.toLocaleLowerCase()}${link.url}`}>
                  <link.icon />
                  <span>{link.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
  );
};

export default Body;

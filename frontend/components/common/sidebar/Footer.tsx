"use client";

import {
  SidebarFooter,
  SidebarMenu,
  // SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import React from "react";
import LogoutBtn from "../LogoutBtn";
import { useMe } from "@/queries/auth.queries";

const Footer = () => {
  const { data: user, isLoading } = useMe();

  if (isLoading) return null;

  return (
    <SidebarFooter className="mb-3 ">
      <SidebarMenu>
        {/* Logout */}
        <SidebarMenuItem>
          <LogoutBtn />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};

export default Footer;

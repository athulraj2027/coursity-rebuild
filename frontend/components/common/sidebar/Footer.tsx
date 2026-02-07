"use client";
import {
  SidebarFooter,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import React from "react";
import LogoutBtn from "../LogoutBtn";
import { Moon, Settings, User2 } from "lucide-react";
import { useMe } from "@/queries/auth.queries";

const Footer = () => {
  const { isLoading } = useMe();
  if (isLoading) return null;
  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <Moon /> Dark Mode
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <Settings /> Settings
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <User2 /> Athul Raj NV
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <LogoutBtn />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};

export default Footer;

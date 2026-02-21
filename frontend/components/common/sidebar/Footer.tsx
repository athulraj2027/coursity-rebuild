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
  const { data: user, isLoading } = useMe();

  if (isLoading) return null;

  return (
    <SidebarFooter>
      <SidebarMenu>
        {/* Dark Mode */}
        <SidebarMenuItem>
          <SidebarMenuButton>
            <Moon className="mr-2 h-4 w-4" />
            Dark Mode
          </SidebarMenuButton>
        </SidebarMenuItem>

        {/* Settings */}
        <SidebarMenuItem>
          <SidebarMenuButton>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </SidebarMenuButton>
        </SidebarMenuItem>

        {/* User Info */}
        {/* {user && (
          <SidebarMenuItem>
            <SidebarMenuButton>
              <User2 className="mr-2 h-4 w-4" />
              <div className="flex flex-col text-left">
                <span className="text-sm font-medium">{user.name}</span>
                <span className="text-xs text-muted-foreground">
                  {user.role}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )} */}

        {/* Logout */}
        <SidebarMenuItem>
          <LogoutBtn />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
};

export default Footer;

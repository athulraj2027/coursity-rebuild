import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import React from "react";
import RoleBadge from "./RoleBadge";


const Header = () => {
  
  return (
    <SidebarHeader className="border-b border-b-gray-300 ">
      <SidebarMenu>
        <SidebarMenuItem className="flex flex-col gap-4">
          <h1 className="font-extrabold text-xl">Coursity</h1>
          <RoleBadge  />
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
};

export default Header;

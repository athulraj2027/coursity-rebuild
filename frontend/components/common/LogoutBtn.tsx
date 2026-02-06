"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { SidebarMenuButton } from "../ui/sidebar";
import { LogOut } from "lucide-react";

const LogoutBtn = () => {
  const router = useRouter();
  const { logoutUser } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const HandlelogoutUser = async () => {
    setLoggingOut(true);
    const res = await logoutUser();
    if (res.success) {
      router.replace("/");
    }
    setLoggingOut(false);
  };
  return (
    <SidebarMenuButton onClick={HandlelogoutUser} disabled={loggingOut}>
      <LogOut />
      {loggingOut ? "Logging you out" : "Logout"}
    </SidebarMenuButton>
  );
};

export default LogoutBtn;

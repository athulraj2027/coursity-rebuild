"use client";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { SidebarMenuButton } from "../ui/sidebar";
import { LogOut, Loader2 } from "lucide-react";

const LogoutBtn = () => {
  const router = useRouter();
  const { logoutUser } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogoutUser = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      const res = await logoutUser();

      if (res?.success) {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <SidebarMenuButton
      onClick={handleLogoutUser}
      disabled={loggingOut}
      className="transition-all duration-200"
    >
      {loggingOut ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}

      <span>{loggingOut ? "Logging you out..." : "Logout"}</span>
    </SidebarMenuButton>
  );
};

export default LogoutBtn;

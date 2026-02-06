"use client";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

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
    <Button onClick={HandlelogoutUser} disabled={loggingOut}>
      {loggingOut ? "Logging you out" : "Logout"}
    </Button>
  );
};

export default LogoutBtn;

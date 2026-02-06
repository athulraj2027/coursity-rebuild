"use client";
import { Badge } from "@/components/ui/badge";
import { useMe } from "@/queries/auth.queries";
import React from "react";

const RoleBadge = () => {
  const { data, isLoading } = useMe();
  if (isLoading || !data?.user) {
    return null; // or skeleton
  }

  const role = data.user.role;

  return (
    <Badge
      className=" px-5 text-xs font-semibold border border-gray-700 border-dashed"
      variant={`ghost`}
    >
      {role}
    </Badge>
  );
};

export default RoleBadge;

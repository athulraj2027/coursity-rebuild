"use client";

import { useMe } from "@/queries/auth.queries";

export function MeLoader() {
  const { data, isLoading, error } = useMe();

  if (isLoading) return null;

  if (error) {
    console.log("Not logged in");
    return null;
  }

  console.log("Logged in user:", data);
  return null;
}

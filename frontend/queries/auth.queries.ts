"use client";
import { meApi } from "@/services/auth.services";
import { useQuery } from "@tanstack/react-query";

export const useMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: meApi,
    retry: false,
  });

import { apiClient } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";

// queries/auth.queries.ts
export const useMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await apiClient.get("/auth/me");
      console.log("res from useme  : ", res);
      return res.data;
    },
    retry: false,
  });

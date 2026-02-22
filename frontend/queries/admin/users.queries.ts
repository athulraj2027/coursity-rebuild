import { getUsersApi } from "@/services/users.services";
import { useQuery } from "@tanstack/react-query";

export const useUsersQuery = () =>
  useQuery({ queryKey: ["users"], queryFn: getUsersApi });

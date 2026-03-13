import { getProfileApi } from "@/services/profile.services";
import { useQuery } from "@tanstack/react-query";

export const useMyProfileQuery = () =>
  useQuery({ queryKey: ["profile"], queryFn: getProfileApi });


import { useQuery } from "@tanstack/react-query";

export const usePayoutsQuery = () =>
  useQuery({ queryKey: ["payouts"], queryFn: getPayoutsApi });

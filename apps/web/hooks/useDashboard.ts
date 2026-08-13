import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard-summary"],

    queryFn: async () => {
      const { data } = await axios.get("/api/dashboard/summary");

      return data;
    },

    staleTime: 30_000,

    refetchInterval: 60_000,
  });
}

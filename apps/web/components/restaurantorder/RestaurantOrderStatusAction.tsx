"use client";

import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const endpoints = {
  prepare: "prepare",
  ready: "ready",
  serve: "serve",
  complete: "complete",
};

const labels = {
  prepare: "Start preparing",
  ready: "Mark order as ready",
  serve: "Mark order as served",
  complete: "Complete order",
};

export function useRestaurantOrderAction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      action,
    }: {
      orderId: string;
      action: "prepare" | "ready" | "serve" | "complete";
    }) => {
      const res = await axios.post(
        `/api/restaurantorder/${orderId}/${endpoints[action]}`,
      );

      return res.data;
    },

    onSuccess: (_, variables) => {
      toast.success(labels[variables.action]);

      queryClient.invalidateQueries({
        queryKey: ["restaurantorders"],
      });
    },

    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ?? "Unable to update restaurant order",
      );
    },
  });
}

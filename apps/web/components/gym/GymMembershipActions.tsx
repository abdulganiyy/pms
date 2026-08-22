"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import axios from "axios";
import { toast } from "sonner";
import { Button } from "../ui/button";

type Membership = {
  id: string;
  status: string;
};

type Props = {
  membership: Membership;
};

const GymMembershipActions = ({ membership }: Props) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      action,
      reason,
    }: {
      action: "activate" | "suspend" | "reactivate" | "cancel";
      reason?: string;
    }) => {
      const res = await axios.patch(
        `/api/gym/membership/${membership.id}/${action}`,
        reason ? { reason } : undefined,
      );

      return res.data;
    },

    onSuccess: () => {
      toast.success("Membership updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["gym-memberships"],
      });
    },

    onError: (err: any) => {
      toast.error(
        err?.response?.data?.message ?? "Unable to update membership",
      );
    },
  });

  const update = (action: "activate" | "suspend" | "reactivate" | "cancel") => {
    mutation.mutate({ action });
  };

  return (
    <div className="flex flex-wrap gap-2">
      {membership.status === "PENDING" && (
        <Button
          onClick={() => update("activate")}
          disabled={mutation.isPending}
        >
          Activate
        </Button>
      )}

      {membership.status === "ACTIVE" && (
        <Button
          variant="outline"
          onClick={() => update("suspend")}
          disabled={mutation.isPending}
        >
          Suspend
        </Button>
      )}

      {membership.status === "SUSPENDED" && (
        <Button
          onClick={() => update("reactivate")}
          disabled={mutation.isPending}
        >
          Reactivate
        </Button>
      )}

      {["PENDING", "ACTIVE", "SUSPENDED"].includes(membership.status) && (
        <Button
          variant="destructive"
          onClick={() => update("cancel")}
          disabled={mutation.isPending}
        >
          Cancel
        </Button>
      )}
    </div>
  );
};

export default GymMembershipActions;

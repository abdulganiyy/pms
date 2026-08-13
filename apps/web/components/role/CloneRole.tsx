import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Role, rolesPermissionsApi } from "@/lib/api/roles-permissions";
import { Copy, Trash2 } from "lucide-react";
import { roleKeys } from "@/lib/queries/roles-permissions";
import { formatRoleName } from "@/utils/role";

type CloneRoleProps = {
  role: Role;
};

const CloneRole = ({ role }: CloneRoleProps) => {
  const queryClient = useQueryClient();

  const cloneRoleMutation = useMutation({
    mutationFn: ({ roleId, name }: { roleId: string; name: string }) =>
      rolesPermissionsApi.cloneRole(roleId, name),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: roleKeys.all,
      });
    },
  });

  const handleCloneRole = (role: Role) => {
    const name = window.prompt(
      "Enter a name for the cloned role:",
      `${role.name}_COPY`,
    );

    if (!name?.trim()) {
      return;
    }

    cloneRoleMutation.mutate({
      roleId: role.id,
      name: name.trim().toUpperCase().replace(/\s+/g, "_"),
    });
  };

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        disabled={cloneRoleMutation.isPending}
        onClick={() => handleCloneRole(role)}
      >
        <Copy className="mr-2 h-4 w-4" />
        Clone role
      </DropdownMenuItem>
    </>
  );
};

export default CloneRole;

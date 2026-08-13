import {
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type Role, rolesPermissionsApi } from "@/lib/api/roles-permissions";
import { Trash2 } from "lucide-react";
import { roleKeys } from "@/lib/queries/roles-permissions";
import { formatRoleName } from "@/utils/role";

type DeleteRoleProps = {
  role: Role;
};

const DeleteRole = ({ role }: DeleteRoleProps) => {
  const queryClient = useQueryClient();

  const deleteRoleMutation = useMutation({
    mutationFn: rolesPermissionsApi.deleteRole,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: roleKeys.all,
      });
    },
  });

  const handleDeleteRole = (role: Role) => {
    if (role.isSystem) {
      return;
    }

    const confirmed = window.confirm(
      `Delete ${formatRoleName(role.name)}? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    deleteRoleMutation.mutate(role.id);
  };

  return (
    <>
      <DropdownMenuSeparator />
      <DropdownMenuItem
        className="text-destructive focus:text-destructive"
        disabled={deleteRoleMutation.isPending}
        onClick={() => handleDeleteRole(role)}
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Delete role
      </DropdownMenuItem>
    </>
  );
};

export default DeleteRole;

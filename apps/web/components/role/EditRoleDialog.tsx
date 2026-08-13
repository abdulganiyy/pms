"use client";

import { useState, useMemo } from "react";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Checkbox } from "@/components/ui/checkbox";

import { Label } from "@/components/ui/label";

import {
  rolesPermissionsApi,
  type Role,
  type Permission,
} from "@/lib/api/roles-permissions";

import { useQuery } from "@tanstack/react-query";

import { roleKeys } from "@/lib/queries/roles-permissions";

import { formatPermissionAction } from "@/utils/role";

export function EditRoleDialog({
  open,
  onOpenChange,
  role,
  permissions,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  permissions: Permission[];
}) {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const updateRoleMutation = useMutation({
    mutationFn: ({
      roleId,
      payload,
    }: {
      roleId: string;
      payload: {
        name?: string;
        permissionIds?: string[];
      };
    }) => rolesPermissionsApi.updateRole(roleId, payload),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: roleKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: roleKeys.permissions(variables.roleId),
      });

      onOpenChange(false);
      //   setEditDialogOpen(false);
    },
  });

  const handleUpdateRole = (
    roleId: string,
    payload: {
      name?: string;
      permissionIds?: string[];
    },
  ) => {
    updateRoleMutation.mutate({
      roleId,
      payload,
    });
  };

  const { data: rolePermissions = [], isLoading } = useQuery({
    queryKey: role
      ? roleKeys.permissions(role.id)
      : ["roles", "permissions", "empty"],

    queryFn: () => rolesPermissionsApi.getRolePermissions(role!.id),

    enabled: open && !!role,
  });

  useState(() => {
    if (!role) return;

    setName(role.name);
  });

  const rolePermissionIds = useMemo(
    () => rolePermissions.map((permission) => permission.id),
    [rolePermissions],
  );

  const effectiveSelectedPermissions =
    selectedPermissions.length > 0 ? selectedPermissions : rolePermissionIds;

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((current) => {
      const source = current.length > 0 ? current : rolePermissionIds;

      return source.includes(permissionId)
        ? source.filter((id) => id !== permissionId)
        : [...source, permissionId];
    });
  };

  const handleSubmit = () => {
    if (!role) return;

    const normalizedName = name.trim().toUpperCase().replace(/\s+/g, "_");

    if (!normalizedName) {
      return;
    }

    handleUpdateRole(role.id, {
      name: normalizedName,
      permissionIds: effectiveSelectedPermissions,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] min-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Role</DialogTitle>

          <DialogDescription>
            Update the role name and permissions.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="edit-role-name">Role name</Label>

            <Input
              id="edit-role-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={role?.isSystem}
            />

            {role?.isSystem && (
              <p className="text-xs text-muted-foreground">
                System role names cannot be changed.
              </p>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <Label>Permissions</Label>

              <p className="text-sm text-muted-foreground">
                Select the permissions for this role.
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-10">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            ) : (
              <div className="max-h-80 space-y-2 overflow-y-auto rounded-lg border p-4">
                {permissions.map((permission) => {
                  const checked = effectiveSelectedPermissions.includes(
                    permission.id,
                  );

                  return (
                    <label
                      key={permission.id}
                      className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-muted"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => togglePermission(permission.id)}
                        disabled={role?.isSystem}
                      />

                      <div>
                        <p className="text-sm font-medium">
                          {formatPermissionAction(permission.name)}
                        </p>

                        <p className="font-mono text-xs text-muted-foreground">
                          {permission.name}
                        </p>
                      </div>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateRoleMutation.isPending}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={
              updateRoleMutation.isPending || !name.trim() || role?.isSystem
            }
          >
            {updateRoleMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

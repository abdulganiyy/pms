"use client";

import { useState } from "react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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

import { formatPermissionAction } from "@/utils/role";

import {
  rolesPermissionsApi,
  type Permission,
} from "@/lib/api/roles-permissions";

import { roleKeys } from "@/lib/queries/roles-permissions";

export function CreateRoleDialog({
  open,
  onOpenChange,
  permissions,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  permissions: Permission[];
}) {
  const queryClient = useQueryClient();

  const [name, setName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const createRoleMutation = useMutation({
    mutationFn: rolesPermissionsApi.createRole,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: roleKeys.all,
      });

      onOpenChange(false);
    },
  });

  const handleCreateRole = (name: string, permissionIds: string[]) => {
    createRoleMutation.mutate({
      name,
      permissionIds,
    });
  };

  const handleSubmit = () => {
    const normalizedName = name.trim().toUpperCase().replace(/\s+/g, "_");

    if (!normalizedName) {
      return;
    }

    handleCreateRole(normalizedName, selectedPermissions);
  };

  const togglePermission = (permissionId: string) => {
    setSelectedPermissions((current) =>
      current.includes(permissionId)
        ? current.filter((id) => id !== permissionId)
        : [...current, permissionId],
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] min-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Role</DialogTitle>

          <DialogDescription>
            Create a custom staff role and assign the permissions it should
            have.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="role-name">Role name</Label>

            <Input
              id="role-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. NIGHT_MANAGER"
            />
          </div>

          <div className="space-y-3">
            <div>
              <Label>Permissions</Label>

              <p className="text-sm text-muted-foreground">
                Select the permissions for this role.
              </p>
            </div>

            <div className="max-h-80 space-y-2 overflow-y-auto rounded-lg border p-4">
              {permissions.map((permission) => (
                <label
                  key={permission.id}
                  className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-muted"
                >
                  <Checkbox
                    checked={selectedPermissions.includes(permission.id)}
                    onCheckedChange={() => togglePermission(permission.id)}
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
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={createRoleMutation.isPending}
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={createRoleMutation.isPending || !name.trim()}
          >
            {createRoleMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create Role
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  rolesPermissionsApi,
  type Role,
  type Permission,
} from "@/lib/api/roles-permissions";

import { roleKeys } from "@/lib/queries/roles-permissions";

import {
  getModule,
  formatPermissionAction,
  formatRoleName,
  moduleLabels,
} from "@/utils/role";

export function ViewRolePermissionsDialog({
  open,
  onOpenChange,
  role,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
}) {
  const {
    data: permissions = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: role
      ? roleKeys.permissions(role.id)
      : ["roles", "permissions", "empty"],

    queryFn: () => rolesPermissionsApi.getRolePermissions(role!.id),

    enabled: open && !!role,
  });

  const groupedPermissions = useMemo(() => {
    return permissions.reduce<Record<string, Permission[]>>(
      (groups, permission) => {
        const module = getModule(permission.name);

        if (!groups[module]) {
          groups[module] = [];
        }

        groups[module].push(permission);

        return groups;
      },
      {},
    );
  }, [permissions]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] min-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {role ? formatRoleName(role.name) : "Role"} Permissions
          </DialogTitle>

          <DialogDescription>
            Permissions currently assigned to this role.
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {isError && (
          <div className="py-12 text-center text-sm text-destructive">
            Unable to load role permissions.
          </div>
        )}

        {!isLoading && !isError && permissions.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No permissions assigned.
          </div>
        )}

        {!isLoading && !isError && permissions.length > 0 && (
          <div className="space-y-4">
            {Object.entries(groupedPermissions).map(
              ([module, modulePermissions]) => (
                <div key={module} className="overflow-hidden rounded-lg border">
                  <div className="bg-muted/40 px-4 py-3">
                    <p className="font-medium">
                      {moduleLabels[module] ?? module}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {modulePermissions.length} permissions
                    </p>
                  </div>

                  <div className="divide-y">
                    {modulePermissions.map((permission) => (
                      <div key={permission.id} className="px-4 py-3">
                        <p className="text-sm font-medium">
                          {formatPermissionAction(permission.name)}
                        </p>

                        <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                          {permission.name}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ),
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

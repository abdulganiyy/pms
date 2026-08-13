"use client";

import { Dispatch, SetStateAction, useMemo } from "react";

import { Search, ShieldCheck, MoreHorizontal, Eye } from "lucide-react";

import { CardTitle, CardDescription } from "@/components/ui/card";

import { TabsContent } from "@/components/ui/tabs";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";

import { type Role } from "@/lib/api/roles-permissions";

import { formatRoleName } from "@/utils/role";

import EditRole from "./EditRole";
import DeleteRole from "./DeleteRole";
import CloneRole from "./CloneRole";

type RolesProps = {
  roles: Role[];
  roleSearch: string;
  setSelectedRole: Dispatch<SetStateAction<Role | null>>;
  setRoleSearch: Dispatch<SetStateAction<string>>;
  setEditDialogOpen: Dispatch<SetStateAction<boolean>>;
  setViewPermissionsDialogOpen: Dispatch<SetStateAction<boolean>>;
};

export default function Roles({
  roles,
  roleSearch,
  setSelectedRole,
  setRoleSearch,
  setEditDialogOpen,
  setViewPermissionsDialogOpen,
}: RolesProps) {
  const filteredRoles = useMemo(() => {
    const search = roleSearch?.toLowerCase();

    return roles?.filter((role) =>
      formatRoleName(role.name).toLowerCase().includes(search),
    );
  }, [roles, roleSearch]);

  const handleViewPermissions = (role: Role) => {
    setSelectedRole(role);
    setViewPermissionsDialogOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle>System Roles</CardTitle>

          <CardDescription className="mt-1">
            Roles define what staff members can access and perform.
          </CardDescription>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={roleSearch}
            onChange={(event) => setRoleSearch(event.target.value)}
            placeholder="Search roles..."
            className="pl-9"
          />
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border">
        <div className="hidden grid-cols-[1fr_120px_150px_50px] items-center bg-muted/40 px-4 py-3 text-sm font-medium text-muted-foreground md:grid">
          <span>Role</span>

          <span>Users</span>

          <span>Permissions</span>

          <span />
        </div>

        {filteredRoles?.map((role) => (
          <div
            key={role.id}
            className="flex flex-col gap-4 border-t px-4 py-4 md:grid md:grid-cols-[1fr_120px_150px_50px] md:items-center md:gap-0"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <ShieldCheck className="h-4 w-4" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{formatRoleName(role.name)}</p>

                  {role.isSystem && <Badge variant="secondary">System</Badge>}
                </div>

                <p className="text-xs text-muted-foreground">
                  {role.name.toLowerCase()}
                </p>
              </div>
            </div>

            <div className="text-sm">
              <span className="text-muted-foreground md:hidden">Users: </span>

              {role.usersCount}
            </div>

            <div className="text-sm">
              <span className="text-muted-foreground md:hidden">
                Permissions:{" "}
              </span>

              {role.name === "SUPER_ADMIN" ? (
                <Badge variant="outline">All permissions</Badge>
              ) : (
                `${role.permissionsCount} permissions`
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                }
              />

              <DropdownMenuContent align="end" className="w-50">
                <DropdownMenuItem onClick={() => handleViewPermissions(role)}>
                  <Eye className="mr-2 h-4 w-4" />
                  View permissions
                </DropdownMenuItem>

                <EditRole
                  onOpenChange={setEditDialogOpen}
                  role={role}
                  setSelectedRole={setSelectedRole}
                />

                <CloneRole role={role} />

                {!role.isSystem && <DeleteRole role={role} />}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}

        {filteredRoles?.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No roles found.
          </div>
        )}
      </div>
    </>
  );
}

"use client";

import { useState } from "react";

import { useQuery } from "@tanstack/react-query";

import { Plus, ShieldCheck, KeyRound, Users } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";

import { RolesPermissionsError } from "./RolesPermissionsError";
import { RolesPermissionsSkeleton } from "./RolesPermissionsSkeleton";
import { CreateRoleDialog } from "./CreateRoleDialog";

import { rolesPermissionsApi, type Role } from "@/lib/api/roles-permissions";

import { roleKeys, permissionKeys } from "@/lib/queries/roles-permissions";
import { EditRoleDialog } from "./EditRoleDialog";
import { ViewRolePermissionsDialog } from "./ViewRolePermissionsDialog";
import Permissions from "./Permissions";
import Roles from "./Roles";

export default function RolesPermissions() {
  const [activeTab, setActiveTab] = useState("roles");

  const [roleSearch, setRoleSearch] = useState("");

  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [viewPermissionsDialogOpen, setViewPermissionsDialogOpen] =
    useState(false);

  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const {
    data: roles = [],
    isLoading: rolesLoading,
    isError: rolesError,
    refetch: refetchRoles,
  } = useQuery({
    queryKey: roleKeys.lists(),
    queryFn: rolesPermissionsApi.getRoles,
  });

  const {
    data: permissions = [],
    isLoading: permissionsLoading,
    isError: permissionsError,
    refetch: refetchPermissions,
  } = useQuery({
    queryKey: permissionKeys.lists(),
    queryFn: rolesPermissionsApi.getPermissions,
  });

  const isLoading = rolesLoading || permissionsLoading;

  const isError = rolesError || permissionsError;

  if (isLoading) {
    return <RolesPermissionsSkeleton />;
  }

  if (isError) {
    return (
      <RolesPermissionsError
        onRetry={() => {
          refetchRoles();
          refetchPermissions();
        }}
      />
    );
  }

  const totalAssignedPermissions = roles.reduce(
    (total, role) => total + role.permissionsCount,
    0,
  );

  return (
    <>
      <div className="space-y-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Settings</span>

              <span>/</span>

              <span>Roles & Permissions</span>
            </div>

            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
              Roles & Permissions
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage staff roles and control access to PMS functionality.
            </p>
          </div>

          {/* <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Role
          </Button> */}
        </div>

        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">System Roles</p>

                <p className="text-2xl font-semibold">
                  {roles.filter((role) => role.isSystem).length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted">
                <KeyRound className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Permissions</p>

                <p className="text-2xl font-semibold">{permissions.length}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted">
                <Users className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">
                  Assigned Permissions
                </p>

                <p className="text-2xl font-semibold">
                  {totalAssignedPermissions}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main */}
        <Card>
          <CardHeader className="pb-0">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="roles">Roles</TabsTrigger>

                <TabsTrigger value="permissions">Permissions</TabsTrigger>
              </TabsList>

              <TabsContent value="roles" className="mt-6">
                <Roles
                  roles={roles}
                  roleSearch={roleSearch}
                  setRoleSearch={setRoleSearch}
                  setSelectedRole={setSelectedRole}
                  setEditDialogOpen={setEditDialogOpen}
                  setViewPermissionsDialogOpen={setViewPermissionsDialogOpen}
                />
              </TabsContent>

              <TabsContent value="permissions" className="mt-6">
                <Permissions permissions={permissions} />
              </TabsContent>
            </Tabs>
          </CardHeader>

          <CardContent />
        </Card>
      </div>

      <CreateRoleDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        permissions={permissions}
      />

      <EditRoleDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        role={selectedRole}
        permissions={permissions}
      />

      <ViewRolePermissionsDialog
        open={viewPermissionsDialogOpen}
        onOpenChange={setViewPermissionsDialogOpen}
        role={selectedRole}
      />
    </>
  );
}

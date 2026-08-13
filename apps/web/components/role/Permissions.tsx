"use client";

import { Search, ChevronDown } from "lucide-react";

import { CardTitle, CardDescription } from "@/components/ui/card";

import { TabsContent } from "@/components/ui/tabs";

import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";

import { formatPermissionAction, moduleLabels, getModule } from "@/utils/role";
import { useMemo, useState } from "react";

import { type Permission } from "@/lib/api/roles-permissions";

type PermissionsProps = {
  permissions: Permission[];
};

const Permissions = ({ permissions }: PermissionsProps) => {
  const [permissionSearch, setPermissionSearch] = useState("");

  const [moduleFilter, setModuleFilter] = useState("all");

  const modules = useMemo(() => {
    return Array.from(
      new Set(permissions.map((permission) => getModule(permission.name))),
    ).sort();
  }, [permissions]);

  const groupedPermissions = useMemo(() => {
    const search = permissionSearch.toLowerCase();

    const filtered = permissions.filter((permission) => {
      const matchesSearch =
        permission.name.toLowerCase().includes(search) ||
        formatPermissionAction(permission.name).toLowerCase().includes(search);

      const module = getModule(permission.name);

      const matchesModule = moduleFilter === "all" || module === moduleFilter;

      return matchesSearch && matchesModule;
    });

    return filtered.reduce<Record<string, Permission[]>>(
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
  }, [permissions, permissionSearch, moduleFilter]);

  return (
    <>
      <TabsContent value="permissions" className="mt-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <CardTitle>System Permissions</CardTitle>

            <CardDescription className="mt-1">
              Permissions are immutable system capabilities used by roles.
            </CardDescription>
          </div>

          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row">
            <div className="relative md:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={permissionSearch}
                onChange={(event) => setPermissionSearch(event.target.value)}
                placeholder="Search permissions..."
                className="pl-9"
              />
            </div>

            <Select
              value={moduleFilter}
              onValueChange={(value) => setModuleFilter(value ?? "all")}
            >
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Module" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">All modules</SelectItem>

                {modules.map((module) => (
                  <SelectItem key={module} value={module}>
                    {moduleLabels[module] ?? formatPermissionAction(module)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {Object.entries(groupedPermissions).map(
            ([module, modulePermissions]) => (
              <div key={module} className="overflow-hidden rounded-lg border">
                <div className="flex items-center justify-between bg-muted/40 px-4 py-3">
                  <div>
                    <p className="font-medium">
                      {moduleLabels[module] ?? module}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {modulePermissions.length} permissions
                    </p>
                  </div>

                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="divide-y">
                  {modulePermissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {formatPermissionAction(permission.name)}
                        </p>

                        <p className="mt-0.5 font-mono text-xs text-muted-foreground">
                          {permission.name}
                        </p>
                      </div>

                      <Badge variant="outline">System</Badge>
                    </div>
                  ))}
                </div>
              </div>
            ),
          )}

          {Object.keys(groupedPermissions).length === 0 && (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No permissions found.
            </div>
          )}
        </div>
      </TabsContent>
    </>
  );
};

export default Permissions;

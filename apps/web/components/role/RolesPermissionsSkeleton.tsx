"use client";

import { Card, CardContent } from "@/components/ui/card";

export function RolesPermissionsSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <div className="h-4 w-40 animate-pulse rounded bg-muted" />

        <div className="h-8 w-64 animate-pulse rounded bg-muted" />

        <div className="h-4 w-96 animate-pulse rounded bg-muted" />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="p-5">
              <div className="h-14 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="h-[500px] animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>
    </div>
  );
}

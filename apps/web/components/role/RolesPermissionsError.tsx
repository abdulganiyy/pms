import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "../ui/button";

export function RolesPermissionsError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-[500px] items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Unable to load roles & permissions</CardTitle>

          <CardDescription>
            We couldn't load the access-control data. Please try again.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Button onClick={onRetry}>Try again</Button>
        </CardContent>
      </Card>
    </div>
  );
}

import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

export default async function TestProtectedPage() {
  const session = await auth();

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <CardTitle>Authentication Test Successful</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">User ID</p>
            <p className="font-mono">{session!.user!.id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p>{session!.user!.name || "Not set"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p>{session!.user!.email || "Not set"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Role</p>
            <Badge>{session!.user!.role || "user"}</Badge>
          </div>
          <div className="pt-4 border-t">
            <p className="text-sm text-green-600 font-medium">
              ✓ Auth is working correctly outside middleware!
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              This page demonstrates that authentication is handled at the page/layout level,
              not in middleware.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

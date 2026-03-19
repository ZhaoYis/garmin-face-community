import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";

export default async function WatchfacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  if (!hasPermission(session.user.role, PERMISSIONS.UPLOAD_WATCHFACE)) {
    redirect("/forbidden");
  }

  return <>{children}</>;
}

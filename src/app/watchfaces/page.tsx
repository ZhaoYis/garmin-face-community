import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { WatchfaceUploadForm } from "./upload-form";

export default async function WatchfacesPage() {
  const session = await auth();

  if (!session?.user || !hasPermission(session.user.role, PERMISSIONS.UPLOAD_WATCHFACE)) {
    redirect("/forbidden");
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">上传表盘</h1>
      <WatchfaceUploadForm userId={session.user.id} />
    </div>
  );
}

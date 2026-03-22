import { WatchfaceUploadForm } from "./upload-form";

export default async function WatchfacesPage() {
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">上传表盘</h1>
      <WatchfaceUploadForm userId="anonymous" />
    </div>
  );
}

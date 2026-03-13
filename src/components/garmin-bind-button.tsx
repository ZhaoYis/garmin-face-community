"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface GarminBindButtonProps {
  isConnected: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function GarminBindButton({
  isConnected,
  onConnect: _onConnect,
  onDisconnect,
}: GarminBindButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/garmin");
      const data = await res.json();

      if (data.authUrl) {
        window.location.href = data.authUrl;
      }
    } catch (error) {
      console.error("Failed to get Garmin auth URL:", error);
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!confirm("确定要解绑佳明账号吗？")) return;

    setLoading(true);
    try {
      await fetch("/api/auth/garmin/disconnect", { method: "POST" });
      onDisconnect?.();
    } catch (error) {
      console.error("Failed to disconnect Garmin:", error);
    } finally {
      setLoading(false);
    }
  };

  if (isConnected) {
    return (
      <Button
        variant="outline"
        onClick={handleDisconnect}
        disabled={loading}
        className="w-full"
      >
        {loading ? "处理中..." : "解绑佳明账号"}
      </Button>
    );
  }

  return (
    <Button onClick={handleConnect} disabled={loading} className="w-full">
      {loading ? "跳转中..." : "绑定佳明账号"}
    </Button>
  );
}

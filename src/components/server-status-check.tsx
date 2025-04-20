"use client";

import { useEffect, useState } from "react";
import { checkServerStatus } from "@/lib/server-status";

type ServerStatusCheckProps = {
  children: React.ReactNode;
  fallback: React.ReactNode;
};

export default function ServerStatusCheck({
  children,
  fallback,
}: ServerStatusCheckProps) {
  const [isServerRunning, setIsServerRunning] = useState<boolean | null>(null);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const status = await checkServerStatus();
      setIsServerRunning(status);
      setHasChecked(true);
    };

    checkStatus();
  }, []);

  if (!hasChecked) {
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-150"></div>
            <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse delay-300"></div>
          </div>
          <p className="text-gray-400 text-sm">Checking server status...</p>
        </div>
      </div>
    );
  }

  if (!isServerRunning) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

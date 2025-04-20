"use client";

import React from "react";
import { motion } from "framer-motion";
import { RefreshCw, Server, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ServerStatusError() {
  const [isRetrying, setIsRetrying] = React.useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      window.location.reload();
    } catch (error) {
      console.error("Failed to retry connection:", error);
      setIsRetrying(false);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 bg-gradient-to-b from-gray-900 via-gray-950 to-black overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 
          bg-[linear-gradient(45deg,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(-45deg,rgba(255,255,255,0.03)_1px,transparent_1px)] 
          bg-[size:40px_40px]"
        ></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full bg-gray-900/50 backdrop-blur-xl p-8 rounded-2xl border border-gray-800/50 shadow-xl relative z-10"
      >
        <div className="flex flex-col items-center text-center">
          <div className="bg-red-900/20 p-4 rounded-full mb-6">
            <Server className="h-12 w-12 text-red-400" />
          </div>

          <h1 className="text-2xl font-medium text-white mb-2">
            Server Connection Error
          </h1>

          <div className="h-1 w-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full mb-4"></div>

          <p className="text-gray-300 mb-6">
            We couldn't connect to the AI server. The service might be offline
            or experiencing issues.
          </p>

          <div className="flex items-center gap-1.5 bg-red-950/30 px-3 py-1.5 rounded-full text-sm text-red-300 mb-6">
            <AlertTriangle className="h-4 w-4" />
            <span>Health check failed</span>
          </div>

          <Button
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-2 rounded-lg transition-all flex items-center justify-center"
          >
            {isRetrying ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Checking connection...
              </>
            ) : (
              "Try again"
            )}
          </Button>

          <p className="text-gray-500 text-sm mt-4">
            If the problem persists, please make sure the server is running at
            localhost:8000
          </p>
        </div>
      </motion.div>
    </div>
  );
}

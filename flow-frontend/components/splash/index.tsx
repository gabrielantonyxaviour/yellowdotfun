// components/splash/SplashScreen.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { Badge } from "../ui/badge";

export function SplashScreen({
  isAuthenticated,
  hasChannel,
  authenticateUser,
  connectionStatus,
  connectToWebSocket,
}: {
  isAuthenticated: boolean;
  hasChannel: boolean | null;
  authenticateUser: () => void;
  connectionStatus: string;
  connectToWebSocket: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const { connectAsync } = useConnect();
  const { address } = useAccount();

  const handleLogin = async () => {
    try {
      setLoading(true);
      await connectAsync({ connector: injected() });
      connectToWebSocket();

      setLoading(false);
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
    }
  };

  const handleCreateChannel = async () => {
    try {
      setLoading(true);
      // TODO: Create a channel
    } catch (error) {
      console.error("Create channel error:", error);
    }
  };

  const handleAuthenticateChannel = async () => {
    try {
      setLoading(true);
      authenticateUser();
      setLoading(false);
    } catch (error) {
      console.error("Authenticate channel error:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 flex flex-col items-center justify-between p-6">
      <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
        <div className="space-y-4">
          <Image src="/logo.png" alt="Yellow.fun" width={120} height={120} />
          <h1 className="text-4xl font-black text-black">yellow.fun</h1>
        </div>
        <p className="text-lg font-bold text-black/80 max-w-sm leading-relaxed">
          Faster, cheaper, and EVM-secured alternative for pump.fun, built using
          ERC7824
        </p>
      </div>

      {connectionStatus === "connected" && (
        <Badge className={`bg-green-500 cursor-pointer mb-3`}>
          {connectionStatus}
        </Badge>
      )}

      {!address ? (
        <Button
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex space-x-2 max-w-sm bg-black text-yellow-400 hover:bg-black/90 py-6 rounded-2xl font-bold text-lg border-2 border-black shadow-lg"
        >
          <Image
            src="/flow.png"
            alt="Flow"
            width={20}
            height={20}
            className="rounded-full"
          />
          <p className="text-sm font-semibold">Sign in with Flow</p>
        </Button>
      ) : !isAuthenticated ? (
        <Button
          onClick={handleAuthenticateChannel}
          disabled={loading}
          className="w-full flex space-x-2 max-w-sm bg-black text-yellow-400 hover:bg-black/90 py-6 rounded-2xl font-bold text-lg border-2 border-black shadow-lg"
        >
          <Image
            src="/yellow.jpg"
            alt="Yellow"
            width={20}
            height={20}
            className="rounded-full"
          />
          <p className="text-sm font-semibold">Authenticate your Channel</p>
        </Button>
      ) : (
        hasChannel == false && (
          <>
            <p className="text-md text-center pb-4 font-medium text-black/80 max-w-sm leading-relaxed">
              You don't have a channel yet. Create one to start trading.
            </p>
            <Button
              onClick={handleCreateChannel}
              disabled={loading}
              className="w-full flex space-x-2 max-w-sm bg-black text-yellow-400 hover:bg-black/90 py-6 rounded-2xl font-bold text-lg border-2 border-black shadow-lg"
            >
              <Image
                src="/yellow.jpg"
                alt="Yellow"
                width={20}
                height={20}
                className="rounded-full"
              />
              <p className="text-sm font-semibold">Create a channel</p>
            </Button>
          </>
        )
      )}
    </div>
  );
}

// components/splash/SplashScreen.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";
import { Badge } from "../ui/badge";
import { Loader2 } from "lucide-react";
import { useConnectWallet, usePrivy } from "@privy-io/react-auth";

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
  const { address } = useAccount();
  const { connectWallet } = useConnectWallet({
    onSuccess: ({ wallet }) => {
      connectToWebSocket();
      setLoading(false);
      console.log(wallet);
    },
    onError: (error) => {
      console.log(error);
      setLoading(false);
    },
  });

  const handleLogin = async () => {
    try {
      setLoading(true);
      connectWallet();
    } catch (error) {
      console.error("Login error:", error);
      setLoading(false);
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
          <Image
            src="/logo.png"
            alt="Yellow.fun"
            width={120}
            height={120}
            className="mx-auto"
          />
          <h1 className="text-4xl font-black text-black">yellow.fun</h1>
        </div>
        <p className="text-lg font-bold text-black/80 max-w-sm leading-relaxed">
          Faster, cheaper, and EVM-secured alternative for pump.fun, built using
          ERC7824
        </p>
      </div>

      <Badge
        className={`${
          connectionStatus === "connected"
            ? "bg-green-500 hover:bg-green-600 cursor-default"
            : connectionStatus === "connecting"
            ? "bg-yellow-500 hover:bg-yellow-600 cursor-default"
            : "bg-red-500 hover:bg-red-600 cursor-pointer"
        }  cursor-pointer mb-3`}
        onClick={() => {
          if (connectionStatus === "disconnected") {
            connectToWebSocket();
          }
        }}
      >
        {connectionStatus}
      </Badge>
      {!address ? (
        <Button
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex space-x-2 max-w-sm bg-black text-yellow-400 hover:bg-black/90 py-6 rounded-2xl font-bold text-lg border-2 border-black shadow-lg"
        >
          {loading ? (
            <Loader2 className="animate-spin" />
          ) : (
            <p className="text-sm font-semibold">Connect Wallet</p>
          )}
        </Button>
      ) : (
        !isAuthenticated && (
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
        )
      )}
    </div>
  );
}

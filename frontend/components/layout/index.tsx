"use client";

import { AppHeader } from "./app-header";
import { SplashScreen } from "../splash";
import { useAccount } from "wagmi";
import { useNitrolite } from "@/hooks/use-nitrolite";
import { Address } from "viem";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();
  const {
    connectionStatus,
    connectToWebSocket,
    authenticateUser,
    hasChannel,
    isAuthenticated,
    usdBalance,
  } = useNitrolite();

  return address && hasChannel ? (
    <div className="min-h-screen bg-black">
      <AppHeader
        usdBalance={usdBalance}
        connectionStatus={connectionStatus}
        connectToWebSocket={connectToWebSocket}
      />
      {children}
    </div>
  ) : (
    <SplashScreen
      isAuthenticated={isAuthenticated}
      hasChannel={hasChannel}
      authenticateUser={authenticateUser}
      connectionStatus={connectionStatus}
      connectToWebSocket={connectToWebSocket}
    />
  );
}

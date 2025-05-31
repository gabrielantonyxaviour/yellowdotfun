"use client";

import { AppHeader } from "./app-header";
import { SplashScreen } from "../splash";
import { useAccount, useConnect } from "wagmi";
import { useNitrolite } from "@/hooks/use-nitrolite";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();
  const { connectionStatus, connectToWebSocket } = useNitrolite();
  return address ? (
    <div className="min-h-screen bg-black">
      <AppHeader
        connectionStatus={connectionStatus}
        connectToWebSocket={connectToWebSocket}
      />
      {children}
    </div>
  ) : (
    <SplashScreen connectToWebSocket={connectToWebSocket} />
  );
}

"use client";

import { AppHeader } from "./app-header";
import { SplashScreen } from "../splash";
import { useAccount, useWalletClient } from "wagmi";
import { useNitrolite } from "@/hooks/use-nitrolite";
import { Address } from "viem";
import { usePrivy } from "@privy-io/react-auth";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();
  const { logout } = usePrivy();
  const { data: walletClient } = useWalletClient();
  const {
    connectionStatus,
    connectToWebSocket,
    authenticateUser,
    hasChannel,
    isAuthenticated,
    usdBalance,
  } = useNitrolite(address, walletClient);

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
      logout={() => {
        logout();
      }}
      hasChannel={hasChannel}
      authenticateUser={authenticateUser}
      connectionStatus={connectionStatus}
      connectToWebSocket={connectToWebSocket}
    />
  );
}

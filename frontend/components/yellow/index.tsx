"use client";

import { useEffect, useState } from "react";
import { WalletConnect } from "@/components/wallet-connect";
import { ChannelSetup } from "@/components/channel-setup";
import { useWallet } from "@/hooks/use-nitrolite";
import { ChannelData } from "@/lib/nitrolite/service";
import { TestingWebSocket } from "../testing-web-socket";

export default function YellowTesting() {
  const { address, connected } = useWallet();
  const [channelData, setChannelData] = useState<ChannelData | null>(null);
  useEffect(() => {
    console.log("channelData", channelData);
    console.log("address", address);
    console.log("connected", connected);
  }, [channelData, address, connected]);
  return (
    <main className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Nitrolite App</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WalletConnect />

        {connected && address && (
          <ChannelSetup
            walletAddress={address}
            onChannelCreated={setChannelData}
          />
        )}
      </div>

      {channelData && (
        <div className="p-4 bg-green-50 rounded-lg">
          <h3 className="font-semibold">Channel Created!</h3>
          <p className="text-sm text-muted-foreground">
            Channel ID: {channelData.channelId}
          </p>
        </div>
      )}

      <TestingWebSocket />
    </main>
  );
}

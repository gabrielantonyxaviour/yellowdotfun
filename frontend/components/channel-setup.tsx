"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNitrolite } from "@/hooks/use-nitrolite";
import { ethers } from "ethers";
import { ChannelData } from "@/lib/nitrolite/service";

interface ChannelSetupProps {
  walletAddress: string;
  onChannelCreated: (channelData: ChannelData) => void;
}

export function ChannelSetup({
  walletAddress,
  onChannelCreated,
}: ChannelSetupProps) {
  const { initialize, createChannel, isInitialized, loading } = useNitrolite();
  const [depositAmount, setDepositAmount] = useState("0.1");

  const handleCreateChannel = async () => {
    try {
      console.log("Starting channel creation process...");

      if (!isInitialized) {
        console.log("Initializing Nitrolite client...");
        await initialize(walletAddress);
        console.log("Nitrolite client initialized successfully");
      }

      console.log(`Converting deposit amount ${depositAmount} ETH to Wei...`);
      const amountWei = ethers.utils.parseEther(depositAmount);
      console.log(`Deposit amount in Wei: ${amountWei.toString()}`);

      console.log("Creating channel...");
      const channelData = await createChannel(BigInt(amountWei.toString()));
      console.log("Channel created successfully:", channelData);

      onChannelCreated(channelData);
    } catch (error) {
      console.error("Error creating channel:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Channel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Deposit Amount (ETH)</label>
          <Input
            type="number"
            step="0.01"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            placeholder="0.1"
          />
        </div>
        <Button
          onClick={handleCreateChannel}
          disabled={loading || !walletAddress}
          className="w-full"
        >
          {loading ? "Creating..." : "Create Channel"}
        </Button>
      </CardContent>
    </Card>
  );
}

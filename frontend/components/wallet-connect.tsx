"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useWallet } from "@/hooks/use-nitrolite";

export function WalletConnect() {
  const { address, connected, connect, disconnect } = useWallet();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet Connection</CardTitle>
      </CardHeader>
      <CardContent>
        {connected ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </p>
            <Button onClick={disconnect} variant="outline" className="w-full">
              Disconnect
            </Button>
          </div>
        ) : (
          <Button onClick={connect} className="w-full">
            Connect Wallet
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

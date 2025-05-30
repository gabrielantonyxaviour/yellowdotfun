// components/debug/trading-debug.tsx
"use client";

import { useTradingStore } from "@/lib/trading-store";
import { Card } from "@/components/ui/card";

export function TradingDebug({ tokenId }: { tokenId: string }) {
  const token = useTradingStore((state) => state.tokens[tokenId]);
  const isSimulating = useTradingStore((state) => state.isSimulating);

  if (!token) return null;

  return (
    <Card className="p-4 mb-4 bg-blue-50">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div className="text-sm space-y-1">
        <p>Simulation Running: {isSimulating ? "Yes" : "No"}</p>
        <p>Holders: {Object.keys(token.holders).length}</p>
        <p>Transactions: {token.transactions.length}</p>
        <p>Real Collateral: {token.realCollateral} ETH</p>
        <p>Virtual Collateral: {token.virtualCollateral} ETH</p>
        <p>Virtual Token Supply: {token.virtualTokenSupply}</p>
      </div>
    </Card>
  );
}

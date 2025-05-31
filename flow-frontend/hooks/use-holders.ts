// hooks/use-holders.ts
"use client";

import { useTradingStore } from "@/lib/trading-store";

export function useHolders(tokenId: string) {
  // Subscribe to the specific token's holders
  const token = useTradingStore((state) => state.tokens[tokenId]);

  const holders = token
    ? Object.entries(token.holders)
        .map(([address, balance]) => {
          const totalSupply = Object.values(token.holders).reduce(
            (sum, bal) => sum + bal,
            0
          );
          return {
            address,
            balance,
            percentage: totalSupply > 0 ? (balance / totalSupply) * 100 : 0,
          };
        })
        .sort((a, b) => b.balance - a.balance)
        .slice(0, 50)
    : [];

  return {
    holders,
    isLoading: false,
  };
}

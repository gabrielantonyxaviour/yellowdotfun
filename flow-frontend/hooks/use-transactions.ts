// hooks/use-transactions.ts
"use client";

import { useTradingStore } from "@/lib/trading-store";

export function useTransactions(tokenId: string) {
  // Subscribe to the specific token's transactions
  const transactions = useTradingStore(
    (state) =>
      state.tokens[tokenId]?.transactions.map((tx) => ({
        id: tx.id,
        type: tx.type,
        from: tx.from,
        amount: tx.amount,
        price: tx.ethAmount,
        timestamp: tx.timestamp,
      })) || []
  );

  return {
    transactions,
    isLoading: false,
  };
}

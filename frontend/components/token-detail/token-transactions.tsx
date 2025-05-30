// Updated TokenTransactions component with better formatting
"use client";

import { useTransactions } from "@/hooks/use-transactions";
import { Skeleton } from "@/components/ui/skeleton";
import { formatAddress, formatNumber } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface TokenTransactionsProps {
  tokenId: string;
}

export function TokenTransactions({ tokenId }: TokenTransactionsProps) {
  const { transactions, isLoading } = useTransactions(tokenId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No transactions yet. Start trading!
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="flex items-center justify-between p-3 bg-white cartoon-border rounded-lg"
        >
          <div className="flex items-center gap-3">
            {tx.type === "buy" ? (
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <ArrowUpRight className="h-5 w-5 text-green-600" />
              </div>
            ) : (
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <ArrowDownRight className="h-5 w-5 text-red-600" />
              </div>
            )}
            <div>
              <p className="font-bold capitalize">{tx.type}</p>
              <p className="text-sm text-gray-600">{formatAddress(tx.from)}</p>
              <p className="text-xs text-gray-500">
                {new Date(tx.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold">{formatNumber(tx.amount)} tokens</p>
            <p className="text-sm text-gray-600">
              {formatNumber(tx.price)} ETH
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// Updated TokenHolders component with better formatting
"use client";

import { useHolders } from "@/hooks/use-holders";
import { Skeleton } from "@/components/ui/skeleton";
import { formatAddress, formatNumber, formatPercentage } from "@/lib/utils";

interface TokenHoldersProps {
  tokenId: string;
}

export function TokenHolders({ tokenId }: TokenHoldersProps) {
  const { holders, isLoading } = useHolders(tokenId);

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (holders.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No holders yet. Be the first to buy!
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {holders.map((holder, index) => (
        <div
          key={holder.address}
          className="flex items-center justify-between p-3 bg-yellow-50 cartoon-border rounded-lg"
        >
          <div className="flex items-center gap-3">
            <span className="font-bold text-lg">#{index + 1}</span>
            <span className="font-medium">{formatAddress(holder.address)}</span>
          </div>
          <div className="text-right">
            <p className="font-bold">{formatNumber(holder.balance)}</p>
            <p className="text-sm text-gray-600">
              {formatPercentage(holder.percentage)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

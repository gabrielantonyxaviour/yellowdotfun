// components/tokens/TokenCard.tsx - Updated for mobile
"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatNumber, formatPercentage } from "@/lib/utils";

interface TokenCardProps {
  token: {
    id: string;
    name: string;
    symbol: string;
    price: number;
    priceChange24h: number;
    marketCap: number;
    volume24h: number;
  };
}

export function TokenCard({ token }: TokenCardProps) {
  const isPositive = token.priceChange24h > 0;

  return (
    <Link href={`/token/${token.id}`}>
      <Card className="bg-stone-800 border-2 border-stone-600 rounded-xl p-4 hover:border-yellow-400 transition-colors active:scale-95 transform transition-transform">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-stone-600">
            {/* Image stays same */}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white truncate">{token.name}</h3>
            <p className="text-sm text-stone-400 font-medium">
              ${token.symbol}
            </p>
          </div>

          <div className="text-right">
            <p className="font-bold text-white">${formatNumber(token.price)}</p>
            {/* Price change colors stay green/red */}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-stone-700">
          <div>
            <p className="text-xs text-stone-400 font-medium">Market Cap</p>
            <p className="text-sm font-bold text-white">
              ${formatNumber(token.marketCap)}
            </p>
          </div>
          <div>
            <p className="text-xs text-stone-400 font-medium">Volume 24h</p>
            <p className="text-sm font-bold text-white">
              ${formatNumber(token.volume24h)}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

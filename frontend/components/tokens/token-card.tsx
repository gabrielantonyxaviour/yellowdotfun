// components/tokens/token-card.tsx
"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, Users, Activity } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatNumber, formatPercentage } from "@/lib/utils";

interface TokenCardProps {
  token: {
    id: string;
    token_name: string;
    token_symbol: string;
    token_image?: string;
    token_market_data?: {
      current_price_usd: number;
      market_cap_usd: number;
      volume_24h: number;
    };
  };
}

export function TokenCard({ token }: TokenCardProps) {
  const priceChange24h = Math.random() * 40 - 20; // Mock data
  const isPositive = priceChange24h >= 0;
  const price = token.token_market_data?.current_price_usd || 0;
  const marketCap = token.token_market_data?.market_cap_usd || 0;
  const volume = token.token_market_data?.volume_24h || 0;

  return (
    <Card className="bg-stone-800 border-stone-600 hover:border-yellow-400 transition-all duration-200 group">
      <div className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-stone-600 group-hover:border-yellow-400 transition-colors">
            <Image
              src={token.token_image || "/placeholder.svg?height=48&width=48"}
              alt={token.token_name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-black text-white truncate">
              {token.token_name}
            </h3>
            <p className="text-sm font-bold text-yellow-400">
              ${token.token_symbol}
            </p>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-xs text-stone-400">Price</span>
            <div className="flex items-center gap-1">
              <span className="font-bold text-white">${price}</span>
              {/* <span
                className={`text-xs flex items-center gap-1 ${
                  isPositive ? "text-green-400" : "text-red-400"
                }`}
              >
                {isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {formatPercentage(priceChange24h)}
              </span> */}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-stone-400">Market Cap</span>
            <span className="text-xs font-bold text-white">
              ${formatNumber(marketCap)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-xs text-stone-400">24h Volume</span>
            <span className="text-xs font-bold text-white">
              ${formatNumber(volume)}
            </span>
          </div>
        </div>

        <Link href={`/token/${token.id}`}>
          <Button className="w-full bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 hover:from-yellow-500 hover:via-yellow-300 hover:to-yellow-500 text-black font-bold rounded-xl">
            Trade Now
          </Button>
        </Link>
      </div>
    </Card>
  );
}

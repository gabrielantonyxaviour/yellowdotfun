// components/tokens/token-card.tsx
"use client";

import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, ShoppingCart, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatNumber, formatPercentage } from "@/lib/utils";

interface TokenCardProps {
  token: {
    id: string;
    token_name: string;
    token_symbol: string;
    token_image?: string;
    latest_price: number;
    price_change_24h: number;
    buy_count: number;
    sell_count: number;
  };
}

export function TokenCard({ token }: TokenCardProps) {
  const isPositive = token.price_change_24h > 0;

  return (
    <Link href={`/token/${token.id}`}>
      <Card className="bg-stone-800 border-2 border-stone-600 rounded-xl p-4 hover:border-yellow-400 transition-colors active:scale-95 transform transition-transform">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-stone-600">
            <Image
              src={token.token_image || "/placeholder.svg?height=48&width=48"}
              alt={token.token_name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-white truncate">
              {token.token_name}
            </h3>
            <p className="text-sm text-stone-400 font-medium">
              ${token.token_symbol}
            </p>
          </div>

          <div className="text-right">
            <p className="font-bold text-white">
              ${formatNumber(token.latest_price)}
            </p>
            <p
              className={`text-sm font-bold flex items-center gap-1 ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {formatPercentage(token.price_change_24h)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-stone-700">
          <div>
            <div className="flex items-center gap-1 mb-1">
              <ShoppingCart className="h-3 w-3 text-stone-400" />
              <p className="text-xs text-stone-400 font-medium">Buys</p>
            </div>
            <p className="text-sm font-bold text-white">
              {parseInt(token.buy_count.toString()).toLocaleString()}
            </p>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <Store className="h-3 w-3 text-stone-400" />
              <p className="text-xs text-stone-400 font-medium">Sells</p>
            </div>
            <p className="text-sm font-bold text-white">
              {parseInt(token.sell_count.toString()).toLocaleString()}
            </p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

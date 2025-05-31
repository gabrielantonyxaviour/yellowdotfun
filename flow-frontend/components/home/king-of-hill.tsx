// components/home/KingOfHill.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Crown, TrendingUp, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatNumber, formatPercentage } from "@/lib/utils";

export function KingOfHill() {
  const kingToken = {
    id: "1",
    name: "Yellow Doge",
    symbol: "YDOGE",
    price: 0.0234,
    priceChange24h: 145.67,
    marketCap: 2340000,
    volume24h: 567000,
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-3 px-1">
        <Crown className="h-5 w-5 text-yellow-600" />
        <h2 className="text-lg font-semibold text-white">King of the Hill</h2>
      </div>

      <div className="bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 rounded-2xl p-4 border-2 border-stone-600 shadow-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-black">
            <Image
              src="/placeholder.svg?height=48&width=48"
              alt={kingToken.name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-black text-black">{kingToken.name}</h3>
            <p className="text-sm font-bold text-black/80">
              ${kingToken.symbol}
            </p>
          </div>

          <div className="text-right">
            <p className="text-lg font-black text-black">
              ${formatNumber(kingToken.price)}
            </p>
            <p className="text-sm font-bold text-green-700 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />+
              {formatPercentage(kingToken.priceChange24h)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-black/20 rounded-lg p-2">
            <p className="text-xs font-medium text-black/80">Market Cap</p>
            <p className="text-sm font-bold text-black">
              ${formatNumber(kingToken.marketCap)}
            </p>
          </div>
          <div className="bg-black/20 rounded-lg p-2">
            <p className="text-xs font-medium text-black/80">Volume 24h</p>
            <p className="text-sm font-bold text-black">
              ${formatNumber(kingToken.volume24h)}
            </p>
          </div>
        </div>

        <Link href={`/token/${kingToken.id}`}>
          <Button className="w-full bg-black text-yellow-400 hover:bg-black/90 rounded-xl py-3 font-bold">
            Trade Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

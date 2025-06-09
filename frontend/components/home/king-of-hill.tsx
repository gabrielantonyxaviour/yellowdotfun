// components/home/KingOfHill.tsx
"use client";
import { Button } from "@/components/ui/button";
import {
  Crown,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  ShoppingCart,
  Store,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatNumber, formatPercentage } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { getKingToken } from "@/lib/api";

export function KingOfHill({
  kingToken,
  isLoading,
}: {
  kingToken: any;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 px-1">
          <Crown className="h-5 w-5 text-yellow-600" />
          <h2 className="text-lg font-semibold text-white">King of the Hill</h2>
        </div>
        <Skeleton className="h-48 w-full rounded-2xl bg-stone-800" />
      </div>
    );
  }

  if (!kingToken) {
    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3 px-1">
          <Crown className="h-5 w-5 text-yellow-600" />
          <h2 className="text-lg font-semibold text-white">King of the Hill</h2>
        </div>
        <div className="bg-stone-800 rounded-2xl p-4 border-2 border-stone-600">
          <p className="text-center text-sm text-stone-400">
            No tokens available yet
          </p>
        </div>
      </div>
    );
  }

  const isPositive = kingToken.price_change_24h >= 0;

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
              src={
                kingToken.token_image || "/placeholder.svg?height=48&width=48"
              }
              alt={kingToken.token_name}
              width={48}
              height={48}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-black text-black">
              {kingToken.token_name}
            </h3>
            <p className="text-sm font-bold text-black/80">
              ${kingToken.token_symbol}
            </p>
          </div>

          <div className="text-right">
            <p className="text-lg font-black text-black">
              ${formatNumber(kingToken.latest_price)}
            </p>
            <p
              className={`text-sm font-bold flex items-center gap-1 ${
                isPositive ? "text-green-700" : "text-red-700"
              }`}
            >
              {isPositive ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {formatPercentage(kingToken.price_change_24h)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-black/20 rounded-lg p-2">
            <div className="flex items-center gap-1 mb-1">
              <ShoppingCart className="h-3 w-3 text-black/80" />
              <p className="text-xs font-medium text-black/80">Buy Count</p>
            </div>
            <p className="text-sm font-bold text-black">
              {parseInt(kingToken.buy_count.toString()).toLocaleString()}
            </p>
          </div>
          <div className="bg-black/20 rounded-lg p-2">
            <div className="flex items-center gap-1 mb-1">
              <Store className="h-3 w-3 text-black/80" />
              <p className="text-xs font-medium text-black/80">Sell Count</p>
            </div>
            <p className="text-sm font-bold text-black">
              {parseInt(kingToken.sell_count.toString()).toLocaleString()}
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

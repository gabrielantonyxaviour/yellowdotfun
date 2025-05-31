// app/api/prices/route.ts
import { NextRequest, NextResponse } from "next/server";

type ChainId =
  | 1
  | 137
  | 43114
  | 56
  | 8453
  | 11155111
  | 80002
  | 43113
  | 97
  | 84532;

const COINGECKO_IDS: Record<ChainId, { native: string; usdc: string }> = {
  1: { native: "ethereum", usdc: "usd-coin" },
  137: { native: "matic-network", usdc: "usd-coin" },
  43114: { native: "avalanche-2", usdc: "usd-coin" },
  56: { native: "binancecoin", usdc: "usd-coin" },
  8453: { native: "ethereum", usdc: "usd-coin" },
  11155111: { native: "ethereum", usdc: "usd-coin" },
  80002: { native: "matic-network", usdc: "usd-coin" },
  43113: { native: "avalanche-2", usdc: "usd-coin" },
  97: { native: "binancecoin", usdc: "usd-coin" },
  84532: { native: "ethereum", usdc: "usd-coin" },
};

const cache = new Map();
const CACHE_DURATION = 30000;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const chainId = searchParams.get("chainId");

  if (!chainId || !COINGECKO_IDS[Number(chainId) as ChainId]) {
    return NextResponse.json({ error: "Invalid chain ID" }, { status: 400 });
  }

  const cacheKey = `prices-${chainId}`;
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json(cached.data);
  }

  try {
    const { native, usdc } = COINGECKO_IDS[Number(chainId) as ChainId];
    const ids = [native, usdc].join(",");

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
      {
        headers: {
          Accept: "application/json",
        },
        next: { revalidate: 30 }, // App Router caching
      }
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();

    const prices = {
      native: data[native]?.usd || 0,
      usdc: data[usdc]?.usd || 1,
    };

    cache.set(cacheKey, {
      data: prices,
      timestamp: Date.now(),
    });

    return NextResponse.json(prices);
  } catch (error) {
    console.error("Price fetch error:", error);
    return NextResponse.json({ native: 0, usdc: 1 });
  }
}

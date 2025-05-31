import { NextRequest, NextResponse } from "next/server";

interface TokenPrice {
  usd: number;
}

interface PriceResponse {
  [key: string]: TokenPrice;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { error: "Token parameter required" },
      { status: 400 }
    );
  }

  try {
    // CoinGecko API for token prices
    const tokenIds: Record<string, string> = {
      FLOW: "flow",
      WORLD: "worldcoin-wld",
    };

    const coinGeckoId = tokenIds[token.toUpperCase()];
    if (!coinGeckoId) {
      return NextResponse.json({ error: "Unsupported token" }, { status: 400 });
    }

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coinGeckoId}&vs_currencies=usd`,
      { next: { revalidate: 30 } } // Cache for 30 seconds
    );

    if (!response.ok) {
      throw new Error("Failed to fetch price");
    }

    const data = await response.json();

    return NextResponse.json({
      [token.toUpperCase()]: {
        usd: data[coinGeckoId]?.usd || 0,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch token price" },
      { status: 500 }
    );
  }
}

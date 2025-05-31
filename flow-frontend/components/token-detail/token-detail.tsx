// Updated TokenDetail component to properly initialize the token
"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TradingChart } from "@/components/token-detail/trading-chart";
import { TradingPanel } from "@/components/trading/trading-panel";
import { TokenInfo } from "@/components/token-detail/token-info";
import { TokenHolders } from "@/components/token-detail/token-holders";
import { TokenTransactions } from "@/components/token-detail/token-transactions";
import Image from "next/image";
import { formatNumber, formatPercentage } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useTradingStore } from "@/lib/trading-store";
import { tradingSimulator } from "@/lib/trading-simulator";

// Mock token data
const mockToken = {
  id: "1",
  name: "Yellow Doge",
  symbol: "YDOGE",
  description:
    "Yellow Doge is the first memecoin on yellow.fun, combining the power of Yellow Protocol with the fun of memecoins. To the moon!",
  price: 0.0234,
  priceChange24h: 45.67,
  marketCap: 2340000,
  volume24h: 567000,
  holders: 1234,
  rank: 1,
  createdAt: new Date().toISOString(),
  creatorAddress: "0x1234567890123456789012345678901234567890",
  contractAddress: "0xabcdefghijklmnopqrstuvwxyz1234567890abcdef",
  chainId: 1,
};

interface TokenDetailProps {
  tokenId: string;
}

export function TokenDetail({ tokenId }: TokenDetailProps) {
  const [activeTab, setActiveTab] = useState("holders");

  // Subscribe to token updates
  const token = useTradingStore((state) => state.tokens[tokenId]);
  const { createToken, getTokenPrice } = useTradingStore();

  const currentPrice = token ? getTokenPrice(tokenId) : 0;
  const isPositive = currentPrice > 0.0234; // Compare with initial price

  // Initialize token and start simulation
  useEffect(() => {
    if (!token) {
      // Create the token with proper bonding curve parameters
      const newTokenId = createToken({
        name: mockToken.name,
        symbol: mockToken.symbol,
        description: mockToken.description,
        totalSupply: 1000000000, // 1B tokens
        virtualCollateral: 30, // 30 ETH initial virtual reserves
        virtualTokenSupply: 1000000000, // 1B virtual token supply
        realCollateral: 0,
        creatorAddress: mockToken.creatorAddress,
      });

      console.log("Created token:", newTokenId);
    }

    // Start simulation after a short delay to ensure token exists
    const timer = setTimeout(() => {
      console.log("Starting simulation for token:", tokenId);
      tradingSimulator.start([tokenId]);
    }, 100);

    return () => {
      clearTimeout(timer);
      tradingSimulator.stop();
    };
  }, [tokenId, token, createToken]);

  // Show loading state if token isn't created yet
  if (!token) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <p>Initializing token...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Token Header */}
      <div className="flex items-center gap-4 p-4 bg-white yellow-border rounded-lg">
        <div className="w-16 h-16 relative">
          <Image
            src="/placeholder.svg?height=64&width=64"
            alt={token.name}
            width={64}
            height={64}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex-grow">
          <h1 className="text-2xl font-black">{token.name}</h1>
          <p className="text-lg font-bold text-gray-600">${token.symbol}</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black">${formatNumber(currentPrice)}</p>
          <p
            className={`text-lg font-bold flex items-center justify-end gap-1 ${
              isPositive ? "text-green-600" : "text-red-600"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="h-5 w-5" />
            ) : (
              <TrendingDown className="h-5 w-5" />
            )}
            {formatPercentage(isPositive ? 15.5 : -8.2)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Chart */}
          <Card className="yellow-border yellow-shadow bg-card p-0">
            <TradingChart tokenId={tokenId} />
          </Card>

          {/* Holders/Transactions Tabs */}
          <Card className="yellow-border yellow-shadow bg-card">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full yellow-border border-b-0 rounded-b-none">
                <TabsTrigger value="holders" className="flex-1 font-bold">
                  Holders ({Object.keys(token.holders).length})
                </TabsTrigger>
                <TabsTrigger value="transactions" className="flex-1 font-bold">
                  Transactions ({token.transactions.length})
                </TabsTrigger>
              </TabsList>
              <TabsContent value="holders" className="p-4">
                <TokenHolders tokenId={tokenId} />
              </TabsContent>
              <TabsContent value="transactions" className="p-4">
                <TokenTransactions tokenId={tokenId} />
              </TabsContent>
            </Tabs>
          </Card>

          {/* About and Stats */}
          <Card className="yellow-border yellow-shadow bg-card p-6">
            <h2 className="text-xl font-black mb-4">About {token.name}</h2>
            <p className="text-gray-600 mb-6">{token.description}</p>
            <TokenInfo
              token={{
                id: token.id,
                name: token.name,
                symbol: token.symbol,
                description: token.description,
                price: currentPrice,
                priceChange24h: isPositive ? 15.5 : -8.2,
                marketCap:
                  currentPrice * (token.totalSupply - token.virtualTokenSupply),
                volume24h: token.transactions
                  .slice(0, 24)
                  .reduce((sum, tx) => sum + tx.ethAmount, 0),
                holders: Object.keys(token.holders).length,
                rank: 1,
              }}
            />
          </Card>

          {/* Comments Section */}
          <Card className="yellow-border yellow-shadow bg-card p-6">
            <h2 className="text-xl font-black mb-4">Comments</h2>
            <div className="text-center py-8 text-gray-500">
              Comments coming soon...
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <TradingPanel
            token={{
              id: token.id,
              name: token.name,
              symbol: token.symbol,
              price: currentPrice,
            }}
          />
        </div>
      </div>
    </div>
  );
}

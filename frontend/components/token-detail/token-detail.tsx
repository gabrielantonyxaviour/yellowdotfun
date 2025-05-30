"use client";

import { useState } from "react";
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
  creatorAddress: "0x1234...5678",
  contractAddress: "0xabcd...efgh",
  chainId: 1,
};

interface TokenDetailProps {
  tokenId: string;
}

export function TokenDetail({ tokenId }: TokenDetailProps) {
  const [activeTab, setActiveTab] = useState("holders");
  const token = mockToken;
  const isPositive = token.priceChange24h >= 0;

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
          <p className="text-2xl font-black">${formatNumber(token.price)}</p>
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
            {formatPercentage(token.priceChange24h)}
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
                  Holders
                </TabsTrigger>
                <TabsTrigger value="transactions" className="flex-1 font-bold">
                  Transactions
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
            <TokenInfo token={token} />
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
          <TradingPanel token={token} />
        </div>
      </div>
    </div>
  );
}

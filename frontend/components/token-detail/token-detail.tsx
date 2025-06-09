"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TradingChart } from "@/components/token-detail/trading-chart";
import { TradingPanel } from "@/components/trading/trading-panel";
import { TokenInfo } from "@/components/token-detail/token-info";
import { TokenHolders } from "@/components/token-detail/token-holders";
import { TokenTransactions } from "@/components/token-detail/token-transactions";
import { useTokenData } from "@/hooks/use-token-data";
import Image from "next/image";
import { formatNumber, formatPercentage } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { useTradingStore } from "@/lib/trading-store";
import { tradingSimulator } from "@/lib/trading-simulator";
import { getTokenById, getTokenTransactions } from "@/lib/api";

interface TokenDetailProps {
  tokenId: string;
}

export function TokenDetail({ tokenId }: TokenDetailProps) {
  const [token, setToken] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTokenData() {
      try {
        setIsLoading(true);
        const [tokenData, transactionData] = await Promise.all([
          getTokenById(tokenId),
          getTokenTransactions(tokenId),
        ]);

        setToken(tokenData);
        setTransactions(transactionData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTokenData();
  }, [tokenId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">Loading...</div>
    );
  }

  if (error || !token) {
    return (
      <div className="flex items-center justify-center h-64">
        Token not found
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Token Header */}
      <div className="flex items-center gap-4 p-4 bg-stone-800 rounded-lg">
        <div className="w-16 h-16 relative">
          <Image
            src={token.token_image || "/placeholder.svg?height=64&width=64"}
            alt={token.token_name}
            width={64}
            height={64}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="flex-grow">
          <h1 className="text-2xl font-black text-white">{token.token_name}</h1>
          <p className="text-md font-semibold text-yellow-400">
            ${token.token_symbol}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-stone-800 rounded-lg shadow-lg">
            <TradingChart tokenId={tokenId} transactions={transactions} />
          </div>

          {/* Holders/Transactions Tabs */}
          {/* <Card className="yellow-border yellow-shadow bg-card">
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
          </Card> */}

          {/* About and Stats */}
          {/* <Card className="yellow-border yellow-shadow bg-card p-6">
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
          </Card> */}

          {/* Comments Section */}
          {/* <Card className="bg-stone-800 rounded-lg shadow-lg border-none p-6">
            <h2 className="text-xl font-black text-white mb-4">Comments</h2>
            <div className="text-center py-8 text-gray-500">
              Comments coming soon...
            </div>
          </Card> */}
        </div>

        <div className="space-y-6">
          <TradingPanel
            token={{
              id: token.id,
              name: token.token_name,
              symbol: token.token_symbol,
              price: token.token_market_data?.current_price_usd || 0,
            }}
          />
        </div>
      </div>
    </div>
  );
}

// components/home/TokensGrid.tsx
"use client";

import { TokenCard } from "@/components/tokens/token-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTokenStats } from "@/hooks/use-token-stats";
import { Skeleton } from "@/components/ui/skeleton";

export function TokensGrid() {
  const { tokens, isLoading } = useTokenStats();
  const [visibleTokens, setVisibleTokens] = useState(6);
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "All", emoji: "🔥" },
    { id: "trending", label: "Trending", emoji: "📈" },
    { id: "new", label: "New", emoji: "🆕" },
    { id: "gainers", label: "Gainers", emoji: "🚀" },
    { id: "losers", label: "Losers", emoji: "📉" },
  ];

  const filteredTokens = tokens.filter((token) => {
    switch (activeFilter) {
      case "trending":
        return token.buy_count > 5; // Tokens with more than 5 buys
      case "new":
        return token.buy_count + token.sell_count < 5; // New tokens with few transactions
      case "gainers":
        return token.price_change_24h > 0;
      case "losers":
        return token.price_change_24h < 0;
      default:
        return true;
    }
  });

  const loadMore = () => {
    setVisibleTokens((prev) => prev + 6);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2 pb-2">
            {filters.map((filter) => (
              <Skeleton
                key={filter.id}
                className="h-8 w-20 rounded-full bg-stone-800"
              />
            ))}
          </div>
        </ScrollArea>
        <div className="grid grid-cols-1 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl bg-stone-800" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Pills */}
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2">
          {filters.map((filter) => (
            <Button
              key={filter.id}
              variant="outline"
              size="sm"
              className={`
                rounded-full px-4 py-2 text-sm font-bold whitespace-nowrap
                ${
                  activeFilter === filter.id
                    ? "bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600 text-black border-black"
                    : "bg-stone-800 border-stone-600 text-stone-300 hover:bg-stone-700"
                }
              `}
              onClick={() => setActiveFilter(filter.id)}
            >
              <span className="mr-1">{filter.emoji}</span>
              {filter.label}
            </Button>
          ))}
        </div>
      </ScrollArea>

      {/* Tokens Grid */}
      <div className="grid grid-cols-1 gap-3">
        {filteredTokens.length === 0 ? (
          <div className="text-center py-8 text-stone-400">
            No tokens found for this filter
          </div>
        ) : (
          filteredTokens
            .slice(0, visibleTokens)
            .map((token) => <TokenCard key={token.id} token={token} />)
        )}
      </div>

      {/* Load More */}
      {visibleTokens < filteredTokens.length && (
        <div className="pt-4">
          <Button
            onClick={loadMore}
            variant="outline"
            className="w-full py-3 rounded-xl border-2 border-stone-600 bg-stone-800 font-bold text-white hover:bg-stone-700"
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}

// components/home/TokensGrid.tsx
"use client";

import { TokenCard } from "@/components/tokens/token-card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

export function TokensGrid({
  tokens,
  isLoading,
  activeFilter,
  setActiveFilter,
  visibleTokens,
  loadMore,
}: {
  tokens: any[];
  isLoading: boolean;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  visibleTokens: number;
  loadMore: () => void;
}) {
  const filters = [
    { id: "all", label: "All", emoji: "🔥" },
    { id: "trending", label: "Trending", emoji: "📈" },
    { id: "new", label: "New", emoji: "🆕" },
    { id: "gainers", label: "Gainers", emoji: "🚀" },
    { id: "losers", label: "Losers", emoji: "📉" },
  ];

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

      <div className="grid grid-cols-1 gap-3">
        {tokens.length === 0 ? (
          <div className="text-center text-sm py-8 text-stone-400">
            No tokens found for this filter
          </div>
        ) : (
          tokens
            .slice(0, visibleTokens)
            .map((token) => <TokenCard key={token.id} token={token} />)
        )}
      </div>

      {visibleTokens < tokens.length && (
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

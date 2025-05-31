"use client";

"use client";

import { TokenCard } from "@/components/tokens/token-card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Dummy data
const dummyTokens = [
  {
    id: "1",
    name: "Yellow Doge",
    symbol: "YDOGE",
    price: 0.0234,
    priceChange24h: 45.67,
    marketCap: 2340000,
    volume24h: 567000,
  },
  {
    id: "2",
    name: "Prague Pepe",
    symbol: "PPEPE",
    price: 0.0567,
    priceChange24h: 23.45,
    marketCap: 5670000,
    volume24h: 890000,
  },
  {
    id: "3",
    name: "Banana Coin",
    symbol: "BANANA",
    price: 0.0123,
    priceChange24h: -12.34,
    marketCap: 1230000,
    volume24h: 234000,
  },
  {
    id: "4",
    name: "Fire Token",
    symbol: "FIRE",
    price: 0.0789,
    priceChange24h: 67.89,
    marketCap: 7890000,
    volume24h: 1234000,
  },
  {
    id: "5",
    name: "Base Bull",
    symbol: "BBULL",
    price: 0.0012,
    priceChange24h: 120.45,
    marketCap: 120000,
    volume24h: 45000,
  },
  {
    id: "6",
    name: "Eth Cat",
    symbol: "ECAT",
    price: 0.0345,
    priceChange24h: -5.67,
    marketCap: 3450000,
    volume24h: 678000,
  },
  {
    id: "7",
    name: "Poly Frog",
    symbol: "PFROG",
    price: 0.0056,
    priceChange24h: 34.56,
    marketCap: 560000,
    volume24h: 123000,
  },
  {
    id: "8",
    name: "Yellow Moon",
    symbol: "YMOON",
    price: 0.0078,
    priceChange24h: 89.01,
    marketCap: 780000,
    volume24h: 345000,
  },
];

export function TokensGrid() {
  const [visibleTokens, setVisibleTokens] = useState(6);
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "All", emoji: "🔥" },
    { id: "trending", label: "Trending", emoji: "📈" },
    { id: "new", label: "New", emoji: "🆕" },
    { id: "gainers", label: "Gainers", emoji: "🚀" },
    { id: "losers", label: "Losers", emoji: "📉" },
  ];

  const loadMore = () => {
    setVisibleTokens((prev) => prev + 6);
  };

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
        {dummyTokens.slice(0, visibleTokens).map((token) => (
          <TokenCard key={token.id} token={token} />
        ))}
      </div>

      {/* Load More */}
      {visibleTokens < dummyTokens.length && (
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

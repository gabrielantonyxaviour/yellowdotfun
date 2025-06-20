"use client"

import { TokenCard } from "@/components/tokens/token-card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

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
    chain: "Ethereum",
    chainId: 1,
  },
  {
    id: "2",
    name: "Prague Pepe",
    symbol: "PPEPE",
    price: 0.0567,
    priceChange24h: 23.45,
    marketCap: 5670000,
    volume24h: 890000,
    chain: "Polygon",
    chainId: 137,
  },
  {
    id: "3",
    name: "Banana Coin",
    symbol: "BANANA",
    price: 0.0123,
    priceChange24h: -12.34,
    marketCap: 1230000,
    volume24h: 234000,
    chain: "BSC",
    chainId: 56,
  },
  {
    id: "4",
    name: "Fire Token",
    symbol: "FIRE",
    price: 0.0789,
    priceChange24h: 67.89,
    marketCap: 7890000,
    volume24h: 1234000,
    chain: "Avalanche",
    chainId: 43114,
  },
  {
    id: "5",
    name: "Base Bull",
    symbol: "BBULL",
    price: 0.0012,
    priceChange24h: 120.45,
    marketCap: 120000,
    volume24h: 45000,
    chain: "Base",
    chainId: 8453,
  },
  {
    id: "6",
    name: "Eth Cat",
    symbol: "ECAT",
    price: 0.0345,
    priceChange24h: -5.67,
    marketCap: 3450000,
    volume24h: 678000,
    chain: "Ethereum",
    chainId: 1,
  },
  {
    id: "7",
    name: "Poly Frog",
    symbol: "PFROG",
    price: 0.0056,
    priceChange24h: 34.56,
    marketCap: 560000,
    volume24h: 123000,
    chain: "Polygon",
    chainId: 137,
  },
  {
    id: "8",
    name: "Yellow Moon",
    symbol: "YMOON",
    price: 0.0078,
    priceChange24h: 89.01,
    marketCap: 780000,
    volume24h: 345000,
    chain: "BSC",
    chainId: 56,
  },
]

export function TokensGrid() {
  const [visibleTokens, setVisibleTokens] = useState(8)

  const loadMore = () => {
    setVisibleTokens((prev) => prev + 8)
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dummyTokens.slice(0, visibleTokens).map((token) => (
          <TokenCard key={token.id} token={token} />
        ))}
      </div>

      {visibleTokens < dummyTokens.length && (
        <div className="flex justify-center">
          <Button onClick={loadMore} className="yellow-button">
            Load More
          </Button>
        </div>
      )}
    </div>
  )
}

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown } from "lucide-react"
import { formatNumber, formatPercentage } from "@/lib/utils"

// Dummy data
const dummyTokens = [
  {
    id: "1",
    name: "Yellow Doge",
    symbol: "YDOGE",
    price: 0.0234,
    priceChange24h: 45.67,
    balance: 1000000,
    value: 23400,
    chain: "Ethereum",
  },
  {
    id: "2",
    name: "Prague Pepe",
    symbol: "PPEPE",
    price: 0.0567,
    priceChange24h: 23.45,
    balance: 500000,
    value: 28350,
    chain: "Polygon",
  },
  {
    id: "3",
    name: "Banana Coin",
    symbol: "BANANA",
    price: 0.0123,
    priceChange24h: -12.34,
    balance: 2000000,
    value: 24600,
    chain: "BSC",
  },
  {
    id: "5",
    name: "Base Bull",
    symbol: "BBULL",
    price: 0.0012,
    priceChange24h: 120.45,
    balance: 5000000,
    value: 6000,
    chain: "Base",
  },
]

export function PortfolioTokens() {
  return (
    <Card className="yellow-border yellow-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Tokens</h2>
          <Button className="yellow-button">Import Tokens</Button>
        </div>

        <div className="space-y-4">
          {dummyTokens.map((token) => (
            <div key={token.id} className="yellow-border p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-yellow-400 yellow-border flex items-center justify-center text-lg font-bold">
                    {token.symbol.substring(0, 1)}
                  </div>
                  <div>
                    <h3 className="font-bold">{token.name}</h3>
                    <p className="text-sm text-gray-600">{token.chain}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">${formatNumber(token.value)}</p>
                  <p className="text-sm text-gray-600">
                    {formatNumber(token.balance)} {token.symbol}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Price: ${formatNumber(token.price)}</p>
                  <p
                    className={`text-sm flex items-center gap-1 ${token.priceChange24h >= 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {token.priceChange24h >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    {formatPercentage(token.priceChange24h)} (24h)
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="yellow-border">
                    Buy
                  </Button>
                  <Button variant="outline" size="sm" className="yellow-border">
                    Sell
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

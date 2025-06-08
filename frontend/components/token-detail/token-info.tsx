"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { formatNumber, formatPercentage } from "@/lib/utils"
import { TrendingUp, TrendingDown, Users, DollarSign, BarChart3 } from "lucide-react"

interface TokenInfoProps {
  token: {
    id: string
    name: string
    symbol: string
    description?: string
    price: number
    priceChange24h: number
    marketCap: number
    volume24h?: number
    holders?: number
    rank?: number
  }
}

export function TokenInfo({ token }: TokenInfoProps) {
  const isPositive = token.priceChange24h >= 0

  return (
    <Card className="yellow-border yellow-shadow bg-card p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="token-image w-20 h-20">
            <Image
              src="/placeholder.svg?height=80&width=80"
              alt={token.name}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-black yellow-text">{token.name}</h1>
            <p className="text-lg font-bold text-gray-600 dark:text-gray-400">${token.symbol}</p>
          </div>
        </div>
        <Badge className="yellow-border bg-yellow-400 text-black font-bold">Rank #{token.rank || 1}</Badge>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 yellow-border p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm font-medium">Price</span>
          </div>
          <p className="text-xl font-bold">${formatNumber(token.price)}</p>
          <p
            className={`text-sm font-medium flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}
          >
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            {formatPercentage(token.priceChange24h)}
          </p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 yellow-border p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4" />
            <span className="text-sm font-medium">Market Cap</span>
          </div>
          <p className="text-xl font-bold">${formatNumber(token.marketCap)}</p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 yellow-border p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4" />
            <span className="text-sm font-medium">Holders</span>
          </div>
          <p className="text-xl font-bold">{formatNumber(token.holders || 0)}</p>
        </div>

        <div className="bg-yellow-50 dark:bg-yellow-900/20 yellow-border p-4 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4" />
            <span className="text-sm font-medium">Volume 24h</span>
          </div>
          <p className="text-xl font-bold">${formatNumber(token.volume24h || 0)}</p>
        </div>
      </div>

      {token.description && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">About</h3>
          <p className="text-gray-600 dark:text-gray-400">{token.description}</p>
        </div>
      )}
    </Card>
  )
}

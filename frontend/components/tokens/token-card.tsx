"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { TrendingUp, TrendingDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { formatNumber, formatPercentage } from "@/lib/utils"

interface TokenCardProps {
  token: {
    id: string
    name: string
    symbol: string
    price: number
    priceChange24h: number
    marketCap: number
    volume24h: number
  }
}

export function TokenCard({ token }: TokenCardProps) {
  const isPositive = token.priceChange24h >= 0

  return (
    <Card className="degen-card overflow-hidden">
      <Link href={`/token/${token.id}`}>
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="token-image">
                <Image
                  src="/placeholder.svg?height=64&width=64"
                  alt={token.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg">{token.name}</h3>
                <p className="text-sm text-gray-600">${token.symbol}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Price</span>
              <span className="font-bold">${formatNumber(token.price)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">24h</span>
              <span className={`font-bold flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
                {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                {formatPercentage(token.priceChange24h)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Market Cap</span>
              <span className="font-bold">${formatNumber(token.marketCap)}</span>
            </div>
          </div>

          <Button className="w-full mt-4 yellow-button">Trade Now</Button>
        </div>
      </Link>
    </Card>
  )
}

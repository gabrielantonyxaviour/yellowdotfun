"use client"
import { Button } from "@/components/ui/button"
import { Crown, TrendingUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { formatNumber, formatPercentage } from "@/lib/utils"

export function KingOfHill() {
  // Mock data for king of the hill
  const kingToken = {
    id: "1",
    name: "Yellow Doge",
    symbol: "YDOGE",
    price: 0.0234,
    priceChange24h: 145.67,
    marketCap: 2340000,
    volume24h: 567000,
  }

  return (
    <div className="mb-12">
      <div className="flex items-center gap-2 mb-4">
        <Crown className="h-6 w-6 text-yellow-400" />
        <h2 className="text-2xl font-black">King of the Hill</h2>
      </div>

      <div className="king-of-hill">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="token-image w-24 h-24 flex-shrink-0">
            <Image
              src="/placeholder.svg?height=100&width=100"
              alt={kingToken.name}
              width={100}
              height={100}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-grow">
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <div>
                <h3 className="text-3xl font-black">{kingToken.name}</h3>
                <p className="text-xl font-bold">${kingToken.symbol}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black">${formatNumber(kingToken.price)}</p>
                <p className="text-xl font-bold text-green-600 flex items-center justify-end gap-1">
                  <TrendingUp className="h-5 w-5" />
                  {formatPercentage(kingToken.priceChange24h)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p className="text-sm font-medium">Market Cap</p>
                <p className="text-lg font-bold">${formatNumber(kingToken.marketCap)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Volume (24h)</p>
                <p className="text-lg font-bold">${formatNumber(kingToken.volume24h)}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Rank</p>
                <p className="text-lg font-bold">#1</p>
              </div>
              <div>
                <p className="text-sm font-medium">Holders</p>
                <p className="text-lg font-bold">1,234</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Link href={`/token/${kingToken.id}`} className="flex-grow md:flex-grow-0">
                <Button className="yellow-button w-full md:w-auto">Trade Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

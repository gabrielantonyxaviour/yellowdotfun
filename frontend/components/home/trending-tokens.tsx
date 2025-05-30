"use client"

import { TokenCard } from "@/components/tokens/token-card"
import { useTrendingTokens } from "@/hooks/use-tokens"
import { Skeleton } from "@/components/ui/skeleton"
import { TrendingUp } from "lucide-react"

export function TrendingTokens() {
  const { tokens, isLoading } = useTrendingTokens()

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-black cartoon-text flex items-center gap-2">
            <TrendingUp className="h-8 w-8 text-yellow-400" />
            Trending Now 🔥
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-64 cartoon-border" />)
            : tokens?.map((token) => <TokenCard key={token.id} token={token} />)}
        </div>
      </div>
    </section>
  )
}

"use client"

import { TokenCard } from "@/components/tokens/token-card"
import { useRecentTokens } from "@/hooks/use-tokens"
import { Skeleton } from "@/components/ui/skeleton"
import { Sparkles } from "lucide-react"

export function RecentLaunches() {
  const { tokens, isLoading } = useRecentTokens()

  return (
    <section className="py-16 px-4 bg-yellow-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-black cartoon-text flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-yellow-400" />
            Fresh Launches ✨
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-64 cartoon-border" />)
            : tokens?.map((token) => <TokenCard key={token.id} token={token} />)}
        </div>
      </div>
    </section>
  )
}

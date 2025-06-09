"use client";

import { TokenCard } from "@/components/tokens/token-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sparkles } from "lucide-react";
import { useState, useEffect } from "react";
import { getRecentTokens } from "@/lib/api";

export function RecentLaunches() {
  const [tokens, setTokens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchRecentTokens() {
      try {
        const data = await getRecentTokens();
        setTokens(data);
      } catch (error) {
        console.error("Failed to fetch recent tokens:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRecentTokens();
  }, []);

  return (
    <section className="py-16 px-4 bg-stone-900">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-4xl font-black cartoon-text flex items-center gap-2 text-white">
            <Sparkles className="h-8 w-8 text-yellow-400" />
            Fresh Launches ✨
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-64 cartoon-border bg-stone-800"
                />
              ))
            : tokens?.map((token) => (
                <TokenCard key={token.id} token={token} />
              ))}
        </div>
      </div>
    </section>
  );
}

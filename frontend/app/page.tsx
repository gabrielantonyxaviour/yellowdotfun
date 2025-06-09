"use client";
import { HomeHero } from "@/components/home/home-hero";
import { KingOfHill } from "@/components/home/king-of-hill";
import { TokensGrid } from "@/components/home/tokens-grid";
import { getAllTokens, getKingToken } from "@/lib/api";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [kingToken, setKingToken] = useState<any>(null);
  const [isKingTokenLoading, setIsKingTokenLoading] = useState(true);
  const [tokens, setTokens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleTokens, setVisibleTokens] = useState(6);

  useEffect(() => {
    async function fetchKingToken() {
      try {
        const data = await getKingToken();
        setKingToken(data);
      } catch (error) {
        console.error("Failed to fetch king token:", error);
      } finally {
        setIsKingTokenLoading(false);
      }
    }

    fetchKingToken();
  }, []);

  useEffect(() => {
    fetchTokens();
  }, [activeFilter]);

  async function fetchTokens() {
    try {
      setIsLoading(true);
      const data = await getAllTokens({
        filter: activeFilter,
        limit: 50,
      });
      setTokens(data);
    } catch (error) {
      console.error("Failed to fetch tokens:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const loadMore = () => {
    setVisibleTokens((prev) => prev + 6);
  };

  return (
    <main className="px-4 pb-20">
      <HomeHero fetchTokens={fetchTokens} />
      <KingOfHill kingToken={kingToken} isLoading={isKingTokenLoading} />
      <TokensGrid
        tokens={tokens}
        isLoading={isLoading}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        visibleTokens={visibleTokens}
        loadMore={loadMore}
      />
    </main>
  );
}

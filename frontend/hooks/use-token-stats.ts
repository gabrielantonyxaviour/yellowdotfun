// hooks/use-token-stats.ts
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface TokenStats {
  id: string;
  token_name: string;
  token_symbol: string;
  token_image?: string;
  buy_count: number;
  sell_count: number;
  latest_price: number;
  price_change_24h: number;
}

export function useTokenStats() {
  const [tokens, setTokens] = useState<TokenStats[]>([]);
  const [kingToken, setKingToken] = useState<TokenStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTokenStats() {
      try {
        setIsLoading(true);

        // Get token stats with transaction counts
        const { data: tokenStats, error } = await supabase.rpc(
          "get_token_stats"
        );

        if (error) throw error;

        setTokens(tokenStats || []);

        // King of hill is token with highest buy count
        const king = (tokenStats as TokenStats[])?.reduce((prev, current) =>
          prev.buy_count > current.buy_count ? prev : current
        );
        setKingToken(king || null);
      } catch (error) {
        console.error("Error fetching token stats:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTokenStats();
  }, []);

  return { tokens, kingToken, isLoading };
}

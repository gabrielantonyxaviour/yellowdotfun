// hooks/use-token-data.ts
import { useState, useEffect } from "react";
import { supabase, type Token, type Transaction } from "@/lib/supabase";

interface TokenData {
  token: Token | null;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

export function useTokenData(tokenId: string): TokenData {
  const [data, setData] = useState<TokenData>({
    token: null,
    transactions: [],
    isLoading: true,
    error: null,
  });

  // Initial fetch
  useEffect(() => {
    async function fetchTokenData() {
      try {
        setData((prev) => ({ ...prev, isLoading: true, error: null }));

        // Fetch token with transactions in a single query using join
        const { data: result, error } = await supabase
          .from("tokens")
          .select(
            `
            *,
            transactions (
              id,
              action,
              token_amount,
              usd_amount,
              user_address,
              timestamp,
              created_at
            )
          `
          )
          .eq("id", tokenId)
          .order("timestamp", {
            foreignTable: "transactions",
            ascending: false,
          })
          .single();

        if (error) throw error;

        setData({
          token: result,
          transactions: result.transactions || [],
          isLoading: false,
          error: null,
        });
      } catch (error) {
        console.error("Error fetching token data:", error);
        setData((prev) => ({
          ...prev,
          isLoading: false,
          error: error instanceof Error ? error.message : "Unknown error",
        }));
      }
    }

    if (tokenId) {
      fetchTokenData();
    }
  }, [tokenId]);

  // WebSocket subscription for real-time transactions
  useEffect(() => {
    if (!data.token) return;

    const channel = supabase
      .channel(`token-${tokenId}-transactions`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "transactions",
          filter: `token_id=eq.${tokenId}`,
        },
        (payload) => {
          const newTransaction = payload.new as Transaction;
          setData((prev) => ({
            ...prev,
            transactions: [newTransaction, ...prev.transactions],
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tokenId, data.token]);

  return data;
}

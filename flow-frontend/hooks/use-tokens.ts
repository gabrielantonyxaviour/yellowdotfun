"use client";

import { useState, useEffect } from "react";
import type { Token } from "@/lib/types";

export function useTrendingTokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTokens() {
      try {
        const response = await fetch("/api/tokens/trending");
        if (response.ok) {
          const data = await response.json();
          setTokens(data.tokens);
        }
      } catch (error) {
        console.error("Failed to fetch trending tokens:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTokens();
  }, []);

  return { tokens, isLoading };
}

export function useRecentTokens() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTokens() {
      try {
        const response = await fetch("/api/tokens/recent");
        if (response.ok) {
          const data = await response.json();
          setTokens(data.tokens);
        }
      } catch (error) {
        console.error("Failed to fetch recent tokens:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTokens();
  }, []);

  return { tokens, isLoading };
}

export function useToken(tokenId: string) {
  const [token, setToken] = useState<Token | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchToken() {
      try {
        const response = await fetch(`/api/tokens/${tokenId}`);
        if (response.ok) {
          const data = await response.json();
          setToken(data.token);
        }
      } catch (error) {
        console.error("Failed to fetch token:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchToken();
  }, [tokenId]);

  return { token, isLoading };
}

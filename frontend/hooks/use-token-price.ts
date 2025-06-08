import { useState, useEffect } from "react";

export function useTokenPrice(token: string) {
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;

    const fetchPrice = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/token-price?token=${token}`);
        const data = await response.json();
        setPrice(data[token.toUpperCase()]?.usd || 0);
      } catch (error) {
        console.error("Failed to fetch price:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 30000); // Update every 30s

    return () => clearInterval(interval);
  }, [token]);

  return { price, loading };
}

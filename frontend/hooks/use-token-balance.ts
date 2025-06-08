import { useState, useEffect } from "react";
import { publicClient } from "@/lib/constants";
import { erc20Abi } from "viem";

export function useTokenBalance(address?: string) {
  const [balance, setBalance] = useState<bigint>(BigInt("0"));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const USDC_ADDRESS = "0x2aaBea2058b5aC2D339b163C6Ab6f2b6d53aabED";

  useEffect(() => {
    if (!address) {
      setBalance(BigInt("0"));
      setIsLoading(false);
      return;
    }

    async function fetchBalance() {
      try {
        console.log("Fetching balance for address:", address);
        setIsLoading(true);
        const balance = await publicClient.readContract({
          address: USDC_ADDRESS as `0x${string}`,
          abi: erc20Abi,
          functionName: "balanceOf",
          args: [address as `0x${string}`],
        });
        console.log("Balance fetched:", balance.toString());
        setBalance(balance);
        setError(null);
      } catch (err) {
        console.error("Error fetching balance:", err);
        setError(
          err instanceof Error ? err.message : "Failed to fetch balance"
        );
      } finally {
        setIsLoading(false);
      }
    }

    fetchBalance();
  }, [address]);

  return { balance, isLoading, error };
}

// hooks/useMultiChainBalance.ts
import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { createPublicClient, http, formatEther } from "viem";
import { chains, usdcAddresses } from "@/components/providers/privy-provider";

interface ChainBalance {
  chainId: number;
  native: string;
  usdc: string;
  nativeUsd: number;
  usdcUsd: number;
  totalUsd: number;
  loading: boolean;
}

export function useMultiChainBalance() {
  const { user } = usePrivy();
  const [balances, setBalances] = useState<ChainBalance[]>([]);
  const [totalUsd, setTotalUsd] = useState(0);

  const updateChainBalance = (
    chainId: number,
    update: Partial<ChainBalance>
  ) => {
    setBalances((prev) => {
      const existing = prev.find((b) => b.chainId === chainId);
      if (existing) {
        const updated = prev.map((b) =>
          b.chainId === chainId ? { ...b, ...update } : b
        );
        setTotalUsd(updated.reduce((sum, b) => sum + b.totalUsd, 0));
        return updated;
      } else {
        const newBalance = {
          chainId,
          native: "0",
          usdc: "0",
          nativeUsd: 0,
          usdcUsd: 0,
          totalUsd: 0,
          loading: true,
          ...update,
        };
        const updated = [...prev, newBalance];
        setTotalUsd(updated.reduce((sum, b) => sum + b.totalUsd, 0));
        return updated;
      }
    });
  };

  useEffect(() => {
    if (!user?.wallet?.address) return;

    chains.forEach(async (chain) => {
      updateChainBalance(chain.id, { loading: true });

      const client = createPublicClient({
        chain,
        transport: http(),
      });

      try {
        // Fetch native balance
        const nativeBalance = await client.getBalance({
          address: user?.wallet?.address as `0x${string}`,
        });

        // Fetch USDC balance if contract exists
        let usdcBalance = BigInt("0");
        const usdcAddress = usdcAddresses[chain.id];
        if (usdcAddress) {
          usdcBalance = await client.readContract({
            address: usdcAddress as `0x${string}`,
            abi: [
              {
                name: "balanceOf",
                type: "function",
                stateMutability: "view",
                inputs: [{ type: "address" }],
                outputs: [{ type: "uint256" }],
              },
            ],
            functionName: "balanceOf",
            args: [user?.wallet?.address as `0x${string}`],
          });
        }

        // Get prices (you'll need to implement this)
        const prices = await fetchPrices(chain.id);

        const nativeEth = formatEther(nativeBalance);
        const usdcFormatted = (Number(usdcBalance) / 1e6).toString();
        const nativeUsd = parseFloat(nativeEth) * prices.native;
        const usdcUsd = parseFloat(usdcFormatted) * prices.usdc;

        updateChainBalance(chain.id, {
          native: nativeEth,
          usdc: usdcFormatted,
          nativeUsd,
          usdcUsd,
          totalUsd: nativeUsd + usdcUsd,
          loading: false,
        });
      } catch (error) {
        updateChainBalance(chain.id, { loading: false });
      }
    });
  }, [user?.wallet?.address]);

  return { balances, totalUsd };
}

async function fetchPrices(chainId: number) {
  // Use CoinGecko or similar - implement based on your preference
  const response = await fetch(`/api/prices?chainId=${chainId}`);
  return response.json();
}

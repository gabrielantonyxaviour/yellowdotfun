import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

type ChainId =
  | 1
  | 137
  | 43114
  | 56
  | 8453
  | 11155111
  | 80002
  | 43113
  | 97
  | 84532;

const CHAIN_INFO: Record<
  ChainId,
  { name: string; logo: string; symbol: string }
> = {
  1: { name: "Ethereum", logo: "eth.png", symbol: "ETH" },
  137: { name: "Polygon", logo: "pol.png", symbol: "MATIC" },
  43114: { name: "Avalanche", logo: "avax.png", symbol: "AVAX" },
  56: { name: "BSC", logo: "bsc.png", symbol: "BNB" },
  8453: { name: "Base", logo: "base.png", symbol: "ETH" },
  11155111: { name: "Base Sepolia", logo: "base.png", symbol: "ETH" },
  80002: { name: "Polygon Mumbai", logo: "pol.png", symbol: "MATIC" },
  43113: { name: "Avalanche Fuji", logo: "avax.png", symbol: "AVAX" },
  97: { name: "BSC Testnet", logo: "bsc.png", symbol: "BNB" },
  84532: { name: "Base Sepolia", logo: "base.png", symbol: "ETH" },
};

type ChainBalance = {
  chainId: number;
  native: string;
  usdc: string;
  totalUsd: number;
  loading: boolean;
};

export function ChainBalanceDropdown({
  balances,
  totalUsd,
}: {
  balances: ChainBalance[];
  totalUsd: number;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center text-sm font-medium hover:bg-yellow-500/20 px-2 py-1 rounded">
        ${totalUsd.toFixed(2)}
        <ChevronDown className="ml-1 h-3 w-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="yellow-border w-64">
        {balances.map((balance) => {
          const chain = CHAIN_INFO[balance.chainId as ChainId];
          if (!chain) return null;

          return (
            <DropdownMenuItem
              key={balance.chainId}
              className="flex items-center justify-between p-3"
            >
              <div className="flex items-center">
                <Image
                  src={`/${chain.logo}`}
                  alt={chain.name}
                  width={20}
                  height={20}
                  className="mr-2"
                />
                <span className="font-medium">{chain.name}</span>
              </div>
              <div className="text-right">
                {balance.loading ? (
                  <div className="animate-pulse bg-gray-300 h-4 w-16 rounded"></div>
                ) : (
                  <>
                    <div className="font-bold">
                      ${balance.totalUsd.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-600">
                      {parseFloat(balance.native).toFixed(4)} {chain.symbol}
                      {parseFloat(balance.usdc) > 0 && (
                        <> + {parseFloat(balance.usdc).toFixed(2)} USDC</>
                      )}
                    </div>
                  </>
                )}
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

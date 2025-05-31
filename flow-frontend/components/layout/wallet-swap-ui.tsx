// components/WalletSwapUI.tsx
import { useState, useEffect } from "react";
import { useAccount, useBalance } from "wagmi";
import { ChevronDown } from "lucide-react";
import { formatEther, parseEther } from "viem";
import { publicClient } from "@/lib/constants";

interface TokenBalance {
  symbol: string;
  icon: string;
}

interface TokenPrices {
  FLOW: number;
  USD: number;
}

export function WalletSwapUI({ balance }: { balance: number }) {
  const { address } = useAccount();
  const [fromToken, setFromToken] = useState<"USD" | "FLOW">("USD");
  const [toToken, setToToken] = useState<"USD" | "FLOW">("FLOW");
  const [amount, setAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [isFlipped, setIsFlipped] = useState(false);
  const [prices, setPrices] = useState<TokenPrices>({ FLOW: 0, USD: 1 });
  const [priceLoading, setPriceLoading] = useState(true);
  const [flowBalance, setFlowBalance] = useState<string>("0");

  useEffect(() => {
    if (!address) return;
    (async function () {
      const data = await publicClient.getBalance({
        address: address,
      });

      setFlowBalance(parseFloat(formatEther(data)).toFixed(2));
    })();
  }, [address]);

  const tokens: Record<string, TokenBalance> = {
    USD: {
      symbol: "USD",
      icon: "/usd.png",
    },
    FLOW: {
      symbol: "FLOW",
      icon: "/flow.png",
    },
  };

  // Fetch token prices on mount
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch("/api/token-price?token=FLOW");
        const data = await response.json();
        setPrices({
          FLOW: data.FLOW?.usd || 0,
          USD: 1,
        });
      } catch (error) {
        console.error("Failed to fetch prices:", error);
      } finally {
        setPriceLoading(false);
      }
    };

    fetchPrices();
  }, []);

  // Calculate conversion when amount or tokens change
  useEffect(() => {
    if (!amount || priceLoading) {
      setToAmount("");
      return;
    }

    const fromPrice = prices[fromToken];
    const toPrice = prices[toToken];

    if (fromPrice && toPrice) {
      const converted = (parseFloat(amount) * fromPrice) / toPrice;
      setToAmount(converted.toFixed(6));
    }
  }, [amount, fromToken, toToken, prices, priceLoading]);

  const swapTokens = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setIsFlipped(!isFlipped);
    setAmount("");
    setToAmount("");
  };

  const hasInsufficientBalance = () => {
    if (!amount) return false;
    const fromBalance = fromToken === "USD" ? balance : parseFloat(flowBalance);
    const inputAmount = parseFloat(amount);
    return inputAmount > fromBalance;
  };

  const isSwapDisabled = !amount || hasInsufficientBalance() || priceLoading;

  return (
    <div className="space-y-1 p-4 max-w-sm mx-auto">
      <div className="text-xs text-stone-400 mb-4 flex justify-center items-center gap-1">
        <span>
          {address?.slice(0, 6)}...{address?.slice(-4)}
        </span>
        <button
          onClick={() => navigator.clipboard.writeText(address || "")}
          className="hover:text-yellow-400 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
        </button>
      </div>

      {/* From Token */}
      <div className="bg-stone-800 rounded-lg p-3 border border-stone-600 relative my-2 -translate-y-[1.5px] z-10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-stone-400">From</span>
          <span className="text-xs text-stone-400">
            Balance: {fromToken === "USD" ? balance : parseFloat(flowBalance)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.0"
            className="flex-1 text-lg bg-transparent outline-none text-yellow-400 placeholder-stone-500 mr-2"
          />
          <div className="flex items-center space-x-2 flex-shrink-0">
            <img
              src={tokens[fromToken].icon}
              alt={fromToken}
              className="w-5 h-5 rounded-full"
            />
            <span className="font-medium text-yellow-400 text-sm">
              {fromToken}
            </span>
          </div>
        </div>
      </div>

      {/* Swap Button - Overlapping */}
      <div className="flex justify-center absolute top-[45%] left-[45%] z-20">
        <button
          onClick={swapTokens}
          className="p-2 border border-stone-600 rounded-lg hover:bg-stone-800 bg-stone-900"
        >
          <ChevronDown
            className={`w-4 h-4 text-yellow-400 transition-transform duration-200 ${
              isFlipped ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>
      </div>

      {/* To Token */}
      <div className="bg-stone-800 rounded-lg p-3 border border-stone-600 relative translate-y-[1.5px] z-10">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-stone-400">To</span>
          <span className="text-xs text-stone-400">
            Balance: {toToken === "USD" ? balance : parseFloat(flowBalance)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <input
            type="number"
            value={toAmount}
            placeholder="0.0"
            disabled
            className="flex-1 text-lg bg-transparent outline-none text-stone-400 placeholder-stone-500 mr-2"
          />
          <div className="flex items-center space-x-2 flex-shrink-0">
            <img
              src={tokens[toToken].icon}
              alt={toToken}
              className="w-5 h-5 rounded-full"
            />
            <span className="font-medium text-yellow-400 text-sm">
              {toToken}
            </span>
          </div>
        </div>
      </div>

      <button
        disabled={isSwapDisabled}
        className={`w-full py-3 rounded-lg font-semibold text-sm translate-y-[8px] ${
          isSwapDisabled
            ? "bg-stone-700 text-stone-400 cursor-not-allowed"
            : "bg-gradient-to-r from-yellow-400 via-yellow-600 to-yellow-400 text-black hover:opacity-90"
        }`}
      >
        {hasInsufficientBalance() ? "Insufficient Funds" : "Swap"}
      </button>
    </div>
  );
}

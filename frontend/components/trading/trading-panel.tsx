// Updated TradingPanel component
"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { formatNumber } from "@/lib/utils";
import { buyToken, sellToken, getTokenPrice } from "@/lib/api";

interface TradingPanelProps {
  token: {
    id: string;
    name: string;
    symbol: string;
    price: number;
  };
}

export function TradingPanel({ token }: TradingPanelProps) {
  const [userAddress] = useState(
    () => "0x" + Math.random().toString(16).substr(2, 40)
  );
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [slippage, setSlippage] = useState([1]);
  const [currentPrice, setCurrentPrice] = useState(token.price);
  const [userTokenBalance, setUserTokenBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Initialize with mock data for demo
    setCurrentPrice(token.price || 0.001);
  }, [token.price]);

  const handleBuy = async () => {
    const amount = parseFloat(buyAmount);
    if (amount > 0) {
      try {
        setIsLoading(true);
        const result = await buyToken({
          token_id: token.id,
          user_address: userAddress,
          usd_amount: amount,
        });

        setBuyAmount("");
        setUserTokenBalance((prev) => prev + result.tokenAmount);
        setCurrentPrice(result.finalPrice);

        alert(
          `Successfully bought ${formatNumber(result.tokenAmount)} ${
            token.symbol
          }`
        );
      } catch (error: any) {
        alert("Transaction failed: " + error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSell = async () => {
    const amount = parseFloat(sellAmount);
    if (amount > 0) {
      try {
        setIsLoading(true);
        const result = await sellToken({
          token_id: token.id,
          user_address: userAddress,
          token_amount: amount,
        });

        setSellAmount("");
        setUserTokenBalance((prev) => prev - amount);
        setCurrentPrice(result.finalPrice);

        alert(
          `Successfully sold ${amount} ${token.symbol} for $${formatNumber(
            result.usdAmount
          )}`
        );
      } catch (error: any) {
        alert("Transaction failed: " + error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Card className="bg-stone-800 rounded-lg shadow-lg border-none p-6 sticky top-24">
      <h2 className="text-2xl font-black text-white cartoon-text mb-4">
        Trade ${token.symbol}
      </h2>

      <div className="mb-4 p-4 bg-stone-900 rounded-lg space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-400">Your Balance</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <p className="text-xs text-gray-400">Live</p>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">{token.symbol}</p>
            <p className="font-bold text-white">
              {formatNumber(userTokenBalance)}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-4 p-4 bg-stone-900 rounded-lg space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-gray-400">Current Price</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <p className="text-xs text-gray-400">Live</p>
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-2xl font-black text-white">
            ${formatNumber(currentPrice)}
          </p>
          <p className="text-sm text-gray-400">USD</p>
        </div>
      </div>

      <Tabs defaultValue="buy" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-stone-900 rounded-lg">
          <TabsTrigger value="buy" className="font-semibold">
            Buy
          </TabsTrigger>
          <TabsTrigger value="sell" className="font-semibold">
            Sell
          </TabsTrigger>
        </TabsList>

        <TabsContent value="buy" className="space-y-4">
          <div>
            <Label htmlFor="buy-amount" className="font-bold text-white">
              Amount (USD)
            </Label>
            <Input
              id="buy-amount"
              type="number"
              placeholder="0.00"
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
              className="font-medium text-lg bg-stone-900 border-none text-white"
              step="0.001"
            />
          </div>

          <div>
            <Label className="font-bold text-white">
              You'll receive (approx)
            </Label>
            <div className="bg-stone-900 p-3 rounded-lg">
              <p className="text-lg font-medium text-yellow-400">
                {buyAmount && currentPrice > 0
                  ? formatNumber(parseFloat(buyAmount) / currentPrice)
                  : "0"}{" "}
                {token.symbol}
              </p>
            </div>
          </div>

          <Button
            onClick={handleBuy}
            disabled={!buyAmount || isLoading}
            className="w-full bg-green-500 hover:bg-green-400 text-white font-bold text-lg py-6"
          >
            {isLoading ? "Processing..." : `Buy ${token.symbol}`}
          </Button>
        </TabsContent>

        <TabsContent value="sell" className="space-y-4">
          <div>
            <Label
              htmlFor="sell-amount"
              className="font-semibold text-white pb-1"
            >
              Amount ({token.symbol})
            </Label>
            <Input
              id="sell-amount"
              type="number"
              placeholder="0.00"
              value={sellAmount}
              onChange={(e) => setSellAmount(e.target.value)}
              className="font-bold text-lg bg-stone-900 border-none text-white"
              max={userTokenBalance}
              step="0.000001"
            />
          </div>

          <div>
            <Label className="font-semibold text-white pb-1">
              You'll receive (approx)
            </Label>
            <div className="text-white bg-stone-900 p-3 rounded-lg">
              <p className="text-lg font-bold">
                $
                {sellAmount && currentPrice > 0
                  ? formatNumber(parseFloat(sellAmount) * currentPrice)
                  : "0"}
              </p>
            </div>
          </div>

          <Button
            onClick={handleSell}
            disabled={
              !sellAmount ||
              parseFloat(sellAmount) > userTokenBalance ||
              isLoading
            }
            className="w-full bg-red-500 hover:bg-red-400 text-white font-bold text-lg py-6"
          >
            {isLoading ? "Processing..." : `Sell ${token.symbol}`}
          </Button>
        </TabsContent>
      </Tabs>

      <div className="mt-6 pt-6 border-t-[1px] border-stone-600">
        <div className="flex justify-between items-center mb-2">
          <Label className="font-bold text-white">Slippage Tolerance</Label>
          <span className="font-bold text-white">{slippage[0]}%</span>
        </div>
        <Slider
          value={slippage}
          onValueChange={setSlippage}
          max={10}
          step={0.5}
          className="w-full"
        />
      </div>
    </Card>
  );
}

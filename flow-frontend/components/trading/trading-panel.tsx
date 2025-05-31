// Updated TradingPanel component
"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useTradingStore } from "@/lib/trading-store";
import { formatNumber } from "@/lib/utils";
import { Wallet } from "lucide-react";

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

  const {
    buyToken,
    sellToken,
    getTokenPrice,
    setUserBalance,
    tokens,
    userBalances,
  } = useTradingStore();

  const currentToken = tokens[token.id];
  const currentPrice = getTokenPrice(token.id);
  const userEthBalance = userBalances[userAddress] || 0;
  const userTokenBalance = currentToken?.holders[userAddress] || 0;

  // Initialize user with some ETH
  useEffect(() => {
    if (userEthBalance === 0) {
      setUserBalance(userAddress, 1); // Give user 1 ETH to start
    }
  }, [userAddress, userEthBalance, setUserBalance]);

  const handleBuy = () => {
    const amount = parseFloat(buyAmount);
    if (amount > 0) {
      const success = buyToken(token.id, userAddress, amount);
      if (success) {
        setBuyAmount("");
      } else {
        alert("Insufficient ETH balance or invalid amount");
      }
    }
  };

  const handleSell = () => {
    const amount = parseFloat(sellAmount);
    if (amount > 0) {
      const success = sellToken(token.id, userAddress, amount);
      if (success) {
        setSellAmount("");
      } else {
        alert("Insufficient token balance or invalid amount");
      }
    }
  };

  return (
    <Card className="yellow-border yellow-shadow bg-white p-6 sticky top-24">
      <h2 className="text-2xl font-black cartoon-text mb-4">
        Trade ${token.symbol}
      </h2>

      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-sm font-medium">Your Balance</p>
        <p className="font-bold">{formatNumber(userEthBalance)} ETH</p>
        <p className="font-bold">
          {formatNumber(userTokenBalance)} {token.symbol}
        </p>
      </div>

      <div className="mb-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm font-medium">Current Price</p>
        <p className="text-xl font-bold">${formatNumber(currentPrice)}</p>
      </div>

      <Tabs defaultValue="buy" className="w-full">
        <TabsList className="grid w-full grid-cols-2 cartoon-border">
          <TabsTrigger value="buy" className="font-bold">
            Buy
          </TabsTrigger>
          <TabsTrigger value="sell" className="font-bold">
            Sell
          </TabsTrigger>
        </TabsList>

        <TabsContent value="buy" className="space-y-4">
          <div>
            <Label htmlFor="buy-amount" className="font-bold">
              Amount (ETH)
            </Label>
            <Input
              id="buy-amount"
              type="number"
              placeholder="0.00"
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
              className="cartoon-border font-bold text-lg"
              max={userEthBalance}
              step="0.001"
            />
          </div>

          <div>
            <Label className="font-bold">You'll receive (approx)</Label>
            <div className="cartoon-border bg-gray-50 p-3 rounded-lg">
              <p className="text-lg font-bold">
                {buyAmount && currentPrice > 0
                  ? formatNumber(parseFloat(buyAmount) / currentPrice)
                  : "0"}{" "}
                {token.symbol}
              </p>
            </div>
          </div>

          <Button
            onClick={handleBuy}
            disabled={!buyAmount || parseFloat(buyAmount) > userEthBalance}
            className="w-full cartoon-border cartoon-shadow bg-green-500 hover:bg-green-400 text-white font-bold text-lg py-6"
          >
            Buy {token.symbol}
          </Button>
        </TabsContent>

        <TabsContent value="sell" className="space-y-4">
          <div>
            <Label htmlFor="sell-amount" className="font-bold">
              Amount ({token.symbol})
            </Label>
            <Input
              id="sell-amount"
              type="number"
              placeholder="0.00"
              value={sellAmount}
              onChange={(e) => setSellAmount(e.target.value)}
              className="cartoon-border font-bold text-lg"
              max={userTokenBalance}
              step="0.000001"
            />
          </div>

          <div>
            <Label className="font-bold">You'll receive (approx)</Label>
            <div className="cartoon-border bg-gray-50 p-3 rounded-lg">
              <p className="text-lg font-bold">
                {sellAmount && currentPrice > 0
                  ? formatNumber(parseFloat(sellAmount) * currentPrice)
                  : "0"}{" "}
                ETH
              </p>
            </div>
          </div>

          <Button
            onClick={handleSell}
            disabled={!sellAmount || parseFloat(sellAmount) > userTokenBalance}
            className="w-full cartoon-border cartoon-shadow bg-red-500 hover:bg-red-400 text-white font-bold text-lg py-6"
          >
            Sell {token.symbol}
          </Button>
        </TabsContent>
      </Tabs>

      <div className="mt-6 pt-6 border-t-2 border-black">
        <div className="flex justify-between items-center mb-2">
          <Label className="font-bold">Slippage Tolerance</Label>
          <span className="font-bold">{slippage[0]}%</span>
        </div>
        <Slider
          value={slippage}
          onValueChange={setSlippage}
          max={10}
          step={0.5}
          className="cartoon-border"
        />
      </div>
    </Card>
  );
}

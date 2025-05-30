"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import type { Token } from "@/lib/types";
import { usePrivy } from "@privy-io/react-auth";
import { formatNumber } from "@/lib/utils";
import { Wallet } from "lucide-react";

interface TradingPanelProps {
  token: Token;
}

export function TradingPanel({ token }: TradingPanelProps) {
  const { authenticated, login } = usePrivy();
  const [buyAmount, setBuyAmount] = useState("");
  const [sellAmount, setSellAmount] = useState("");
  const [slippage, setSlippage] = useState([1]);

  const handleBuy = () => {
    if (!authenticated) {
      login();
      return;
    }
    // Trading logic would go here
    console.log("Buy", buyAmount);
  };

  const handleSell = () => {
    if (!authenticated) {
      login();
      return;
    }
    // Trading logic would go here
    console.log("Sell", sellAmount);
  };

  return (
    <Card className="yellow-border yellow-shadow bg-white p-6 sticky top-24">
      <h2 className="text-2xl font-black cartoon-text mb-4">
        Trade ${token.symbol}
      </h2>

      {!authenticated ? (
        <div className="text-center py-8">
          <Wallet className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p className="font-medium mb-4">
            Connect your wallet to start trading
          </p>
          <Button
            onClick={() => login()}
            className="cartoon-border cartoon-shadow bg-yellow-400 hover:bg-yellow-300 text-black font-bold"
          >
            Connect Wallet
          </Button>
        </div>
      ) : (
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
                Amount (USD)
              </Label>
              <Input
                id="buy-amount"
                type="number"
                placeholder="0.00"
                value={buyAmount}
                onChange={(e) => setBuyAmount(e.target.value)}
                className="cartoon-border font-bold text-lg"
              />
            </div>

            <div>
              <Label className="font-bold">You'll receive</Label>
              <div className="cartoon-border bg-gray-50 p-3 rounded-lg">
                <p className="text-lg font-bold">
                  {buyAmount
                    ? formatNumber(Number(buyAmount) / token.price)
                    : "0"}{" "}
                  {token.symbol}
                </p>
              </div>
            </div>

            <Button
              onClick={handleBuy}
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
              />
            </div>

            <div>
              <Label className="font-bold">You'll receive</Label>
              <div className="cartoon-border bg-gray-50 p-3 rounded-lg">
                <p className="text-lg font-bold">
                  $
                  {sellAmount
                    ? formatNumber(Number(sellAmount) * token.price)
                    : "0"}
                </p>
              </div>
            </div>

            <Button
              onClick={handleSell}
              className="w-full cartoon-border cartoon-shadow bg-red-500 hover:bg-red-400 text-white font-bold text-lg py-6"
            >
              Sell {token.symbol}
            </Button>
          </TabsContent>
        </Tabs>
      )}

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

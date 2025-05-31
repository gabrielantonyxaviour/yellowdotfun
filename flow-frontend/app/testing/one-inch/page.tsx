// app/testing/one-inch/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  FusionSDK,
  NetworkEnum,
  OrderStatus,
  Web3ProviderConnector,
  Web3Like,
} from "@1inch/fusion-sdk";
import { ethers } from "ethers";

interface QuoteResult {
  auctionStartAmount: string;
  auctionEndAmount: string;
  presets: any[];
  recommendedPreset: number;
}

interface OrderResult {
  orderHash: string;
  status: string;
  fills?: any[];
  executionTime?: number;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function OneInchTest() {
  const [account, setAccount] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);
  const [apiToken, setApiToken] = useState(
    process.env.NEXT_PUBLIC_ONEINCH_API_TOKEN || ""
  );
  const [fromToken, setFromToken] = useState(
    "0xdac17f958d2ee523a2206206994597c13d831ec7"
  );
  const [toToken, setToToken] = useState(
    "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
  );
  const [amount, setAmount] = useState("10000000");

  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [sdk, setSdk] = useState<FusionSDK | null>(null);

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      addLog("MetaMask not found");
      return;
    }

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        setAccount(accounts[0]);
        setIsConnected(true);
        addLog(`Connected: ${accounts[0]}`);

        // Initialize SDK with Web3Provider
        await initializeSDK();
      }
    } catch (error) {
      addLog(`Connection failed: ${error}`);
    }
  };

  const initializeSDK = async () => {
    if (!window.ethereum || !apiToken) return;

    try {
      // Create Web3Like provider using window.ethereum
      const web3Provider: Web3Like = {
        eth: {
          async call(transactionConfig): Promise<string> {
            return await window.ethereum.request({
              method: "eth_call",
              params: [transactionConfig, "latest"],
            });
          },
        },
        extend(extension: any) {
          // Handle the extend method for signing
          return {
            async signTypedDataV4(address: string, typedData: string) {
              return await window.ethereum.request({
                method: "eth_signTypedData_v4",
                params: [address, typedData],
              });
            },
          };
        },
      };

      const connector = new Web3ProviderConnector(web3Provider);

      const fusionSDK = new FusionSDK({
        url: "https://api.1inch.dev/fusion",
        network: NetworkEnum.BINANCE,
        blockchainProvider: connector,
        authKey: apiToken,
      });

      setSdk(fusionSDK);
      addLog("SDK initialized");
    } catch (error) {
      addLog(`SDK initialization failed: ${error}`);
    }
  };

  const getQuote = async () => {
    if (!sdk || !isConnected) {
      addLog("Connect wallet and initialize SDK first");
      return;
    }

    setLoading(true);
    addLog("Getting quote...");

    try {
      const params = {
        fromTokenAddress: "0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d",
        toTokenAddress: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
        amount: "10000000000000000000",
        walletAddress: account,
        source: "sdk-test",
      };

      const quoteResult = await sdk.getQuote(params);
      const dstTokenDecimals = 18;
      const preset = quoteResult.presets[quoteResult.recommendedPreset];
      if (!preset) throw new Error("No preset found");

      const startAmount = ethers.utils.formatUnits(
        preset.auctionStartAmount,
        dstTokenDecimals
      );
      const endAmount = ethers.utils.formatUnits(
        preset.auctionEndAmount,
        dstTokenDecimals
      );

      setQuote({
        auctionStartAmount: startAmount,
        auctionEndAmount: endAmount,
        presets: Object.values(quoteResult.presets),
        recommendedPreset: Number(quoteResult.recommendedPreset),
      });

      addLog(
        `Quote received - Start: ${startAmount} BNB, End: ${endAmount} BNB`
      );
    } catch (error) {
      addLog(`Quote failed: ${error}`);
    }

    setLoading(false);
  };

  const executeOrder = async () => {
    if (!sdk || !quote || !isConnected) {
      addLog("Get quote first");
      return;
    }

    setLoading(true);
    addLog("Creating and submitting order...");

    try {
      const params = {
        fromTokenAddress: fromToken,
        toTokenAddress: toToken,
        amount: ethers.utils.parseUnits(amount, 6).toString(),
        walletAddress: account,
        source: "sdk-test",
      };

      // Create order
      const preparedOrder = await sdk.createOrder(params);
      addLog("Order created, submitting...");

      // Submit order
      const info = await sdk.submitOrder(
        preparedOrder.order,
        preparedOrder.quoteId
      );
      addLog(`Order submitted: ${info.orderHash}`);

      setOrder({
        orderHash: info.orderHash,
        status: "Submitted",
      });

      // Start polling for status
      pollOrderStatus(info.orderHash);
    } catch (error) {
      addLog(`Order failed: ${error}`);
    }

    setLoading(false);
  };

  const pollOrderStatus = async (orderHash: string) => {
    if (!sdk) return;

    const startTime = Date.now();

    const poll = async () => {
      try {
        const data = await sdk.getOrderStatus(orderHash);

        if (data.status === OrderStatus.Filled) {
          const executionTime = (Date.now() - startTime) / 1000;
          setOrder((prev) =>
            prev
              ? {
                  ...prev,
                  status: "Filled",
                  fills: data.fills,
                  executionTime,
                }
              : null
          );
          addLog(`Order filled in ${executionTime}s`);
          addLog(`Fills: ${JSON.stringify(data.fills)}`);
          return;
        }

        if (data.status === OrderStatus.Expired) {
          setOrder((prev) => (prev ? { ...prev, status: "Expired" } : null));
          addLog("Order expired");
          return;
        }

        if (data.status === OrderStatus.Cancelled) {
          setOrder((prev) => (prev ? { ...prev, status: "Cancelled" } : null));
          addLog("Order cancelled");
          return;
        }

        addLog(`Status: ${data.status}`);
        setTimeout(poll, 3000); // Poll every 3 seconds
      } catch (error) {
        addLog(`Status check failed: ${error}`);
        setTimeout(poll, 5000);
      }
    };

    poll();
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
          initializeSDK();
        } else {
          setAccount("");
          setIsConnected(false);
          setSdk(null);
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, [apiToken]);

  useEffect(() => {
    if (isConnected && apiToken && !sdk) {
      initializeSDK();
    }
  }, [isConnected, apiToken, sdk]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold">1inch Fusion+ SDK Test</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Wallet & Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Button
                onClick={connectWallet}
                className="w-full"
                variant={isConnected ? "secondary" : "default"}
              >
                {isConnected
                  ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
                  : "Connect Wallet"}
              </Button>
            </div>

            <div>
              <Label htmlFor="apiToken">API Token</Label>
              <Input
                id="apiToken"
                type="password"
                value={apiToken}
                onChange={(e) => setApiToken(e.target.value)}
                placeholder="1inch API token"
              />
            </div>

            <div>
              <Label htmlFor="fromToken">From Token (USDC)</Label>
              <Input
                id="fromToken"
                value={fromToken}
                onChange={(e) => setFromToken(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="toToken">To Token (BNB)</Label>
              <Input
                id="toToken"
                value={toToken}
                onChange={(e) => setToToken(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="amount">Amount (USDC)</Label>
              <Input
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="10"
              />
            </div>

            <div className="text-sm text-gray-500">
              SDK Status: {sdk ? "✅ Ready" : "❌ Not initialized"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              onClick={getQuote}
              disabled={loading || !sdk}
              className="w-full"
            >
              {loading ? "Loading..." : "Get Quote"}
            </Button>

            <Button
              onClick={executeOrder}
              disabled={loading || !quote || !sdk}
              className="w-full"
            >
              Execute Order
            </Button>

            {quote && (
              <div className="space-y-2">
                <h3 className="font-semibold">Quote Results</h3>
                <p>Start: {quote.auctionStartAmount} BNB</p>
                <p>End: {quote.auctionEndAmount} BNB</p>
              </div>
            )}

            {order && (
              <div className="space-y-2">
                <h3 className="font-semibold">Order Status</h3>
                <p>Hash: {order.orderHash.slice(0, 10)}...</p>
                <Badge
                  variant={
                    order.status === "Filled"
                      ? "default"
                      : order.status === "Expired" ||
                        order.status === "Cancelled"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {order.status}
                </Badge>
                {order.executionTime && <p>Time: {order.executionTime}s</p>}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={logs.join("\n")}
            readOnly
            className="h-40 font-mono text-sm"
          />
        </CardContent>
      </Card>
    </div>
  );
}
